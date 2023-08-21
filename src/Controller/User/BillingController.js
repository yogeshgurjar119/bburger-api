let { getNextSequenceValue, errorHandler, verifyToken, isEmailValid, isValidphonenumber } = require("../Functional");
const CartModel = require("../../Model/Cart")
const UserDetails = require("../../Model/User")
const { PRODUCTS } = require("../Products");
const BillingModel = require("../../Model/Billing");

const Authkey = process.env.Authkey
require("dotenv").config();

const addBilling = async (req, res) => {
    try {
        const { userId, name, email, phone, city, state, code } = req.body
        const header = req.headers.authkey
        const token = req.headers.token
        if (header !== null && header !== '' && header !== undefined) {
            if (header == Authkey) {
                if (userId !== null && userId !== '' && userId !== undefined && name !== null && name !== '' && name !== undefined && phone !== null && phone !== '' && phone !== undefined && city !== null && city !== '' && city !== undefined && state !== null && state !== '' && state !== undefined && code !== null && code !== '' && code !== undefined) {
                    const verify = verifyToken(token, userId);
                    if (verify == true) {
                        if (isEmailValid(email)) {
                            if (isValidphonenumber(phone)) {
                                const IsUser = await UserDetails.findOne({ userId: userId })
                                if (IsUser != null) {
                                    let seq = 'B' + await getNextSequenceValue("billing");
                                    const data = new BillingModel({
                                        UserID: userId,
                                        BillingID: seq,
                                        Name: name,
                                        Email: email,
                                        Number: phone,
                                        City: city,
                                        State: state,
                                        PostalCode: code,
                                    })
                                    await data.save().then((data) => {
                                        res.send({
                                            code: 200,
                                            status: "success",
                                            message: "Successfully Add"
                                        });
                                    })
                                        .catch((err) => {
                                            console.log(err)
                                            return res.status(201).send(errorHandler('fail'))
                                        });
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



const getAllBill = async (req, res, next) => {
    try {
        const { userId } = req.body
        const header = req.headers.authkey
        const token = req.headers.token
        if (header !== null && header !== '' && header !== undefined) {
            if (header == Authkey) {
                if (userId !== null && userId !== '' && userId !== undefined) {
                    const verify = verifyToken(token, userId);
                    if (verify == true) {
                        await BillingModel.find({ UserID: userId })
                            .then(async (result) => {
                                let Pricetotal = 0
                                await CartModel.findOne({ UserID: userId, Status: "Pending" }).then(cartData => {
                                    // console.log(result)
                                    if (cartData !== null) {
                                        const item = cartData.Item
                                        const cartId = cartData.CartID
                                        // console.log(item)
                                        const wait = item.map(async (data) => {
                                            const productId = data.ProductID
                                            const productDetail = PRODUCTS.filter((result) => {
                                                if (result.id === productId) return result
                                            })
                                            // console.log(productDetail)
                                            if (productDetail.length > 0) {
                                                Pricetotal = Pricetotal + (parseFloat(productDetail[0].price) * data.Quantity)
                                            }
                                        })
                                        // console.log(CourseArray)
                                        Promise.all(wait).then((data) => {
                                            res.status(200).send({
                                                code: 200,
                                                status: 'success',
                                                message: "Successfully",
                                                data: result,
                                                cartId: cartId,
                                                pricetotal: Pricetotal
                                            })
                                        }).catch(err => {
                                            return res.status(201).send(errorHandler(err.message))
                                        })
                                    } else {
                                        res.status(200).send({
                                            code: 200,
                                            status: 'success',
                                            message: "Successfully",
                                            data: result,
                                            cartId: '',
                                            pricetotal: Pricetotal,
                                        })
                                    }
                                }).catch(err => {
                                    return res.status(201).send(errorHandler('fail'))
                                })
                            }).catch(err => {
                                return res.status(201).send(errorHandler('fail'))
                            })
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
            return res.status(201).send(errorHandler('invalidRequest'))
        }
    } catch (error) {
        console.log(error.message)
        return res.status(201).send(errorHandler('fail'))
    }
}

module.exports = {
    addBilling,
    getAllBill
}