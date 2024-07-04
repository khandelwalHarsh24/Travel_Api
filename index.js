const express=require('express');
const app=express();
const port=3000;
require('dotenv/config'); 
app.use(express.json());
const user=require('./routes/userRegister');
const admin=require('./routes/adminRoutes');
const booking=require('./routes/bookingRoutes');
// const notfound=require('./middleware/notfound');

app.use('/api/v1',user);

app.use('/api/v2',admin);

app.use('/api/v3',booking)

// app.use(notfound);

const start=async ()=>{
    try {
        app.listen(port,console.log(`Server Listening To The Port ${port}`));
    } catch (error) {
        console.log(error);
    }
}

start();
