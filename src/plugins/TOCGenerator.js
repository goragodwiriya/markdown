/**
 * TOCGenerator.js
 * Plugin for generating Table of Contents from headings
 * Automatically creates navigation structure
 */

(function(global) {
  'use strict';

  /**
   * Table of Contents Generator Plugin
   * Extracts headings and creates TOC
   */
  function TOCGenerator(config) {
    this.config = config || {};
    this.name = 'TOCGenerator';
    this.stage = 'postprocess';
    this.headings = [];
  }

  /**
   * Process HTML content
   * @param {string} html - HTML content
   * @param {Object} config - Configuration
   * @returns {string} Processed HTML with TOC
   */
  TOCGenerator.prototype.process = function(html, config) {
    if (!config.enableTOC) {
      return html;
    }

    // Extract headings
    this.headings = this._extractHeadings(html);

    // Generate TOC HTML
    var toc = this._generateTOC();

    // Insert TOC after first heading or at beginning
    var insertPosition = html.indexOf('</h1>');
    if (insertPosition === -1) {
      insertPosition = 0;
      return toc + html;
    } else {
      insertPosition += 5; // After </h1>
      return html.substring(0, insertPosition) + '\n' + toc + html.substring(insertPosition);
    }
  };

  /**
   * Extract headings from HTML
   * @param {string} html - HTML content
   * @returns {Array} Array of heading objects
   */
  TOCGenerator.prototype._extractHeadings = function(html) {
    var headings = [];
    var regex = /<h([1-6])\s+id="([^"]+)">([^<]+)<\/h[1-6]>/g;
    var match;

    while ((match = regex.exec(html)) !== null) {
      headings.push({
        level: parseInt(match[1]),
        id: match[2],
        text: match[3]
      });
    }

    return headings;
  };

  /**
   * Generate TOC HTML
   * @returns {string} TOC HTML
   */
  TOCGenerator.prototype._generateTOC = function() {
    if (this.headings.length === 0) {
      return '';
    }

    var html = '<nav class="table-of-contents">\n';
    html += '<h2>Table of Contents</h2>\n';
    html += this._buildTOCTree(this.headings);
    html += '</nav>\n';

    return html;
  };

  /**
   * Build hierarchical TOC tree
   * @param {Array} headings - Array of heading objects
   * @returns {string} Nested list HTML
   */
  TOCGenerator.prototype._buildTOCTree = function(headings) {
    if (headings.length === 0) {
      return '';
    }

    var html = '<ul>\n';
    var currentLevel = headings[0].level;
    var stack = [currentLevel];

    for (var i = 0; i < headings.length; i++) {
      var heading = headings[i];

      // Adjust nesting level
      while (stack.length > 0 && heading.level < stack[stack.length - 1]) {
        html += '</ul>\n</li>\n';
        stack.pop();
      }

      if (heading.level > currentLevel) {
        html += '<ul>\n';
        stack.push(heading.level);
      }

      html += '<li><a href="#' + heading.id + '">' + this._escapeHTML(heading.text) + '</a>';

      // Check if next heading is deeper
      if (i + 1 < headings.length && headings[i + 1].level > heading.level) {
        // Don't close li yet, nested ul will follow
      } else {
        html += '</li>\n';
      }

      currentLevel = heading.level;
    }

    // Close remaining open tags
    while (stack.length > 1) {
      html += '</ul>\n</li>\n';
      stack.pop();
    }

    html += '</ul>\n';

    return html;
  };

  /**
   * Escape HTML special characters
   * @param {string} text - Text to escape
   * @returns {string} Escaped text
   */
  TOCGenerator.prototype._escapeHTML = function(text) {
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
   * Get TOC as plain object
   * @returns {Array} Array of heading objects
   */
  TOCGenerator.prototype.getTOC = function() {
    return this.headings;
  };

  /**
   * Get CSS for TOC styling
   * @returns {string} CSS styles
   */
  TOCGenerator.prototype.getCSS = function() {
    return '.table-of-contents {\n' +
      '    background: #f8f9fa;\n' +
      '    border: 1px solid #dee2e6;\n' +
      '    border-radius: 4px;\n' +
      '    padding: 20px;\n' +
      '    margin: 20px 0;\n' +
      '}\n' +
      '.table-of-contents h2 {\n' +
      '    margin-top: 0;\n' +
      '    font-size: 1.5em;\n' +
      '}\n' +
      '.table-of-contents ul {\n' +
      '    list-style: none;\n' +
      '    padding-left: 20px;\n' +
      '}\n' +
      '.table-of-contents li {\n' +
      '    margin: 8px 0;\n' +
      '}\n' +
      '.table-of-contents a {\n' +
      '    color: #0366d6;\n' +
      '    text-decoration: none;\n' +
      '}\n' +
      '.table-of-contents a:hover {\n' +
      '    text-decoration: underline;\n' +
      '}\n';
  };

  // Export for different environments
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = TOCGenerator;
  } else {
    global.TOCGenerator = TOCGenerator;
  }

})(typeof window !== 'undefined' ? window : global);
