const oracledb = require('oracledb');
try {
    oracledb.initOracleClient({libDir: '/Users/rangerchenore/Downloads/instantclient_19_8'});
  } catch (err) {
    console.error('Whoops!');
    console.error(err);
    process.exit(1);
  }

async function runTest() {
    const startTime = Date.now();

    const conn = oracledb.getConnection({
        user: 'rchenore',
        password: 'Hacking4Nothingora',
        connectString: '(DESCRIPTION = (ADDRESS = (PROTOCOL = TCP)(HOST = oracle.cise.ufl.edu)(PORT = 1521))(CONNECT_DATA = (SID = orcl)))'
        }).then((ret) => {
            ret.close();
            console.log(ret);
            console.log('Total time: ' + (Date.now() - startTime));
        });
    
    //await conn.close();

    console.log('Total time: ' + (Date.now() - startTime));
}
runTest();

