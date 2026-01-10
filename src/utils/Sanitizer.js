/**
 * Sanitizer.js
 * HTML sanitization to prevent XSS attacks
 * Implements whitelist-based approach
 */

(function(global) {
  'use strict';

  /**
   * HTML Sanitizer Class
   * Sanitizes HTML content to prevent XSS and injection attacks
   */
  function Sanitizer(options) {
    this.options = options || {};
    this.level = this.options.level || 'strict';
    this._initializeWhitelists();
  }

  /**
   * Initialize whitelists for allowed tags and attributes
   */
  Sanitizer.prototype._initializeWhitelists = function() {
    // Allowed HTML tags
    this.allowedTags = [
      'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
      'p', 'br', 'hr',
      'strong', 'em', 'u', 's', 'code', 'pre',
      'ul', 'ol', 'li',
      'blockquote',
      'table', 'thead', 'tbody', 'tr', 'th', 'td',
      'a', 'img',
      'div', 'span',
      'sup', 'sub',
      'dl', 'dt', 'dd'
    ];

    // Allowed attributes per tag
    this.allowedAttributes = {
      'a': ['href', 'title', 'target'],
      'img': ['src', 'alt', 'title', 'width', 'height'],
      'code': ['class'],
      'pre': ['class'],
      'div': ['class', 'id'],
      'span': ['class'],
      'table': ['class'],
      'th': ['align', 'colspan', 'rowspan'],
      'td': ['align', 'colspan', 'rowspan']
    };

    // Allowed URL schemes
    this.allowedSchemes = ['http:', 'https:', 'mailto:', 'data:'];
  };

  /**
   * Sanitize HTML content
   * @param {string} html - HTML string to sanitize
   * @returns {string} Sanitized HTML
   */
  Sanitizer.prototype.sanitize = function(html) {
    if (!html || typeof html !== 'string') {
      return '';
    }

    // Create a temporary container
    var container = this._createContainer();
    container.innerHTML = html;

    // Recursively sanitize nodes
    this._sanitizeNode(container);

    return container.innerHTML;
  };

  /**
   * Create a container element for sanitization
   * @returns {HTMLElement}
   */
  Sanitizer.prototype._createContainer = function() {
    if (typeof document !== 'undefined') {
      return document.createElement('div');
    }

    // For Node.js environment, use a simple parser
    return {
      innerHTML: '',
      childNodes: [],
      removeChild: function() {},
      replaceChild: function() {}
    };
  };

  /**
   * Recursively sanitize DOM nodes
   * @param {Node} node - DOM node to sanitize
   */
  Sanitizer.prototype._sanitizeNode = function(node) {
    var i = node.childNodes.length;

    while (i--) {
      var child = node.childNodes[i];

      if (child.nodeType === 1) { // Element node
        this._sanitizeElement(child, node);
      } else if (child.nodeType === 3) { // Text node
        // Text nodes are safe, keep as is
        continue;
      } else if (child.nodeType === 8) { // Comment node
        node.removeChild(child);
      } else {
        node.removeChild(child);
      }
    }
  };

  /**
   * Sanitize an element node
   * @param {Element} element - Element to sanitize
   * @param {Node} parent - Parent node
   */
  Sanitizer.prototype._sanitizeElement = function(element, parent) {
    var tagName = element.tagName.toLowerCase();

    // Check if tag is allowed
    if (this.allowedTags.indexOf(tagName) === -1) {
      // Remove disallowed tag but keep its content
      while (element.firstChild) {
        parent.insertBefore(element.firstChild, element);
      }
      parent.removeChild(element);
      return;
    }

    // Sanitize attributes
    this._sanitizeAttributes(element, tagName);

    // Recursively sanitize children
    this._sanitizeNode(element);
  };

  /**
   * Sanitize element attributes
   * @param {Element} element - Element to sanitize
   * @param {string} tagName - Tag name
   */
  Sanitizer.prototype._sanitizeAttributes = function(element, tagName) {
    var allowedAttrs = this.allowedAttributes[tagName] || [];
    var attrs = element.attributes;
    var i = attrs.length;

    while (i--) {
      var attr = attrs[i];
      var attrName = attr.name.toLowerCase();

      // Remove disallowed attributes
      if (allowedAttrs.indexOf(attrName) === -1) {
        element.removeAttribute(attrName);
        continue;
      }

      // Validate attribute values
      if (attrName === 'href' || attrName === 'src') {
        if (!this._isValidURL(attr.value)) {
          element.removeAttribute(attrName);
        }
      }

      // Remove event handlers
      if (attrName.indexOf('on') === 0) {
        element.removeAttribute(attrName);
      }
    }
  };

  /**
   * Validate URL
   * @param {string} url - URL to validate
   * @returns {boolean}
   */
  Sanitizer.prototype._isValidURL = function(url) {
    if (!url) return false;

    // Check for javascript: protocol
    if (url.toLowerCase().indexOf('javascript:') === 0) {
      return false;
    }

    // Check for vbscript: protocol (IE legacy)
    if (url.toLowerCase().indexOf('vbscript:') === 0) {
      return false;
    }

    // Block protocol-relative URLs (//evil.com)
    if (url.indexOf('//') === 0) {
      return false;
    }

    // Check for data: URLs (allow only images)
    if (url.toLowerCase().indexOf('data:') === 0) {
      return url.indexOf('data:image/') === 0;
    }

    // Validate against allowed schemes
    for (var i = 0; i < this.allowedSchemes.length; i++) {
      if (url.indexOf(this.allowedSchemes[i]) === 0) {
        return true;
      }
    }

    // Allow relative URLs (but not protocol-relative)
    if (url.indexOf('/') === 0 || url.indexOf('./') === 0 || url.indexOf('../') === 0) {
      return true;
    }

    // Allow anchor links
    if (url.indexOf('#') === 0) {
      return true;
    }

    return false;
  };

  /**
   * Escape HTML special characters
   * @param {string} text - Text to escape
   * @returns {string} Escaped text
   */
  Sanitizer.prototype.escapeHTML = function(text) {
    var map = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#x27;',
      '/': '&#x2F;'
    };

    return String(text).replace(/[&<>"'\/]/g, function(char) {
      return map[char];
    });
  };

  /**
   * Sanitize for use in attributes
   * @param {string} value - Attribute value
   * @returns {string} Sanitized value
   */
  Sanitizer.prototype.sanitizeAttribute = function(value) {
    return this.escapeHTML(value).replace(/\s+/g, ' ').trim();
  };

  // Export for different environments
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = Sanitizer;
  } else {
    global.Sanitizer = Sanitizer;
  }

})(typeof window !== 'undefined' ? window : global);
