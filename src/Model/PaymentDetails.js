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
        ref: "users",
        trim: true
    },
    CartID: {
        type: String,
        ref: "cartdetails",
        trim: true
    },
    BillID: {
        type: String,
        ref: "billingAddress",
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
    Cart: [],
    Total: {
        type: Number,
        trim: true
    },
    Tax: {
        type: Number,
        trim: true
    },
    RazorpayAmount: {
        type: Number,
        trim: true
    },
    Status: {
        type: String,
        trim: true
    },
}, { timestamps: true })
module.exports = mongoose.model("paymentdetails", Payment)