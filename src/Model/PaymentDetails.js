const mongoose = require('mongoose');

const Payment = new mongoose.Schema({
    PaymentID: {
        type: String,
        required: true
    },
    RequestPaymentID: {
        type: String,
        trim: true
    },
    UserID: {
        type: String,
        required: true,
        trim: true
    },
    TransacationId: {
        type: String,
        trim: true
    },
    RequestSignature: {
        type: String,
        trim: true
    },
    OrderID: {
        type: String,
        trim: true
    },
    InvoiceID: {
        type: String,
        trim: true
    },
    Coupon: {
        type: String,
        trim: true
    },
    Tax: {
        type: String,
        trim: true
    },
    Cart: [
        {
            CourseID : {
                    type: String,
                    trim: true
                },
            Title : {
                type: String,
                trim: true
            } ,
            Price : {
                type: String,
                trim: true
            },
            // CutPrice: {
            //     type: String,
            //     trim: true
            // }, 
            Quantity : {
                type: Number,
                trim: true
            },
        }
     ],
    Total: {
        type: String,
        trim: true
    },
    RazorpayAmount:{
        type : String,
        trim :true
    },
    Status: {
        type: String,
        trim: true
    },
},{timestamps:true})
module.exports = mongoose.model("paymentdetails", Payment)