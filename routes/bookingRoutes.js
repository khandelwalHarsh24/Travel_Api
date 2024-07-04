const express=require('express');
const router=express.Router();
const authMiddleWare=require('../middleware/auth');

const {getSeatAvailability,bookSeat,bookingDetails}=require('../controller/bookingController')

router.route('/availability').get(authMiddleWare,getSeatAvailability)

router.route('/bookseat').post(authMiddleWare,bookSeat);
router.route('/bookingdetails/:id').get(authMiddleWare,bookingDetails);

module.exports=router;