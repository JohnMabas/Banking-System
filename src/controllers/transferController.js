const bcrypt = require("bcryptjs");
const AppError = require("../utils/AppError");
const asyncHandler = require("../utils/asyncHandler");
const { findUserById, findUserByAccountNumber, transfer } = require("../data/users");


exports.makeTransfer = asyncHandler(async (req, res) => {
  const sender = findUserById(req.user.id);
  if (!sender) {
    throw new AppError("User not found.", 404);
  }
  if (!sender.pin) {
    throw new AppError("Create a pin before making transfers.", 400);
  }

  const { recipientAccountNumber, pin, amount } = req.validatedBody;
  const pinMatches = await bcrypt.compare(pin, sender.pin);
  if (!pinMatches) {
    throw new AppError("Invalid pin.", 401);
  }
  if (recipientAccountNumber === sender.accountNumber) {
    throw new AppError("You cannot transfer to yourself.", 400);
  }

  const recipient = findUserByAccountNumber(recipientAccountNumber);
  if (!recipient) {
    throw new AppError("Recipient not found.", 404);
  }

  transfer(sender.id, recipient, amount);

  res.status(200).json({
    success: true,
    message: "Transfer successful.",
    data: {
      recipientAccountNumber,
      amount,
      newBalance: sender.balance,
    },
  });
});