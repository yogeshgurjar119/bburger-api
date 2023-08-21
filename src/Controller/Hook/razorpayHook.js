const Razorpay = require('razorpay');
const PaymentDetails = require("../../Model/PaymentDetails")
const CartDetails = require('../../Model/Cart')
const { verifyToken, errorHandler, getNextSequenceValue, titleCase } = require("../Functional")
const { PRODUCTS } = require("../Products")
const { validateWebhookSignature } = require('razorpay/dist/utils/razorpay-utils')
const dotenv = require('dotenv').config()

exports.BB = async (req, res) => {
    try {
        var obj = req.body;
        const razorpay_signature = req.get("X-Razorpay-Signature");
        let RAZORPAY_KEY_SECRET = process.env.WEB_HOOK_SECERT;
        const isValidSignature = validateWebhookSignature(JSON.stringify(obj), razorpay_signature, RAZORPAY_KEY_SECRET)
        // console.log(isValidSignature)
        if (isValidSignature) {
            let recipt = obj.payload.order.entity.receipt;
            var cartId = recipt.split("_")[0];
            let reData_Check = await CartDetails.findOne({
                CartID: cartId,
                Status: "Completed"
            })
            if (reData_Check === null) {
                let userId = obj.payload.payment.entity.notes.userId
                let billId = obj.payload.payment.entity.notes.billId
                let tax = obj.payload.payment.entity.notes.tax
                let data = await CartDetails.findOneAndUpdate({ CartID: cartId, UserID: userId }, {
                    Status: "Completed"
                })
                if (data != null) {
                    let razorpayAmount = parseFloat(obj.payload.payment.entity.amount / 100);
                    let paymentId = obj.payload.payment.entity.id;
                    let transacationId = obj.payload.payment.entity.order_id;
                    let Pricetotal = 0;
                    await Promise.all((data.Item).map((cart) => {
                        Pricetotal = Pricetotal + parseFloat(cart.totalPrice)
                    }))
                    const seq = await getNextSequenceValue("payment")
                    const pseq = "PAY" + seq;
                    const Iseq = "INV" + seq;
                    let paymentInfo = new PaymentDetails()
                    paymentInfo.PaymentID = pseq
                    paymentInfo.RequestPaymentID = paymentId
                    paymentInfo.UserID = userId
                    paymentInfo.CartID = cartId
                    paymentInfo.BillID = billId
                    paymentInfo.InvoiceID = Iseq
                    paymentInfo.TransacationId = transacationId
                    paymentInfo.RequestSignature = razorpay_signature
                    paymentInfo.Tax = tax
                    paymentInfo.Total = Pricetotal
                    paymentInfo.RazorpayAmount = razorpayAmount
                    paymentInfo.Status = "Paid"
                    await paymentInfo.save()
                } else {
                    console.log("NOT FOUND")
                }
            } else {
                console.log("CART IS Completed Check")
            }
        } else {
            console.log("INVALID SIGNATURE")
        }
    } catch (err) {
        console.log(err)
        console.log("Error: " + err)
    }
}
