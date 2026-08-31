export const errorMiddleware = (err, req, res, next) => {
  console.error(err);

  let statusCode = err.statusCode || 500;
  let message = err.message || "Something went wrong";

  if (err.name === "ValidationError") {
    statusCode = 400;
  }

  if (err.code === 11000) {
    statusCode = 409;
    message = "Duplicate value already exists";
  }

  if (err.name === "UnauthorizedError") {
    statusCode = 401;
  }

  res.status(statusCode).json({
    success: false,
    message
  });
};
