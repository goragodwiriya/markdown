/**
 * Logger.js
 * Logging and error handling utility
 * Provides structured logging with levels
 */

(function(global) {
  'use strict';

  /**
   * Logger Class
   * Handles logging with different severity levels
   */
  function Logger(config) {
    this.config = config || {};
    this.level = this.config.level || 'info';
    this.levels = {
      'debug': 0,
      'info': 1,
      'warn': 2,
      'error': 3
    };
    this.logs = [];
  }

  /**
   * Log debug message
   * @param {string} message - Log message
   * @param {Object} data - Additional data
   */
  Logger.prototype.debug = function(message, data) {
    this._log('debug', message, data);
  };

  /**
   * Log info message
   * @param {string} message - Log message
   * @param {Object} data - Additional data
   */
  Logger.prototype.info = function(message, data) {
    this._log('info', message, data);
  };

  /**
   * Log warning message
   * @param {string} message - Log message
   * @param {Object} data - Additional data
   */
  Logger.prototype.warn = function(message, data) {
    this._log('warn', message, data);
  };

  /**
   * Log error message
   * @param {string} message - Log message
   * @param {Error|Object} error - Error object or data
   */
  Logger.prototype.error = function(message, error) {
    this._log('error', message, error);
  };

  /**
   * Internal logging method
   * @param {string} level - Log level
   * @param {string} message - Log message
   * @param {*} data - Additional data
   */
  Logger.prototype._log = function(level, message, data) {
    if (this.levels[level] < this.levels[this.level]) {
      return;
    }

    var logEntry = {
      timestamp: new Date().toISOString(),
      level: level,
      message: message,
      data: data
    };

    this.logs.push(logEntry);

    // Output to console
    this._outputToConsole(logEntry);
  };

  /**
   * Output log entry to console
   * @param {Object} logEntry - Log entry object
   */
  Logger.prototype._outputToConsole = function(logEntry) {
    if (typeof console === 'undefined') {
      return;
    }

    var prefix = '[' + logEntry.timestamp + '] [' + logEntry.level.toUpperCase() + ']';
    var message = prefix + ' ' + logEntry.message;

    switch (logEntry.level) {
      case 'debug':
        if (console.debug) {
          console.debug(message, logEntry.data || '');
        }
        break;
      case 'info':
        console.info(message, logEntry.data || '');
        break;
      case 'warn':
        console.warn(message, logEntry.data || '');
        break;
      case 'error':
        console.error(message, logEntry.data || '');
        break;
    }
  };

  /**
   * Get all logs
   * @returns {Array} Array of log entries
   */
  Logger.prototype.getLogs = function() {
    return this.logs;
  };

  /**
   * Get logs by level
   * @param {string} level - Log level
   * @returns {Array} Filtered log entries
   */
  Logger.prototype.getLogsByLevel = function(level) {
    return this.logs.filter(function(log) {
      return log.level === level;
    });
  };

  /**
   * Clear all logs
   */
  Logger.prototype.clear = function() {
    this.logs = [];
  };

  /**
   * Export logs to JSON
   * @returns {string} JSON string of logs
   */
  Logger.prototype.exportJSON = function() {
    return JSON.stringify(this.logs, null, 2);
  };

  /**
   * Save logs to file (Node.js only)
   * @param {string} filepath - Output file path
   * @param {Function} callback - Callback function
   */
  Logger.prototype.saveToFile = function(filepath, callback) {
    if (typeof require === 'undefined') {
      callback(new Error('File system operations only available in Node.js'), null);
      return;
    }

    try {
      var fs = require('fs');
      var content = this.exportJSON();

      fs.writeFile(filepath, content, 'utf8', function(error) {
        if (error) {
          callback(error, null);
        } else {
          callback(null, {success: true, filepath: filepath});
        }
      });
    } catch (error) {
      callback(error, null);
    }
  };

  /**
   * Create error object with context
   * @param {string} message - Error message
   * @param {string} code - Error code
   * @param {Object} context - Additional context
   * @returns {Error} Error object
   */
  Logger.prototype.createError = function(message, code, context) {
    var error = new Error(message);
    error.code = code;
    error.context = context;
    error.timestamp = new Date().toISOString();

    this.error(message, error);

    return error;
  };

  /**
   * Set log level
   * @param {string} level - New log level
   */
  Logger.prototype.setLevel = function(level) {
    if (this.levels[level] !== undefined) {
      this.level = level;
    }
  };

  /**
   * Get current log level
   * @returns {string} Current log level
   */
  Logger.prototype.getLevel = function() {
    return this.level;
  };

  // Export for different environments
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = Logger;
  } else {
    global.Logger = Logger;
  }

})(typeof window !== 'undefined' ? window : global);
