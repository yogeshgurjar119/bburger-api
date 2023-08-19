
const UserModel = require('../../Model/User')
const { errorHandler, isEmailValid, compareItems, verifyToken, jwtCreate, getNextSequenceValue, titleCase,hashItem } = require("../Functional")
const Authkey = process.env.Authkey
require("dotenv").config();


const login = async (req, res, next) => {
    try {
        let { email, password } = req.body
        const header = req.headers.authkey
        if (header !== null && header !== '' && header !== undefined) {
            if (header == Authkey) {
                    if (email !== null && email !== '' && email !== undefined && password !== null && password !== '' && password !== undefined) {
                        if (isEmailValid(email)) {
                            const userExist = await UserModel.findOne({ Email: email.toLowerCase() });
                            if (userExist !== null && userExist !== '' && userExist !== undefined) {
                                const response = await compareItems(password.trim(), userExist.Password);
                                if (response) {
                                    let token = await jwtCreate(userExist.UserID)
                                    return res.status(200).send({
                                        code: 200,
                                        "status": "success",
                                        data: {
                                            "message": "User Verified",
                                            userId: userExist.UserID,
                                            token: token,
                                        }
                                    })
                                } else {
                                    // console.log(err)
                                    return res.status(201).send(errorHandler('incorrectPassword'))
                                }
                            } else {
                                return res.status(201).send(errorHandler('notFound'))
                            }
                        } else {
                            return res.status(201).send(errorHandler('invalidEmail'))
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
        console.log(error)
        return res.status(201).send(errorHandler('fail'))
    }
}

const signup = async (req, res, next) => {
    try {
        let { name,email,password } = req.body
        const header = req.headers.authkey
        if (header !== null && header !== '' && header !== undefined) {
            if (header == Authkey) {
                if (name !== null && name !== '' && name !== undefined && password !== null && password !== '' && password !== undefined && email !== null && email !== '' && email !== undefined) {
                    if(isEmailValid(email)){
                        const userExist = await UserModel.findOne({ Email: email.trim().toLowerCase() })
                        if (userExist === null) {
                            const userInfo = new UserModel();
                            const seq = await getNextSequenceValue("user");
                            userInfo.UserID = seq
                            userInfo.Name = titleCase(name)
                            userInfo.Email = email
                            userInfo.Password = await hashItem(password)
                            userInfo.save().then(d=>{
                                return res.status(200).send({
                                    code: 200,
                                    status: "success",
                                    message: "Successfully Signup",
                                    data : seq   
                                })
                            }).catch(err=>{
                                return res.status(201).send(errorHandler('fail'))
                            })
                        } else {
                            return res.status(201).send(errorHandler('alreadyExists'))
                        }
                    }else{
                        return res.status(201).send(errorHandler('invalidEmail'))

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
        console.log(error)
        return res.status(201).send(errorHandler('fail'))
    }
}

const detail = async(req,res)=>{
    try {
        const { userId } = req.body
        const header = req.headers.authkey
        const token = req.headers.token
        if (header !== null && header !== '' && header !== undefined) {
            if (header == Authkey) {
                if (userId !== null && userId !== '' && userId !== undefined) {
                    const verify = verifyToken(token, userId);
                    if (verify == true) {
                        await UserModel.find({ UserID: userId }).select("Name Email ")
                            .then(async (result) => {
                               res.send({
                                code : 200,
                                status : "success",
                                message : "Successfully",
                                data : result
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
    login,
    signup,
    detail
}