const express = require("express")
const app = express();
const router = new express.Router()
app.use(router)


const AuthController = require("../../Controller/User/AuthController")

router.post("/api/v1/signup", AuthController.signup)
router.post("/api/v1/login", AuthController.login)
router.post("/api/v1/userDetail", AuthController.detail)


const CartController = require("../../Controller/User/CartController")

router.post("/api/v1/addcart", CartController.addcart)
router.post("/api/v1/removeToCart", CartController.removeToCart)
router.post("/api/v1/getAllCart", CartController.getAllCart)
router.post("/api/v1/createOrder", CartController.createOrder)



const BillController = require("../../Controller/User/BillingController")

router.post("/api/v1/addBilling", BillController.addBilling)
router.post("/api/v1/getAllBill", BillController.getAllBill)
// router.post("/api/v1/getAllCart", BillController.getAllCart)
module.exports = router