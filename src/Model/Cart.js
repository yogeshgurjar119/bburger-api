const mongoose = require('mongoose');
const Cart = new mongoose.Schema({
    CartID: {
        type: String,
        trim :true,
        required: true
    },
    UserID: {
        type: String,
        trim :true,
        required: true
    },
    Item : [
        {
            ProductID: {
                type: String,
                trim :true,
            },
            Quantity: {
                type: Number,
                trim :true,
            },
        }
    ],
    Status : {
        type: String,
        default:"Pending"
    },
    IsActive: {
        type: Boolean,
        default:true
    },
},
{ timestamps: true }
)

module.exports = mongoose.model("cartdetails", Cart)