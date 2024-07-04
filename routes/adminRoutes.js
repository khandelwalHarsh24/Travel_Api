const express=require('express');
const router=express.Router();
const adminMiddleware=require('../middleware/admin');

const {getAllTrain,addTrain}=require('../controller/adminContoller');

router.route('/gettrain').get(getAllTrain);
router.route('/addtrain').post(adminMiddleware,addTrain);


module.exports=router;