const express=require('express');
const router=express.Router();

const {getUserData,userRegister,loginUser}=require('../controller/userContoller');

router.route('/getUser').get(getUserData);
router.route('/registerUser').post(userRegister);
router.route('/loginUser').post(loginUser);

module.exports=router;