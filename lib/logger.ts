import pino from "pino"

const logger = pino({
  level: process.env.LOG_LEVEL || "info",
  redact: ["req.headers.authorization", "req.body.cardNumber"],
})

export default logger

