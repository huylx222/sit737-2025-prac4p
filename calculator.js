const express = require('express');
const winston = require('winston');

const app = express();
const PORT = 3000;

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  defaultMeta: { service: 'calculator-microservice' },
  transports: [
    new winston.transports.Console({ format: winston.format.simple() }),
    new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
    new winston.transports.File({ filename: 'logs/combined.log' }),
  ],
});

const validateInput = (req, res, next) => {
  const { num1, num2 } = req.query;
  if (!num1 || !num2 || isNaN(num1) || isNaN(num2)) {
    logger.error('Invalid input parameters');
    return res.status(400).json({ error: 'Invalid input parameters' });
  }
  req.num1 = parseFloat(num1);
  req.num2 = parseFloat(num2);
  next();
};

app.get('/add', validateInput, (req, res) => {
  const result = req.num1 + req.num2;
  logger.info(`Addition operation: ${req.num1} + ${req.num2} = ${result}`);
  res.json({ result });
});

app.get('/subtract', validateInput, (req, res) => {
  const result = req.num1 - req.num2;
  logger.info(`Subtraction operation: ${req.num1} - ${req.num2} = ${result}`);
  res.json({ result });
});

app.get('/multiply', validateInput, (req, res) => {
  const result = req.num1 * req.num2;
  logger.info(`Multiplication operation: ${req.num1} * ${req.num2} = ${result}`);
  res.json({ result });
});

app.get('/divide', validateInput, (req, res) => {
  if (req.num2 === 0) {
    logger.error('Division by zero error');
    return res.status(400).json({ error: 'Cannot divide by zero' });
  }
  const result = req.num1 / req.num2;
  logger.info(`Division operation: ${req.num1} / ${req.num2} = ${result}`);
  res.json({ result });
});

app.listen(PORT, () => {
  console.log(`Calculator microservice is running on http://localhost:${PORT}`);
});
