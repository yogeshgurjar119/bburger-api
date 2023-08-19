const Razorpay = require('razorpay');
const PaymentDetails  = require("../../Model/PaymentDetails")
const CartDetails = require('../../Model/Cart')
const { verifyToken, errorHandler, getNextSequenceValue, titleCase } = require("../Functional")

const {validateWebhookSignature} = require('razorpay/dist/utils/razorpay-utils')

const dotenv =require('dotenv').config()

const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY,
    key_secret: process.env.RAZORPAY_SECERT
});

exports.BB = async (req,res)=>{
    try{
        var obj = req.body;
        const razorpay_signature = req.get("X-Razorpay-Signature");
        let RAZORPAY_KEY_SECRET = process.env.WEB_HOOK_SECERT;
        const isValidSignature =   validateWebhookSignature(JSON.stringify(obj), razorpay_signature, RAZORPAY_KEY_SECRET)
            // console.log(isValidSignature)
        if (isValidSignature){
            let recipt = obj.payload.order.entity.receipt;
            var cartId = recipt.split("_")[0];
            let reData_Check = await CartDetails.findOne({
                CartID : cartId,
                Status : "Completed"
            })
            if(reData_Check === null){

                let userId = obj.payload.payment.entity.notes.userId
                let data = await CartDetails.findOneAndUpdate({ CartID: cartId, UserID: userId },{
                    UpdatedAt : Date.now(),
                    Status : "Completed"
                })
        

                let razorpayAmount = parseFloat(obj.payload.payment.entity.amount/100);
                let paymentId = obj.payload.payment.entity.id;
                let transacationId = obj.payload.payment.entity.order_id;
                let couponCode = null
                if (obj.payload.payment.entity.notes.couponCode !== ""){
                    couponCode = obj.payload.payment.entity.notes.couponCode
                }
                let Pricetotal = 0;
                let CourseArray =[]
                await Promise.all(data.Course.map(async (courseId)=>{
                    const result = await PCourse.findOne({ CourseID: courseId }).select("Price CutPrice Title Code")
                    if (result !== null){
                        Pricetotal = Pricetotal + parseFloat(result.Price)
                        const CourseObject = {
                            CourseID : courseId,
                            Title: result.Title,
                            Price: result.Price,
                            CutPrice: result.CutPrice,
                            Code: result.Code,
                        } 
                        CourseArray.push(CourseObject)
                        const IsWish = await UEnroll.findOne({ UserID: userId })
                        if (IsWish === null) {
                            const seq = "EN" + await getNextSequenceValue("enroll")
                            const UEnrolInfo = new UEnroll()
                            UEnrolInfo.EnrollID = seq;
                            UEnrolInfo.UserID = userId;
                            const firstTime = [{
                                sno: 0,
                                CourseID: courseId
                            }]
                            UEnrolInfo.Course = firstTime;
                            await UEnrolInfo.save()
                        } else {
                            const CourseNameExist = await UEnroll.findOne({
                                    UserID: userId,
                                    'Course.CourseID': courseId
                                })
                                // console.log(CourseNameExist)
                            if (CourseNameExist === null) {
                                const wishId = IsWish.EnrollID
                                const length = IsWish.Course.length
                                let sno
                                if (length == 0) {
                                    sno = 0
                                } else {
                                    sno = parseInt(IsWish.Course[length - 1].sno) + 1
                                }
                                const IsSave = await UEnroll.findOneAndUpdate({ EnrollID: wishId, UserID: userId }, {
                                    $push: {
                                        Course: {
                                            sno: sno,
                                            CourseID: courseId,
                                        }
                                    }
                                })
                            } 
                        }      
                    }
                }))

                const seq = "PAY" + await getNextSequenceValue("payment")
                let paymentInfo = new PaymentDetails()
                paymentInfo.PaymentID = seq
                paymentInfo.RequestPaymentID = paymentId
                paymentInfo.UserID = userId
                paymentInfo.InvoiceID = cartId
                paymentInfo.TransacationId = transacationId
                paymentInfo.RequestSignature = razorpay_signature
                paymentInfo.Coupon = couponCode
                paymentInfo.Cart = CourseArray
                paymentInfo.Total = Pricetotal
                paymentInfo.RazorpayAmount = razorpayAmount
                paymentInfo.Status = "Paid"
                await paymentInfo.save()   
             
             }else{
                console.log("CART IS Completed Check")
             }
        }else{
            console.log("INVALID SIGNATURE")
        }
    }catch(err){
        console.log(err)

    }
}
