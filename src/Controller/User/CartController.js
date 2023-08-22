let { getNextSequenceValue, errorHandler, verifyToken, isEmailValid, isValidphonenumber } = require("../Functional");
const CartModel = require("../../Model/Cart")
const UserDetails = require("../../Model/User")
const { PRODUCTS } = require("../Products")
var Razorpay = require('razorpay')
const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY,
    key_secret: process.env.RAZORPAY_SECERT
});
const Authkey = process.env.Authkey
require("dotenv").config();
const BillingModel = require("../../Model/Billing");
const PaymentDetails = require("../../Model/PaymentDetails")

// const addcart = async (req, res) => {
//     try {
//         const { userId, quantity, productId } = req.body
//         const header = req.headers.authkey
//         const token = req.headers.token
//         if (header !== null && header !== '' && header !== undefined) {
//             if (header == Authkey) {
//                 if (userId !== null && userId !== '' && userId !== undefined && productId !== null && productId !== '' && productId !== undefined && quantity !== null && quantity !== '' && quantity !== undefined) {
//                     const verify = verifyToken(token, userId);
//                     if (verify == true) {
//                         const IsUser = await UserDetails.findOne({ userId: userId })
//                         if (IsUser != null) {
//                             let data = await CartModel.findOne({ UserID: userId, 'Item.ProductID': productId, Status: 'Pending' })
//                             if (data != null) {
//                                 let quantity = data.Item.filter(function (d) {
//                                     if (d.ProductID == productId) {
//                                         return d.Quantity
//                                     }
//                                 })
//                                 quantity = quantity[0].Quantity
//                                 let hit = await CartModel.findOneAndUpdate({ UserID: userId, Status: 'Pending', 'Item.ProductID': productId, }, {
//                                     $set: {
//                                         'Item.$.Quantity': quantity + 1,
//                                     }
//                                 }, { new: true })
//                                 if (hit !== null) {
//                                     let data = await CartModel.findOne({ UserID: userId, Status: 'Pending' })
//                                     let cartLength = data.Item.length
//                                     res.send({
//                                         code: 200,
//                                         status: "success",
//                                         message: "Add to Cart",
//                                         totalItem: cartLength,
//                                     });
//                                 } else {
//                                     return res.status(201).send(errorHandler('fail'))
//                                 }
//                             } else {
//                                 //Check UserID cart Is Exit
//                                 let data = await CartModel.findOne({ userId: userId, Status: 'Pending' })
//                                 //  console.log(data)
//                                 if (data != null) {
//                                     let hit = await CartModel.findOneAndUpdate({ userId: userId, Status: 'Pending' }, {
//                                         $push: {
//                                             Item: {
//                                                 ProductID: productId,
//                                                 Quantity: quantity
//                                             }
//                                         }
//                                     }, { new: true })
//                                     if (hit !== null) {
//                                         let data = await CartModel.findOne({ userId: userId, Status: 'Pending' })
//                                         let cartLength = data.Item.length
//                                         res.send({
//                                             code: 200,
//                                             status: "success",
//                                             message: "Add to Cart",
//                                             totalItem: cartLength,
//                                         });
//                                     } else {
//                                         return res.status(201).send(errorHandler('fail'))
//                                     }
//                                 } else {
//                                     let cartId = 'C' + await getNextSequenceValue("cart");
//                                     data = new CartModel({
//                                         UserID: userId,
//                                         CartID: cartId,
//                                         Item: [
//                                             {
//                                                 ProductID: productId,
//                                                 Quantity: quantity
//                                             }
//                                         ],
//                                     })
//                                     await data.save().then((data) => {
//                                         res.send({
//                                             code: 200,
//                                             status: "success",
//                                             message: "Add to Cart",
//                                             totalItem: 1,
//                                         });
//                                     })
//                                         .catch((err) => {
//                                             console.log(err)
//                                             return res.status(201).send(errorHandler('fail'))
//                                         });
//                                 }
//                             }
//                         } else {
//                             return res.status(201).send(errorHandler('notFound'))
//                         }
//                     } else {
//                         return res.status(201).send(errorHandler(verify))
//                     }
//                 } else {
//                     return res.status(201).send(errorHandler('invalidRequest'))
//                 }
//             } else {
//                 return res.status(201).send(errorHandler('accessDenied'))
//             }
//         } else {
//             return res.status(201).send(errorHandler('accessDenied'))
//         }
//     } catch (e) {
//         console.log(e.message);
//         return res.status(201).send(errorHandler('fail'))
//     }
// }


// const removeToCart = async (req, res) => {
//     try {
//         const { userId, productId } = req.body
//         const header = req.headers.authkey
//         const token = req.headers.token
//         if (header !== null && header !== '' && header !== undefined) {
//             if (header == Authkey) {
//                 if (userId !== null && userId !== '' && userId !== undefined && productId !== null && productId !== '' && productId !== undefined) {
//                     const verify = verifyToken(token, userId);
//                     if (verify == true) {
//                         const IsExist = await UserDetails.findOne({ userId: userId })
//                         if (IsExist != null) {
//                             let data = await CartModel.findOne({ UserID: userId, 'Item.ProductID': productId, Status: 'Pending' })
//                             if (data != null) {
//                                 let hit = await CartModel.findOneAndUpdate({ UserID: userId, Status: 'Pending', 'Item.ProductID': productId }, {
//                                     $pull: {
//                                         Item: {
//                                             ProductID: productId,
//                                         }
//                                     }
//                                 }, { new: true })
//                                 if (hit !== null) {
//                                     let data = await CartModel.findOne({ UserID: userId, Status: 'Pending' })
//                                     let cartLength = data.Item.length
//                                     res.send({
//                                         code: 200,
//                                         status: "success",
//                                         message: "Add to Cart",
//                                         totalItem: cartLength,
//                                     });
//                                 } else {
//                                     return res.status(201).send(errorHandler('fail'))
//                                 }
//                             } else {
//                                 return res.status(201).send(errorHandler('notFound'))
//                             }
//                         } else {
//                             return res.status(201).send(errorHandler('notFound'))
//                         }
//                     } else {
//                         return res.status(201).send(errorHandler(verify))
//                     }
//                 } else {
//                     return res.status(201).send(errorHandler('invalidRequest'))
//                 }
//             } else {
//                 return res.status(201).send(errorHandler('accessDenied'))
//             }
//         } else {
//             return res.status(201).send(errorHandler('accessDenied'))
//         }
//     } catch (e) {
//         console.log(e.message);
//         return res.status(201).send(errorHandler('fail'))
//     }
// }

// const getAllCart = async (req, res, next) => {
//     try {
//         const { userId } = req.body
//         const header = req.headers.authkey
//         const token = req.headers.token
//         if (header !== null && header !== '' && header !== undefined) {
//             if (header == Authkey) {
//                 if (userId !== null && userId !== '' && userId !== undefined) {
//                     const verify = verifyToken(token, userId);
//                     if (verify == true) {
//                         await CartModel.findOne({ UserID: userId, Status: "Pending" })
//                             .then((result) => {
//                                 let cartArray = [];
//                                 let Pricetotal = 0
//                                 // console.log(result)
//                                 if (result !== null) {
//                                     const item = result.Item
//                                     const cartId = result.CartID
//                                     // console.log(item)
//                                     const wait = item.map(async (data) => {
//                                         const productId = data.ProductID
//                                         const productDetail = PRODUCTS.filter((result) => {
//                                             if (result.id === productId) return result
//                                         })
//                                         // console.log(productDetail)
//                                         if (productDetail.length > 0) {
//                                             Pricetotal = Pricetotal + (parseFloat(productDetail[0].price) * data.Quantity)
//                                             const object = {
//                                                 name: productDetail[0].title,
//                                                 price: productDetail[0].price,
//                                                 productId: productId,
//                                                 quantity: data.Quantity,
//                                             }
//                                             cartArray.push(object)
//                                         }
//                                     })
//                                     // console.log(CourseArray)
//                                     Promise.all(wait).then((data) => {
//                                         res.status(200).send({
//                                             code: 200,
//                                             status: 'success',
//                                             message: "Successfully",
//                                             data: cartArray,
//                                             cartId: cartId,
//                                             pricetotal: Pricetotal
//                                         })
//                                     }).catch(err => {
//                                         return res.status(201).send(errorHandler(err.message))
//                                     })
//                                 } else {
//                                     res.status(200).send({
//                                         code: 200,
//                                         status: 'success',
//                                         message: "Successfully",
//                                         data: [],
//                                         cartId: '',
//                                         pricetotal: Pricetotal,
//                                     })
//                                 }
//                             }).catch(err => {
//                                 return res.status(201).send(errorHandler('fail'))
//                             })
//                     } else {
//                         return res.status(201).send(errorHandler(verify))
//                     }
//                 } else {
//                     return res.status(201).send(errorHandler('invalidRequest'))
//                 }
//             } else {
//                 return res.status(201).send(errorHandler('accessDenied'))
//             }
//         } else {
//             return res.status(201).send(errorHandler('invalidRequest'))
//         }
//     } catch (error) {
//         console.log(error.message)
//         return res.status(201).send(errorHandler('fail'))
//     }
// }


// const createOrder = async (req, res, next) => {
//     try {
//         const header = req.headers.authkey
//         const token = req.headers.token
//         const { userId, cartId } = req.body
//         if (header !== null && header !== '' && header !== undefined) {
//             if (header == Authkey) {
//                 if (userId !== null && userId !== '' && userId !== undefined) {
//                     const verify = verifyToken(token, userId);
//                     if (verify == true) {
//                         await CartModel.findOne({ UserID: userId, CartID: cartId })
//                             .then(async (result) => {
//                                 let total = 0
//                                 // console.log(result)
//                                 if (result != null) {
//                                     const ITEM = result.Item
//                                     const requestOrderId = cartId + '_' + Date.now()
//                                     await Promise.all(ITEM.map(async (data) => {
//                                         // const productId = data.ProductID
//                                         // const productDetail = PRODUCTS.filter((result) => {
//                                         //     if (result.id === productId) return result
//                                         // })
//                                         // if (productDetail.length > 0) {
//                                         total = total + (parseFloat(data.totalPrice))
//                                         // }
//                                     }))
//                                     const shippingCharge = 30
//                                     total = total + shippingCharge
//                                     const order = await razorpay.orders.create({
//                                         amount: total * 100,
//                                         currency: "INR",
//                                         receipt: requestOrderId
//                                     })
//                                     res.status(200).send({
//                                         code: 200,
//                                         status: 'success',
//                                         message: "Successfully",
//                                         orderId: order.id,
//                                         total: total
//                                     })

//                                 } else {
//                                     return res.status(201).send(errorHandler('notFound'))
//                                 }
//                             }).catch(err => {
//                                 console.log(err)
//                                 return res.status(201).send(errorHandler('fail'))
//                             })
//                     } else {
//                         return res.status(201).send(errorHandler(verify))

//                     }
//                 } else {
//                     return res.status(201).send(errorHandler('invalidRequest'))

//                 }
//             } else {
//                 return res.status(201).send(errorHandler('accessDenied'))
//             }
//         } else {
//             return res.status(201).send(errorHandler('invalidRequest'))
//         }
//     } catch (error) {
//         console.log(error)
//         return res.status(201).send(errorHandler('fail'))
//     }
// }


const addAllCart = async (req, res) => {
    try {
        const { userId, cart, name, email, phone, city, state, code, address, landmark, latitude, longitude } = req.body
        const header = req.headers.authkey
        const token = req.headers.token
        if (header !== null && header !== '' && header !== undefined) {
            if (header == Authkey) {
                if (userId !== null && userId !== '' && userId !== undefined && name !== null && name !== '' && name !== undefined && email !== null && email !== '' && email !== undefined && phone !== null && phone !== '' && phone !== undefined && code !== null && code !== '' && code !== undefined && city !== null && city !== '' && city !== undefined && state !== null && state !== '' && state !== undefined && address !== null && address !== '' && address !== undefined && landmark !== null && landmark !== '' && latitude !== undefined && latitude !== null && latitude !== '' && landmark !== undefined && longitude !== null && longitude !== '' && longitude !== undefined && Array.isArray(cart)) {
                    const verify = verifyToken(token, userId);
                    if (verify == true) {
                        if (isEmailValid(email)) {
                            if (isValidphonenumber(phone)) {
                                const IsUser = await UserDetails.findOne({ userId: userId })
                                if (IsUser != null) {
                                    var cartId = null;
                                    var total = 0;
                                    var billId = 'B' + await getNextSequenceValue("billing");
                                    const BillingInfo = new BillingModel({
                                        UserID: userId,
                                        BillingID: billId,
                                        Name: name,
                                        Email: email,
                                        Number: phone,
                                        City: city,
                                        Longitude: longitude,
                                        Latitude: latitude,
                                        Address: address,
                                        Landmark: landmark,
                                        State: state,
                                        PostalCode: code,
                                    })
                                    await BillingInfo.save()
                                    let data = await CartModel.findOne({ UserID: userId, Status: 'Pending' })
                                    if (data != null) {
                                        let hit = await CartModel.findOneAndUpdate({ UserID: userId, Status: 'Pending' }, {
                                            Item: cart
                                        }, { new: true })
                                        cartId = hit.CartID;
                                    } else {
                                        cartId = 'C' + await getNextSequenceValue("cart");
                                        const CartInfo = new CartModel({
                                            UserID: userId,
                                            CartID: cartId,
                                            Item: cart
                                        })
                                        await CartInfo.save()
                                    }
                                    const requestOrderId = cartId + '_' + Date.now()
                                    await Promise.all(cart.map(async (data) => {
                                        total = total + (parseFloat(data.totalPrice))
                                    }))
                                    const shippingCharge = 30
                                    total = total + shippingCharge
                                    const order = await razorpay.orders.create({
                                        amount: total * 100,
                                        currency: "INR",
                                        receipt: requestOrderId
                                    })
                                    res.status(200).send({
                                        code: 200,
                                        status: 'success',
                                        message: "Successfully",
                                        orderId: order.id,
                                        total: total,
                                        cartId: cartId,
                                        billId: billId,
                                    })
                                } else {
                                    return res.status(201).send(errorHandler('notFound'))
                                }
                            } else {
                                return res.status(201).send(errorHandler('invalidNumber'))
                            }
                        } else {
                            return res.status(201).send(errorHandler('invalidEmail'))
                        }
                    } else {
                        return res.status(201).send(errorHandler(verify))
                    }
                } else {
                    return res.status(201).send(errorHandler('invalidRequest'))
                }
            } else {
                return res.status(201).send(errorHandler('accessDenied'))
            }
        } else {
            return res.status(201).send(errorHandler('accessDenied'))
        }
    } catch (e) {
        console.log(e.message);
        return res.status(201).send(errorHandler('fail'))
    }
}


const getOrderHistory = async (req, res) => {
    try {
        const { userId } = req.body
        const header = req.headers.authkey
        const token = req.headers.token
        if (header !== null && header !== '' && header !== undefined) {
            if (header == Authkey) {
                if (userId !== null && userId !== '' && userId !== undefined) {
                    const verify = verifyToken(token, userId);
                    if (verify == true) {
                        const IsUser = await UserDetails.findOne({ userId: userId })
                        if (IsUser != null) {
                            PaymentDetails.find({ UserId: userId }).populate([
                                {
                                    path: 'CartID',
                                    localField: 'CartID', // set the local field to `categoryCode`
                                    foreignField: 'CartID',
                                },
                                {
                                    path: 'BillID',
                                    localField: 'BillID', // set the local field to `categoryCode`
                                    foreignField: 'BillID',
                                }
                            ]).sort({ _id: -1 }).then(response => {
                                res.status(200).send({
                                    code: 200,
                                    status: 'success',
                                    message: "Successfully",
                                    data: response
                                })
                            }).catch(err => {
                                return res.status(201).send(errorHandler('fail'))
                            })
                        } else {
                            return res.status(201).send(errorHandler('notFound'))
                        }
                    } else {
                        return res.status(201).send(errorHandler(verify))
                    }
                } else {
                    return res.status(201).send(errorHandler('invalidRequest'))
                }
            } else {
                return res.status(201).send(errorHandler('accessDenied'))
            }
        } else {
            return res.status(201).send(errorHandler('accessDenied'))
        }
    } catch (e) {
        console.log(e.message);
        return res.status(201).send(errorHandler('fail'))
    }
}

module.exports = {
    // addcart,
    // removeToCart,
    // getAllCart,
    // createOrder,
    addAllCart,
    getOrderHistory
}