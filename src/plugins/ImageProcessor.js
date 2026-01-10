/**
 * ImageProcessor.js
 * Plugin for processing images (local, URL, base64)
 * Handles image validation and security
 */

(function(global) {
  'use strict';

  /**
   * Image Processor Plugin
   * Processes and validates images in HTML
   */
  function ImageProcessor(config) {
    this.config = config || {};
    this.name = 'ImageProcessor';
    this.stage = 'postprocess';
  }

  /**
   * Process HTML content
   * @param {string} html - HTML content
   * @param {Object} config - Configuration
   * @returns {string} Processed HTML
   */
  ImageProcessor.prototype.process = function(html, config) {
    var self = this;

    // Process all img tags
    return html.replace(/<img([^>]*)>/g, function(match, attributes) {
      return self._processImage(attributes, config);
    });
  };

  /**
   * Process individual image
   * @param {string} attributes - Image attributes
   * @param {Object} config - Configuration
   * @returns {string} Processed img tag
   */
  ImageProcessor.prototype._processImage = function(attributes, config) {
    var src = this._extractAttribute(attributes, 'src');
    var alt = this._extractAttribute(attributes, 'alt');
    var title = this._extractAttribute(attributes, 'title');
    var width = this._extractAttribute(attributes, 'width');
    var height = this._extractAttribute(attributes, 'height');

    // Validate and process src
    var processedSrc = this._processSrc(src, config);

    if (!processedSrc) {
      // Return placeholder or empty if invalid
      return '<span class="image-error">[Invalid image: ' + this._escapeHTML(alt || 'no description') + ']</span>';
    }

    // Build processed img tag
    var img = '<img src="' + processedSrc + '"';

    if (alt) {
      img += ' alt="' + this._escapeHTML(alt) + '"';
    }

    if (title) {
      img += ' title="' + this._escapeHTML(title) + '"';
    }

    if (width) {
      img += ' width="' + this._sanitizeSize(width) + '"';
    }

    if (height) {
      img += ' height="' + this._sanitizeSize(height) + '"';
    }

    img += ' class="processed-image">';

    return img;
  };

  /**
   * Extract attribute value from attributes string
   * @param {string} attributes - Attributes string
   * @param {string} name - Attribute name
   * @returns {string|null} Attribute value
   */
  ImageProcessor.prototype._extractAttribute = function(attributes, name) {
    var regex = new RegExp(name + '=["\']([^"\']*)["\']', 'i');
    var match = attributes.match(regex);
    return match ? match[1] : null;
  };

  /**
   * Process image source
   * @param {string} src - Image source
   * @param {Object} config - Configuration
   * @returns {string|null} Processed source or null if invalid
   */
  ImageProcessor.prototype._processSrc = function(src, config) {
    if (!src) {
      return null;
    }

    // Check if base64
    if (src.indexOf('data:image/') === 0) {
      return this._validateBase64Image(src) ? src : null;
    }

    // Check if URL
    if (src.indexOf('http://') === 0 || src.indexOf('https://') === 0) {
      if (config.security && !config.security.allowRemoteImages) {
        return null;
      }
      return this._validateURL(src) ? src : null;
    }

    // Assume local path
    return this._validateLocalPath(src) ? src : null;
  };

  /**
   * Validate base64 image
   * @param {string} src - Base64 image source
   * @returns {boolean} Valid or not
   */
  ImageProcessor.prototype._validateBase64Image = function(src) {
    // Check format
    var validFormats = ['data:image/png', 'data:image/jpeg', 'data:image/jpg', 'data:image/gif', 'data:image/svg+xml', 'data:image/webp'];

    for (var i = 0; i < validFormats.length; i++) {
      if (src.indexOf(validFormats[i]) === 0) {
        return true;
      }
    }

    return false;
  };

  /**
   * Validate URL
   * @param {string} url - Image URL
   * @returns {boolean} Valid or not
   */
  ImageProcessor.prototype._validateURL = function(url) {
    try {
      // Basic URL validation
      if (url.indexOf('javascript:') !== -1) {
        return false;
      }

      // Check for valid image extensions
      var validExtensions = ['.png', '.jpg', '.jpeg', '.gif', '.svg', '.webp', '.bmp'];
      var hasValidExtension = false;

      for (var i = 0; i < validExtensions.length; i++) {
        if (url.toLowerCase().indexOf(validExtensions[i]) !== -1) {
          hasValidExtension = true;
          break;
        }
      }

      return hasValidExtension;
    } catch (e) {
      return false;
    }
  };

  /**
   * Validate local path
   * @param {string} path - Local file path
   * @returns {boolean} Valid or not
   */
  ImageProcessor.prototype._validateLocalPath = function(path) {
    // Check for path traversal attempts
    if (path.indexOf('..') !== -1) {
      return false;
    }

    // Check for valid image extensions
    var validExtensions = ['.png', '.jpg', '.jpeg', '.gif', '.svg', '.webp', '.bmp'];

    for (var i = 0; i < validExtensions.length; i++) {
      if (path.toLowerCase().indexOf(validExtensions[i]) !== -1) {
        return true;
      }
    }

    return false;
  };

  /**
   * Sanitize size value
   * @param {string} size - Size value
   * @returns {string} Sanitized size
   */
  ImageProcessor.prototype._sanitizeSize = function(size) {
    // Allow only numbers and valid units
    if (/^\d+$/.test(size)) {
      return size;
    }
    if (/^\d+(px|em|rem|%|cm|mm|in)$/.test(size)) {
      return size;
    }
    return '';
  };

  /**
   * Escape HTML special characters
   * @param {string} text - Text to escape
   * @returns {string} Escaped text
   */
  ImageProcessor.prototype._escapeHTML = function(text) {
    var map = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#x27;'
    };

    return String(text).replace(/[&<>"']/g, function(char) {
      return map[char];
    });
  };

  /**
   * Convert image to base64 (Node.js only)
   * @param {string} filepath - Path to image file
   * @param {Function} callback - Callback function(error, base64)
   */
  ImageProcessor.prototype.convertToBase64 = function(filepath, callback) {
    if (typeof require === 'undefined') {
      callback(new Error('File system operations only available in Node.js'), null);
      return;
    }

    try {
      var fs = require('fs');
      var path = require('path');

      fs.readFile(filepath, function(error, data) {
        if (error) {
          callback(error, null);
          return;
        }

        var ext = path.extname(filepath).toLowerCase();
        var mimeTypes = {
          '.png': 'image/png',
          '.jpg': 'image/jpeg',
          '.jpeg': 'image/jpeg',
          '.gif': 'image/gif',
          '.svg': 'image/svg+xml',
          '.webp': 'image/webp'
        };

        var mimeType = mimeTypes[ext] || 'image/png';
        var base64 = 'data:' + mimeType + ';base64,' + data.toString('base64');

        callback(null, base64);
      });
    } catch (error) {
      callback(error, null);
    }
  };

  /**
   * Get CSS for image styling
   * @returns {string} CSS styles
   */
  ImageProcessor.prototype.getCSS = function() {
    return '.processed-image {\n' +
      '    max-width: 100%;\n' +
      '    height: auto;\n' +
      '    display: block;\n' +
      '    margin: 16px 0;\n' +
      '}\n' +
      '.image-error {\n' +
      '    display: inline-block;\n' +
      '    padding: 8px 12px;\n' +
      '    background: #fff3cd;\n' +
      '    border: 1px solid #ffc107;\n' +
      '    border-radius: 4px;\n' +
      '    color: #856404;\n' +
      '}\n';
  };

  // Export for different environments
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = ImageProcessor;
  } else {
    global.ImageProcessor = ImageProcessor;
  }

})(typeof window !== 'undefined' ? window : global);
