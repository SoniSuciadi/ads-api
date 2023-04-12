export const errorHandler = (error, req, res, next) => {
  console.log("👻 ~ file: errorHandler.js:2 ~ errorHandler ~ error:", error);
  res.status(error.status || error.response.status).json({
    status: error.status || error.response.status,
    message: error.message || error.response.data.error,
  });
};
