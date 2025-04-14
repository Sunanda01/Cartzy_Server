const CustomErrorHandler = require("../Services/customErrorHandler");
const validationError = require("joi").ValidationError;
function errorHandler(err, req, res, next) {
  let errorStatus = err.status || 500;
  let errorMessage = err.message || "Internal Server Error";
  if (err instanceof validationError || err.isJoi) {
    errorStatus = 422;
    errorMessage = err.details?.[0]?.message || "Validation error";
  }

  if (err instanceof CustomErrorHandler) {
    errorStatus = err.status;
    errorMessage = err.message;
  }

  return res.status(errorStatus).json({
    success: false,
    status: errorStatus,
    msg: errorMessage,
    stack: err.stack,
  });
}
module.exports = errorHandler;
