export function asyncHandler(fn) {
  return async function (req, res, next) {
    try {
      return await fn(req, res, next);
    } catch (error) {
      console.error(error.message);

      // Default values
      let statusCode = 500;
      let message = "Something went wrong";

      // 🔹 Validation errors
      if (error.name === "ValidationError") {
        statusCode = 400;
        message = error.message;
      }

      // 🔹 Mongo duplicate key
      if (error.code === 11000) {
        statusCode = 409;
        message = "Duplicate value already exists";
      }

      // 🔹 Unauthorized
      if (error.name === "UnauthorizedError") {
        statusCode = 401;
        message = "Unauthorized access";
      }

      // 🔹 Custom status code
      if (error.statusCode) {
        statusCode = error.statusCode;
        message = error.message;
      }

      return res.status(statusCode).json({
        success: false,
        message
      });
    }
  };

}
