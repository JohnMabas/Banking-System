const express = require("express");
const validate = require("../middleware/validate");
const authenticate = require("../middleware/authenticate");
const {
  validateCreatePin,
  validateUpdatePin,
  validateDeposit,
} = require("../validators/authValidator");
const accountController = require("../controllers/accountController");

const router = express.Router();

router.post("/deposit", validate(validateDeposit), accountController.deposit);

router.use(authenticate);

router.get("/balance", accountController.getBalance);

router.post("/pin", validate(validateCreatePin), accountController.createPin);

router.patch("/pin", validate(validateUpdatePin), accountController.updatePin);

module.exports = router;