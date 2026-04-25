// Response Handler 
const sendResponse = (res, statusCode, message, data = null) => {
  res.status(statusCode).json({
    success: statusCode < 400,
    message,
    data,
  });
};

const sendSuccess = (res, message, data = null, statusCode = 200) => {
  sendResponse(res, statusCode, message, data);
};

const sendError = (res, message, statusCode = 500) => {
  sendResponse(res, statusCode, message);
};

module.exports = { sendResponse, sendSuccess, sendError };