const express = require('express');
const { ValidationError } = require('sequelize');

// Middleware to handle Sequelize validation errors
function errorHandler(err, req, res, next) {
  if (err instanceof ValidationError) {
    const errors = err.errors.map(e => e.message);
    return res.status(400).json({ error: errors });
  }
  next(err);
}

module.exports = errorHandler;