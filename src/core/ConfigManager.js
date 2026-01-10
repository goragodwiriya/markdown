/**
 * ConfigManager.js
 * Manages configuration settings with validation and defaults
 * Follows Single Responsibility Principle
 */

(function(global) {
  'use strict';

  /**
   * Configuration Manager Class
   * Handles loading, validation, and merging of configuration options
   */
  function ConfigManager(userConfig) {
    this.config = this._mergeWithDefaults(userConfig || {});
    this._validate();
  }

  /**
   * Default configuration settings
   */
  ConfigManager.prototype._getDefaults = function() {
    return {
      pageSize: 'A4',
      margins: {
        top: '2cm',
        right: '2cm',
        bottom: '2cm',
        left: '2cm'
      },
      theme: 'default',
      template: 'templates/default.html',
      enableTOC: false,
      syntaxHighlighting: true,
      sanitizeHTML: true,
      fonts: ['fonts/NotoSans/'],
      header: {
        enabled: false,
        content: '',
        height: '1cm'
      },
      footer: {
        enabled: true,
        content: 'Page {{page}} of {{totalPages}}',
        height: '1cm'
      },
      metadata: {
        title: '',
        author: '',
        subject: '',
        keywords: []
      },
      security: {
        allowRemoteImages: false,
        allowExternalLinks: true,
        sanitizationLevel: 'strict'
      },
      performance: {
        batchSize: 10,
        timeout: 30000
      }
    };
  };

  /**
   * Merge user configuration with defaults
   * @param {Object} userConfig - User provided configuration
   * @returns {Object} Merged configuration
   */
  ConfigManager.prototype._mergeWithDefaults = function(userConfig) {
    var defaults = this._getDefaults();
    return this._deepMerge(defaults, userConfig);
  };

  /**
   * Deep merge two objects
   * @param {Object} target - Target object
   * @param {Object} source - Source object
   * @returns {Object} Merged object
   */
  ConfigManager.prototype._deepMerge = function(target, source) {
    var result = {};
    var key;

    // Copy target properties
    for (key in target) {
      if (target.hasOwnProperty(key)) {
        result[key] = target[key];
      }
    }

    // Merge source properties
    for (key in source) {
      if (source.hasOwnProperty(key)) {
        if (this._isObject(source[key]) && this._isObject(target[key])) {
          result[key] = this._deepMerge(target[key], source[key]);
        } else {
          result[key] = source[key];
        }
      }
    }

    return result;
  };

  /**
   * Check if value is a plain object
   * @param {*} value - Value to check
   * @returns {boolean}
   */
  ConfigManager.prototype._isObject = function(value) {
    return value !== null && typeof value === 'object' && !Array.isArray(value);
  };

  /**
   * Validate configuration
   * @throws {Error} If configuration is invalid
   */
  ConfigManager.prototype._validate = function() {
    var validPageSizes = ['A4', 'A3', 'A5', 'Letter', 'Legal'];

    if (validPageSizes.indexOf(this.config.pageSize) === -1) {
      throw new Error('Invalid page size: ' + this.config.pageSize);
    }

    if (!this._validateMargins(this.config.margins)) {
      throw new Error('Invalid margins configuration');
    }

    if (typeof this.config.sanitizeHTML !== 'boolean') {
      throw new Error('sanitizeHTML must be a boolean');
    }
  };

  /**
   * Validate margins configuration
   * @param {Object} margins - Margins object
   * @returns {boolean}
   */
  ConfigManager.prototype._validateMargins = function(margins) {
    var required = ['top', 'right', 'bottom', 'left'];
    var validUnits = /^\d+(\.\d+)?(cm|mm|in|px)$/;

    for (var i = 0; i < required.length; i++) {
      var side = required[i];
      if (!margins[side] || !validUnits.test(margins[side])) {
        return false;
      }
    }

    return true;
  };

  /**
   * Get configuration value
   * @param {string} path - Dot notation path (e.g., 'margins.top')
   * @returns {*} Configuration value
   */
  ConfigManager.prototype.get = function(path) {
    var parts = path.split('.');
    var current = this.config;

    for (var i = 0; i < parts.length; i++) {
      if (current[parts[i]] === undefined) {
        return undefined;
      }
      current = current[parts[i]];
    }

    return current;
  };

  /**
   * Set configuration value
   * @param {string} path - Dot notation path
   * @param {*} value - Value to set
   */
  ConfigManager.prototype.set = function(path, value) {
    var parts = path.split('.');
    var current = this.config;

    for (var i = 0; i < parts.length - 1; i++) {
      if (!current[parts[i]]) {
        current[parts[i]] = {};
      }
      current = current[parts[i]];
    }

    current[parts[parts.length - 1]] = value;
    this._validate();
  };

  /**
   * Get all configuration
   * @returns {Object} Complete configuration object
   */
  ConfigManager.prototype.getAll = function() {
    return JSON.parse(JSON.stringify(this.config));
  };

  /**
   * Load configuration from JSON string
   * @param {string} jsonString - JSON configuration string
   */
  ConfigManager.prototype.loadFromJSON = function(jsonString) {
    try {
      var parsed = JSON.parse(jsonString);
      this.config = this._mergeWithDefaults(parsed);
      this._validate();
    } catch (e) {
      throw new Error('Invalid JSON configuration: ' + e.message);
    }
  };

  // Export for different environments
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = ConfigManager;
  } else {
    global.ConfigManager = ConfigManager;
  }

})(typeof window !== 'undefined' ? window : global);
