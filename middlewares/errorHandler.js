export const errorHandler = (error, req, res, next) => {
  console.log("👻 ~ file: errorHandler.js:2 ~ errorHandler ~ error:", error);
  res.status(error.status).json({
    status: error.status,
    message: error.message,
  });
};
