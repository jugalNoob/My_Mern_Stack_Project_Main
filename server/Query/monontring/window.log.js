import winston from "winston";

const logger = winston.createLogger({
  level: "info",
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  defaultMeta: { service: "student-service" },
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: "logs/error.log", level: "error" }),
    new winston.transports.File({ filename: "logs/combined.log" }),
  ],
});

export default logger;


// 🔥 Bonus — Auto Inject requestId Middleware

// Add middleware:

// app.use((req, res, next) => {
//   req.logger = logger.child({ requestId: req.requestId });
//   next();
// });