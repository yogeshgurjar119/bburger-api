const { counter } = require("../Model/Counter");
const dotenv = require("dotenv").config();
const jwt = require("jsonwebtoken");
const fs = require("fs");
const bcrypt = require("bcrypt");


const isEmailValid = (email) => {
    const regexEmail = /^[A-Z0-9._%+-]+@([A-Z0-9-]+.)+[A-Z]{2,4}$/i;
    const emailValidation = regexEmail.test(email);
    // console.log(emailValidation)
    return emailValidation;
}


const isValidphonenumber = (contact) => {
    const regExContact = /^[6-9]\d{9}$/;
    const validatecontact = regExContact.test(contact);
    return validatecontact;
}




function generateOTP() {

    // const OTP =Math.floor(100000 + Math.random() * 900000);
    const OTP = 123456;
    return OTP;
}

const getNextSequenceValue = async (type) => {
    try {
        const data = await counter.find({ _id: type });
        if (data.length == 0) {
            const res = counter({ _id: type });
            const seq = await res.save();
            return seq.seq;

        }
        const res = await counter
            .findByIdAndUpdate(
                type, { $inc: { seq: 1 } }, { new: true, upsert: true }
            );
        return res.seq;
    } catch (error) {
        console.log(error);
        return error;

    }
};


const errorHandler = (type) => {
    let message;
    switch (type) {
        case 'incorrectPassword':
            message = "Please enter correct password."
            break;

        case 'invalidNumber':
            message = "Please enter a valid phone number."
            break;

        case 'invalidEmail':
            message = "Please enter a valid email address."
            break;
        case 'notFound':
            message = "Not found."
            break;
        case 'invlaidOtp':
            message = "Please enter a valid OTP."
            break;
        case 'accessDenied':
            message = "Access Deined."
            break;
        case 'invalidRequest':
            message = "Invalid Request."
            break;
        case 'alreadyExists':
            message = "Already register."
            break;
        default:
            message = "Something Went Wrong."
            break;
    }

    return {
        code: 201,
        status: type,
        message: message,
    }
}

const verifyToken = (token, userId) => {
    try {
        const decode = jwt.verify(token, process.env.JWTKEY);
        // console.log(decode, userId)
        if (decode.userId === userId) {
            return true;
        } else {
            return 'accessDenied';
        }
    } catch (error) {
        return 'accessDenied';
    }

}





const titleCase = (string) => {
    return string.toLowerCase().split(" ").reduce((s, c) =>
        s + "" + (c.charAt(0).toUpperCase() + c.slice(1) + " "), '');
}

// Function to generate a random course code
function generateCourseCode(Id) {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    const codeLength = 4;
    let courseCode = '';

    for (let i = 0; i < codeLength; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        courseCode += characters.charAt(randomIndex);
    }
    // let res = Date.now().toString()
    // res = res.substring(0, 3).split('').reverse().join('') + Id;
    return courseCode + Id;
}

const couponCode = async (CouponDetails) => {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    const codeLength = 8;
    let code = '';

    for (let i = 0; i < codeLength; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        code += characters.charAt(randomIndex);
    }
    // let res = code + Date.now().toString().substring(0, 3).split('').reverse().join('')
    // res = res.toUpperCase()
    const IsExist = await CouponDetails.findOne({ Code: code })
    if (IsExist === null) {
        return code;
    } else {
       return await couponCode(CouponDetails)
    }
}


const jwtCreate = async(userId)=>{
    try{
        const token = jwt.sign({ userId: userId }, process.env.JWTKEY, {
            expiresIn: 86400000 // expires in 24 hours
        })
        return token;
    }catch(err){
        console.log(err)
        return false;
    }
    
}


const hashItem = async (item) => {
  try {
    const salt = await bcrypt.genSalt(10);
    return bcrypt.hash(item, salt);
  } catch (error) {
    throw false
  }
};

const compareItems = async (item1, item2) => {
  try {
    return bcrypt.compare(item1, item2);
  } catch (error) {
    return false
  }
};

module.exports = {
    isEmailValid,
    isValidphonenumber,
    generateOTP,
    getNextSequenceValue,
    errorHandler,
    verifyToken,
    titleCase,
    jwtCreate,
    generateCourseCode,
    couponCode,
    compareItems,
    hashItem
};