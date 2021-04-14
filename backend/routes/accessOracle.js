var express = require("express");
var router = express.Router();
const oracledb = require('oracledb');

let oracleInit = false;

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
        console.log(resultRows);
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

router.get("/", async function (req, res, next) {
    //res.send("API is working");

    let resultRows = await runQuery("SELECT prod.title, price.price FROM AM_PRODUCT prod, AM_PRICE price WHERE prod.asin = price.asin AND price.price >= 500");

    res.send(resultRows);
});

module.exports = router;