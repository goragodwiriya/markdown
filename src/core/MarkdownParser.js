/**
 * MarkdownParser.js
 * Converts Markdown to HTML following GitHub Flavored Markdown spec
 * Implements parsing with extensibility for plugins
 */

(function(global) {
  'use strict';

  /**
   * Markdown Parser Class
   * Converts Markdown syntax to HTML
   */
  function MarkdownParser(config) {
    this.config = config || {};
    this.plugins = [];
  }

  /**
   * Parse Markdown to HTML
   * @param {string} markdown - Markdown content
   * @returns {string} HTML output
   */
  MarkdownParser.prototype.parse = function(markdown) {
    if (!markdown || typeof markdown !== 'string') {
      return '';
    }

    var html = markdown;

    // Apply preprocessing plugins
    html = this._applyPlugins('preprocess', html);

    // Parse block-level elements
    html = this._parseBlocks(html);

    // Parse inline elements
    html = this._parseInline(html);

    // Apply postprocessing plugins
    html = this._applyPlugins('postprocess', html);

    return html;
  };

  /**
   * Parse block-level elements
   * @param {string} text - Text to parse
   * @returns {string} Parsed HTML
   */
  MarkdownParser.prototype._parseBlocks = function(text) {
    var lines = text.split('\n');
    var html = [];
    var i = 0;

    while (i < lines.length) {
      var line = lines[i];

      // Code blocks (fenced)
      if (line.trim().indexOf('```') === 0) {
        var result = this._parseCodeBlock(lines, i);
        html.push(result.html);
        i = result.nextIndex;
        continue;
      }

      // Headings
      if (line.match(/^#{1,6}\s/)) {
        html.push(this._parseHeading(line));
        i++;
        continue;
      }

      // Horizontal rule
      if (line.match(/^(\*{3,}|-{3,}|_{3,})$/)) {
        html.push('<hr>');
        i++;
        continue;
      }

      // Blockquote
      if (line.trim().indexOf('>') === 0) {
        var blockquoteResult = this._parseBlockquote(lines, i);
        html.push(blockquoteResult.html);
        i = blockquoteResult.nextIndex;
        continue;
      }

      // Unordered list
      if (line.match(/^[\s]*[-*+]\s/)) {
        var ulResult = this._parseList(lines, i, 'ul');
        html.push(ulResult.html);
        i = ulResult.nextIndex;
        continue;
      }

      // Ordered list
      if (line.match(/^[\s]*\d+\.\s/)) {
        var olResult = this._parseList(lines, i, 'ol');
        html.push(olResult.html);
        i = olResult.nextIndex;
        continue;
      }

      // Table
      if (this._isTableRow(line) && i + 1 < lines.length && this._isTableDelimiter(lines[i + 1])) {
        var tableResult = this._parseTable(lines, i);
        html.push(tableResult.html);
        i = tableResult.nextIndex;
        continue;
      }

      // Paragraph
      if (line.trim() !== '') {
        html.push('<p>' + line + '</p>');
      }

      i++;
    }

    return html.join('\n');
  };

  /**
   * Parse heading
   * @param {string} line - Line containing heading
   * @returns {string} HTML heading
   */
  MarkdownParser.prototype._parseHeading = function(line) {
    var match = line.match(/^(#{1,6})\s+(.+)$/);
    if (!match) return line;

    var level = match[1].length;
    var text = match[2].trim();
    var id = this._generateId(text);

    return '<h' + level + ' id="' + id + '">' + text + '</h' + level + '>';
  };

  /**
   * Generate ID from text
   * @param {string} text - Text to convert
   * @returns {string} ID string
   */
  MarkdownParser.prototype._generateId = function(text) {
    return text.toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  };

  /**
   * Parse code block
   * @param {Array} lines - All lines
   * @param {number} startIndex - Start index
   * @returns {Object} HTML and next index
   */
  MarkdownParser.prototype._parseCodeBlock = function(lines, startIndex) {
    var language = lines[startIndex].trim().substring(3).trim();
    var code = [];
    var i = startIndex + 1;

    while (i < lines.length && lines[i].trim() !== '```') {
      code.push(this._escapeHTML(lines[i]));
      i++;
    }

    var langClass = language ? ' class="language-' + language + '"' : '';
    var html = '<pre><code' + langClass + '>' + code.join('\n') + '</code></pre>';

    return {
      html: html,
      nextIndex: i + 1
    };
  };

  /**
   * Parse blockquote
   * @param {Array} lines - All lines
   * @param {number} startIndex - Start index
   * @returns {Object} HTML and next index
   */
  MarkdownParser.prototype._parseBlockquote = function(lines, startIndex) {
    var content = [];
    var i = startIndex;

    while (i < lines.length && lines[i].trim().indexOf('>') === 0) {
      content.push(lines[i].trim().substring(1).trim());
      i++;
    }

    return {
      html: '<blockquote><p>' + content.join(' ') + '</p></blockquote>',
      nextIndex: i
    };
  };

  /**
   * Parse list (ordered or unordered)
   * @param {Array} lines - All lines
   * @param {number} startIndex - Start index
   * @param {string} type - 'ul' or 'ol'
   * @returns {Object} HTML and next index
   */
  MarkdownParser.prototype._parseList = function(lines, startIndex, type) {
    var items = [];
    var i = startIndex;
    var pattern = type === 'ul' ? /^[\s]*[-*+]\s+(.+)$/ : /^[\s]*\d+\.\s+(.+)$/;

    while (i < lines.length) {
      var match = lines[i].match(pattern);
      if (!match) break;

      items.push('<li>' + match[1] + '</li>');
      i++;
    }

    return {
      html: '<' + type + '>\n' + items.join('\n') + '\n</' + type + '>',
      nextIndex: i
    };
  };

  /**
   * Check if line is a table row
   * @param {string} line - Line to check
   * @returns {boolean}
   */
  MarkdownParser.prototype._isTableRow = function(line) {
    return line.indexOf('|') !== -1;
  };

  /**
   * Check if line is a table delimiter
   * @param {string} line - Line to check
   * @returns {boolean}
   */
  MarkdownParser.prototype._isTableDelimiter = function(line) {
    return /^\|?[\s]*:?-+:?[\s]*(\|[\s]*:?-+:?[\s]*)+\|?$/.test(line.trim());
  };

  /**
   * Parse table
   * @param {Array} lines - All lines
   * @param {number} startIndex - Start index
   * @returns {Object} HTML and next index
   */
  MarkdownParser.prototype._parseTable = function(lines, startIndex) {
    var headers = this._parseTableRow(lines[startIndex]);
    var i = startIndex + 2; // Skip delimiter
    var rows = [];

    while (i < lines.length && this._isTableRow(lines[i])) {
      rows.push(this._parseTableRow(lines[i]));
      i++;
    }

    var html = '<table>\n<thead>\n<tr>\n';
    headers.forEach(function(header) {
      html += '<th>' + header + '</th>\n';
    });
    html += '</tr>\n</thead>\n<tbody>\n';

    rows.forEach(function(row) {
      html += '<tr>\n';
      row.forEach(function(cell) {
        html += '<td>' + cell + '</td>\n';
      });
      html += '</tr>\n';
    });

    html += '</tbody>\n</table>';

    return {
      html: html,
      nextIndex: i
    };
  };

  /**
   * Parse table row
   * @param {string} line - Table row line
   * @returns {Array} Cell contents
   */
  MarkdownParser.prototype._parseTableRow = function(line) {
    return line.split('|')
      .map(function(cell) {return cell.trim();})
      .filter(function(cell) {return cell !== '';});
  };

  /**
   * Parse inline elements
   * @param {string} html - HTML with inline markdown
   * @returns {string} Parsed HTML
   */
  MarkdownParser.prototype._parseInline = function(html) {
    var self = this;

    // Bold
    html = html.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
    html = html.replace(/__(.+?)__/g, '<strong>$1</strong>');

    // Italic
    html = html.replace(/\*(.+?)\*/g, '<em>$1</em>');
    html = html.replace(/_(.+?)_/g, '<em>$1</em>');

    // Strikethrough
    html = html.replace(/~~(.+?)~~/g, '<s>$1</s>');

    // Inline code - escape HTML inside backticks
    html = html.replace(/`([^`]+)`/g, function(match, code) {
      return '<code>' + self._escapeHTML(code) + '</code>';
    });

    // Links - with URL validation
    html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, function(match, text, url) {
      if (self._isValidURL(url)) {
        return '<a href="' + self._escapeHTML(url) + '">' + text + '</a>';
      }
      return text; // Return just the text if URL is invalid
    });

    // Images - with URL validation
    html = html.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, function(match, alt, url) {
      if (self._isValidImageURL(url)) {
        return '<img src="' + self._escapeHTML(url) + '" alt="' + self._escapeHTML(alt) + '">';
      }
      return ''; // Remove invalid image
    });

    return html;
  };

  /**
   * Escape HTML special characters
   * @param {string} text - Text to escape
   * @returns {string} Escaped text
   */
  MarkdownParser.prototype._escapeHTML = function(text) {
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
   * Validate URL for links (blocks javascript:, vbscript:, data:)
   * @param {string} url - URL to validate
   * @returns {boolean}
   */
  MarkdownParser.prototype._isValidURL = function(url) {
    if (!url) return false;

    var lowerUrl = url.toLowerCase().trim();

    // Block dangerous protocols
    if (lowerUrl.indexOf('javascript:') === 0) return false;
    if (lowerUrl.indexOf('vbscript:') === 0) return false;
    if (lowerUrl.indexOf('data:') === 0) return false;

    // Block protocol-relative URLs that could point to external sites
    if (url.indexOf('//') === 0) return false;

    return true;
  };

  /**
   * Validate URL for images (allows data:image/ URLs)
   * @param {string} url - URL to validate
   * @returns {boolean}
   */
  MarkdownParser.prototype._isValidImageURL = function(url) {
    if (!url) return false;

    var lowerUrl = url.toLowerCase().trim();

    // Block dangerous protocols
    if (lowerUrl.indexOf('javascript:') === 0) return false;
    if (lowerUrl.indexOf('vbscript:') === 0) return false;

    // Block protocol-relative URLs
    if (url.indexOf('//') === 0) return false;

    // Allow data:image/ URLs only
    if (lowerUrl.indexOf('data:') === 0) {
      return lowerUrl.indexOf('data:image/') === 0;
    }

    return true;
  };

  /**
   * Register a plugin
   * @param {Object} plugin - Plugin object with process method
   */
  MarkdownParser.prototype.registerPlugin = function(plugin) {
    if (plugin && typeof plugin.process === 'function') {
      this.plugins.push(plugin);
    }
  };

  /**
   * Apply plugins at specific stage
   * @param {string} stage - Plugin stage (preprocess/postprocess)
   * @param {string} content - Content to process
   * @returns {string} Processed content
   */
  MarkdownParser.prototype._applyPlugins = function(stage, content) {
    var result = content;

    for (var i = 0; i < this.plugins.length; i++) {
      var plugin = this.plugins[i];
      if (plugin.stage === stage || !plugin.stage) {
        result = plugin.process(result, this.config);
      }
    }

    return result;
  };

  // Export for different environments
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = MarkdownParser;
  } else {
    global.MarkdownParser = MarkdownParser;
  }

})(typeof window !== 'undefined' ? window : global);
