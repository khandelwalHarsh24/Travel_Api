const Pool=require('pg').Pool;

const pool=new Pool({
    // connectionString: process.env.POSTGRES_URL + "?sslmode=require",
    user: process.env.user,
    host: process.env.host,
    database: process.env.database,
    password: process.env.password,
    port: process.env.port
});


module.exports=pool;