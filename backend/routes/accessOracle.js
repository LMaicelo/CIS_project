var express = require("express");
var router = express.Router();
const oracledb = require('oracledb');

let oracleInit = false;

function generateRandomColor() {
    return (`rgb(${Math.floor(Math.random()*255)}, ${Math.floor(Math.random()*255)}, ${Math.floor(Math.random()*255)})`);
}

async function runQuery(query) {
    const startTime = Date.now();

    let conn;
    let resultRows;
    try {
        if (!oracleInit) {
            console.log("Starting db init");
            oracledb.initOracleClient({ libDir: '/Users/leona/Downloads/instantclient_19_10/instantclient_19_10' });
            console.log("Done db init");
            oracleInit = true;
        }
        else {
            console.log("DB already initialized. Continuing...");
        }

        console.log("Get connection");
        conn = await oracledb.getConnection({
            user: 'rchenore',
            password: 'Hacking4Nothingora',
            connectString: '(DESCRIPTION = (ADDRESS = (PROTOCOL = TCP)(HOST = oracle.cise.ufl.edu)(PORT = 1521))(CONNECT_DATA = (SID = orcl)))'
        });
    
        console.log("execute");
        resultRows = (await conn.execute(query)).rows;
        console.log("done execute");
        //console.log(resultRows);
    } catch (err) {
        console.error('Whoops1!');
        console.error(err);
        process.exit(1);
    }
    finally {
        console.log('Total time: ' + (Date.now() - startTime));
        try {
            if (conn) {
                conn.release();
            }
        }
        catch (e) {
            console.error('Whoops2!');
            console.error(e);
        }
    }
    console.log("Completely done");

    return resultRows;
}

async function getRelativeRatingBrand(startTime, endTime, interval, brandName) {
    let caseString = generateCaseString(startTime, endTime, interval);
    let fullQuery = 
    `
    SElECT TTT.TimeInterval, AVG(TTT.unbiasedScore) as avgubs
    FROM
        (SELECT 
            rid, 
            x2.overall/avgRating AS unbiasedScore, 
            x2.unix_time,     
            (CASE
                ${caseString}
                END) AS TimeInterval
        FROM
            (SELECT r2.reviewerID as rid, AVG(r2.overall) AS avgRating
            FROM
                (SELECT reviewerID
                FROM AM_REVIEW NATURAL JOIN AM_Brand
                WHERE 
                    brand='${brandName}'
                ) r1,
                AM_REVIEW r2
            WHERE r1.reviewerID = r2.reviewerID
            GROUP BY r2.reviewerID) x1,
            (SELECT reviewerID, unix_time, overall
            FROM AM_Review NATURAL JOIN AM_Brand
            WHERE
                brand='${brandName}'
            ) x2
        WHERE x2.reviewerID = rid) TTT
    WHERE TTT.TimeInterval IS NOT NULL
    GROUP BY TTT.TimeInterval
    ORDER BY TTT.TimeInterval
    `;
    let resultRows = await runQuery(fullQuery);
    return resultRows;
}


async function getTimeDiffCategory(startTime, endTime, interval, categoryName) {
    let caseString = generateCaseString(startTime, endTime, interval);
    let fullQuery = 
    `
    SELECT brand, TimeInterval, TimeDiff
    FROM
    (SELECT brand, TimeInterval, amt, amt - (Lag(amt, 1) OVER (ORDER BY Brand, TimeInterval ASC)) AS TimeDiff
    FROM
        (SElECT TTT.TimeInterval, brand, COUNT(*) as amt
        FROM
            (SELECT 
                overall, 
                unix_time,
                brand,
                (CASE
                    ${caseString}
                    END) AS TimeInterval
            FROM AM_Review NATURAL JOIN AM_Brand
            WHERE 
                brand IN
                    (SELECT brand
                    FROM
                        (SELECT 
                            bb.brand, 
                            cc.name as catName, 
                            COUNT(*),
                            (100*COUNT(*) /
                            (SELECT COUNT(*)
                            FROM
                                (SELECT b.asin, COUNT(*)
                                FROM AM_Brand b LEFT JOIN AM_Category c ON c.asin = b.asin
                                WHERE
                                    b.brand = bb.brand AND
                                    name IS NOT NULL
                                GROUP BY b.asin))) as percent
                        FROM AM_Category cc NATURAL JOIN AM_Brand bb
                        GROUP BY bb.brand, name
                        ORDER BY bb.brand DESC, COUNT(*) DESC)
                    WHERE
                        catName = '${categoryName}' AND
                        percent >= 10
                    )
                ) TTT
        GROUP BY TTT.TimeInterval, brand
        ORDER BY TTT.TimeInterval, brand))
    WHERE
        TimeInterval IS NOT NULL AND
        TimeDiff IS NOT NULL
    `;
    let resultRows = await runQuery(fullQuery);
    return resultRows;
}


async function bestBrandsToGetRelatedProducts(startTime, endTime, interval, productAsin) {
    let caseString = generateCaseString(startTime, endTime, interval);
    let fullQuery = 
    `
    SELECT brand, TimeInterval, AVG(curAVG) AS avgOverall, NumRelatedProducts
    FROM
        (SELECT brand, asin, TimeInterval, AVG(overall) as curAVG
        FROM
            (SELECT brand, asin, overall, (CASE
                ${caseString}
                END) AS TimeInterval
            FROM
                (((SELECT ab.recasin
                FROM AM_Also_Buy ab
                WHERE ab.asin = '${productAsin}') abt -- input asin
                JOIN
                AM_Brand b
                ON abt.recasin = b.asin)
                NATURAL JOIN
                AM_Review))
        WHERE TimeInterval IS NOT NULL
        GROUP BY brand, asin, TimeInterval)
        NATURAL JOIN
        (SELECT brand, COUNT(*) as NumRelatedProducts
        FROM
            (SELECT brand, asin, AVG(overall) as avgO
            FROM
                ((SELECT ab.recasin
                FROM AM_Also_Buy ab
                WHERE ab.asin = '${productAsin}') abt -- input asin
                JOIN
                AM_Brand b
                ON abt.recasin = b.asin)
                NATURAL JOIN
                AM_Review -- put timing stuff after here
            GROUP BY brand, asin)
        GROUP BY brand)
    GROUP BY brand, TimeInterval, NumRelatedProducts
    ORDER BY NumRelatedProducts DESC, brand, TimeInterval
    `;
    let resultRows = await runQuery(fullQuery);
    return resultRows;
}

function toChartData_bestBrandsToGetRelatedProducts(resultRows) {
    let fullChartData = 
    {
        chartData: {
            datasets: [],
        },
        chartOptions: {
            scales: {
                yAxes: [{
                    scaleLabel: {
                      display: true,
                      labelString: "Average Review Rating"
                    }
                  }],
                xAxes: [{
                    scaleLabel: {
                      display: true,
                      labelString: "Time"
                    }
                  }]
            }
        }
    }

    let curDataset = {
        label: "brandName",// put brand title
        showLine: true,
        fill: false,
        borderColor: 'rgb(255, 99, 132)',
        data: [],
        backgroundColor: 'rgb(255, 99, 132)'
    }

    let maxCount = 5;
    let curIndex = 0;
    let prevBrand = "";
    resultRows.some((elem) => { // like forEach, but can be exited
        if (curIndex == maxCount)
            return true; // exit loop

        let brand = elem[0];
        let ti = elem[1]; // time interval; x value
        let avgOverall = elem[2]; // y value
        if (brand != prevBrand) {
            prevBrand = brand;
            if (curDataset.data.length > 0) {
                fullChartData.chartData.datasets.push(JSON.parse(JSON.stringify(curDataset)));
                curIndex += 1;
            }
            curDataset.label = brand;
            curDataset.data = [];
            let c = generateRandomColor();
            curDataset.borderColor = c;
            curDataset.backgroundColor = c;
        }
        curDataset.data.push({x: ti, y: avgOverall});
    });
    if (curDataset.data.length > 0)
        fullChartData.chartData.datasets.push(JSON.parse(JSON.stringify(curDataset)));
    
    return fullChartData;
}

function toChartData_getTimeDiffCategory(resultRows) {
    let fullChartData = 
    {
        chartData: {
            datasets: [],
        },
        chartOptions: {
            scales: {
                yAxes: [{
                    scaleLabel: {
                      display: true,
                      labelString: "Difference From Previous Time Period's Average Rating"
                    }
                  }],
                xAxes: [{
                    scaleLabel: {
                      display: true,
                      labelString: "Time"
                    }
                  }]
            }
        }
    }

    let curDataset = {
        label: "brandName",// put brand title
        showLine: true,
        fill: false,
        borderColor: 'rgb(255, 99, 132)',
        data: [],
        backgroundColor: 'rgb(255, 99, 132)'
    }

    let maxCount = 5;
    let curIndex = 0;
    let prevBrand = "";
    resultRows.some((elem) => { // like forEach, but can be exited
        if (curIndex == maxCount)
            return true; // exit loop

        let brand = elem[0];
        let ti = elem[1]; // time interval; x value
        let avgOverall = elem[2]; // y value
        if (brand != prevBrand) {
            prevBrand = brand;
            if (curDataset.data.length > 0) {
                fullChartData.chartData.datasets.push(JSON.parse(JSON.stringify(curDataset)));
                curIndex += 1;
            }
            curDataset.label = brand;
            curDataset.data = [];
            let c = generateRandomColor();
            curDataset.borderColor = c;
            curDataset.backgroundColor = c;
        }
        curDataset.data.push({x: ti, y: avgOverall});
    });
    if (curDataset.data.length > 0)
        fullChartData.chartData.datasets.push(JSON.parse(JSON.stringify(curDataset)));
    
    return fullChartData;
}

function toChartData_getRelativeRatingBrand(resultRows, brandName) {
    let fullChartData = 
    {
        chartData: {
            datasets: [{
                label: brandName,
                showLine: true,
                fill: false,
                borderColor: 'rgb(255, 99, 132)',
                data: [],
                backgroundColor: 'rgb(255, 99, 132)'
            }],
        },
        chartOptions: {
            scales: {
                yAxes: [{
                    scaleLabel: {
                      display: true,
                      labelString: "Average 'Unbiased' Rating"
                    }
                  }],
                xAxes: [{
                    scaleLabel: {
                      display: true,
                      labelString: "Time"
                    }
                  }]
            }
        }
    }

    resultRows.some((elem) => { // like forEach, but can be exited

        let ti = elem[0]; // time interval; x value
        let avgOverall = elem[1]; // y value

        fullChartData.chartData.datasets[0].data.push({x: ti, y: avgOverall});
    });
    
    return fullChartData;
}


// WHEN unix_time >= 1366502400 AND unix_time < 1398038400 THEN 'Year -1'
// WHEN unix_time >= 1398038400 AND unix_time < 1429574400 THEN 'Year 0'
// WHEN unix_time >= 1429574400 AND unix_time < 1461110400 THEN 'Year 1'
// WHEN unix_time >= 1461110400 AND unix_time < 1492646400 THEN 'Year 2'
// WHEN unix_time >= 1492646400 AND unix_time < 1524182400 THEN 'Year 3'
// WHEN unix_time >= 1524182400 AND unix_time < 1555718400 THEN 'Year 4'
function generateCaseString(startTime, endTime, interval) {
    let returnStr = "";
    for (let i = startTime; i < endTime; i += interval) {
        console.log("i is: " + i);
        returnStr += `WHEN unix_time >= ${i} AND unix_time < ${i + interval} THEN ${i}\n`;
    }
    return returnStr;
}

router.get("/", async function (req, res, next) {
    //res.send("API is working");

    //let resultRows = await bestBrandsToGetRelatedProducts(1366502400, 1555718400, 31536000, 'B00PZ4YAD4');
    let resultRows = await getTimeDiffCategory(1366502400, 1555718400, 31536000, 'Beans');
    //let resultRows = await getRelativeRatingBrand(1366502400, 1555718400, 31536000, 'Goya');

    res.send(resultRows);
});

router.get("/brandForRelatedProducts", async function (req, res, next) {
    //res.send("API is working");
    //let productAsin = 'B00PZ4YAD4';
    let productAsin = req.query.productAsin;
    let startTime = parseInt(req.query.startTime);
    let endTime = parseInt(req.query.endTime);
    let timeInterval = parseInt(req.query.timeInterval);
    console.log("Query info: " + productAsin + " " + startTime + " " + endTime + " " + timeInterval);

    let resultRows = await bestBrandsToGetRelatedProducts(startTime, endTime, timeInterval, productAsin);
    let fullChartData = toChartData_bestBrandsToGetRelatedProducts(resultRows);
    console.log(JSON.stringify(fullChartData, null, 4));
    res.send(JSON.stringify(fullChartData));
});

router.get("/getRelativeRatingBrand", async function (req, res, next) {
    //res.send("API is working");
    let brandName = req.query.brandName;
    let startTime = parseInt(req.query.startTime);
    let endTime = parseInt(req.query.endTime);
    let timeInterval = parseInt(req.query.timeInterval);

    //let resultRows = await getRelativeRatingBrand(1366502400, 1555718400, 31536000, brandName);
    let resultRows = await getRelativeRatingBrand(startTime, endTime, timeInterval, brandName);
    let fullChartData = toChartData_getRelativeRatingBrand(resultRows, brandName);
    console.log(JSON.stringify(fullChartData, null, 4));
    res.send(JSON.stringify(fullChartData));
});

router.get("/getTimeDiffCategory", async function (req, res, next) {
    //res.send("API is working");
    //let catName = 'Beans';
    let catName = req.query.catName;
    let startTime = parseInt(req.query.startTime);
    let endTime = parseInt(req.query.endTime);
    let timeInterval = parseInt(req.query.timeInterval);

    //let resultRows = await getTimeDiffCategory(1366502400, 1555718400, 31536000, catName);
    let resultRows = await getTimeDiffCategory(startTime, endTime, timeInterval, catName);
    let fullChartData = toChartData_getTimeDiffCategory(resultRows);
    console.log(JSON.stringify(fullChartData, null, 4));
    res.send(JSON.stringify(fullChartData));
});

router.get("/getProductAsins", async function (req, res, next) {
    let inputTitle = req.query.inputTitle;
    //console.log("inputTitle is: " + inputTitle);
    let resultRows = await runQuery(`SELECT asin, title FROM AM_Product WHERE title LIKE '%${inputTitle}%' FETCH FIRST 5 ROWS ONLY`);

    res.send(resultRows);
});

module.exports = router;

let test = { "chartData": 
{ "datasets": [{ "label": "ASS KICKIN", "showLine": true, "fill": false, "borderColor": "rgb(255, 99, 132)", "data": [{ "x": 1366502400, "y": 4.2 }], "backgroundColor": "rgb(255, 99, 132)" }, { "label": "ASS KICKIN", "showLine": true, "fill": false, "borderColor": "rgb(255, 99, 132)", "data": [{ "x": 1398038400, "y": 4.6470588235294095 }], "backgroundColor": "rgb(255, 99, 132)" }, { "label": "ASS KICKIN", "showLine": true, "fill": false, "borderColor": "rgb(255, 99, 132)", "data": [{ "x": 1429574400, "y": 4.285714285714289 }], "backgroundColor": "rgb(255, 99, 132)" }, { "label": "ASS KICKIN", "showLine": true, "fill": false, "borderColor": "rgb(255, 99, 132)", "data": [{ "x": 1461110400, "y": 3.5 }], "backgroundColor": "rgb(255, 99, 132)" }, { "label": "ASS KICKIN", "showLine": true, "fill": false, "borderColor": "rgb(255, 99, 132)", "data": [{ "x": 1492646400, "y": 4 }], "backgroundColor": "rgb(255, 99, 132)" }, { "label": "Bhut Kisser", "showLine": true, "fill": false, "borderColor": "rgb(255, 99, 132)", "data": [{ "x": 1366502400, "y": 5 }], "backgroundColor": "rgb(255, 99, 132)" }] }, "chartOptions": { "scales": { "yAxes": [{ "scaleLabel": { "display": true, "labelString": "Average Review Rating" } }], "xAxes": [{ "scaleLabel": { "display": true, "labelString": "Time" } }] } } }

/* (Example query (getRelativeRatingBrand))


SElECT TTT.TimeInterval, AVG(TTT.unbiasedScore) as avgubs
FROM
    (SELECT 
        rid, 
        x2.overall/avgRating AS unbiasedScore, 
        x2.unix_time,     
        (CASE
            WHEN unix_time >= 1366502400 AND unix_time < 1398038400 THEN 'Year -1'
            WHEN unix_time >= 1398038400 AND unix_time < 1429574400 THEN 'Year 0'
            WHEN unix_time >= 1429574400 AND unix_time < 1461110400 THEN 'Year 1'
            WHEN unix_time >= 1461110400 AND unix_time < 1492646400 THEN 'Year 2'
            WHEN unix_time >= 1492646400 AND unix_time < 1524182400 THEN 'Year 3'
            WHEN unix_time >= 1524182400 AND unix_time < 1555718400 THEN 'Year 4'
            END) AS TimeInterval
    FROM
        (SELECT r2.reviewerID as rid, AVG(r2.overall) AS avgRating
        FROM
            (SELECT reviewerID
            FROM AM_REVIEW NATURAL JOIN AM_Brand
            WHERE 
                brand='Goya'
            ) r1,
            AM_REVIEW r2
        WHERE r1.reviewerID = r2.reviewerID
        GROUP BY r2.reviewerID) x1,
        (SELECT reviewerID, unix_time, overall
        FROM AM_Review NATURAL JOIN AM_Brand
        WHERE
            brand='Goya'
        ) x2
    WHERE x2.reviewerID = rid) TTT
WHERE TTT.TimeInterval IS NOT NULL
GROUP BY TTT.TimeInterval
ORDER BY TTT.TimeInterval;


*/