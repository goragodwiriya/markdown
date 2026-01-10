/**
 * HTMLRenderer.js
 * Manages HTML template rendering and variable substitution
 * Handles header, footer, and content injection
 */

(function(global) {
  'use strict';

  /**
   * HTML Renderer Class
   * Renders HTML from templates with variable substitution
   */
  function HTMLRenderer(config) {
    this.config = config || {};
    this.template = null;
    this.variables = {};
  }

  /**
   * Load HTML template
   * @param {string} templateContent - Template HTML content
   */
  HTMLRenderer.prototype.loadTemplate = function(templateContent) {
    this.template = templateContent;
  };

  /**
   * Set template variables
   * @param {Object} variables - Key-value pairs for substitution
   */
  HTMLRenderer.prototype.setVariables = function(variables) {
    for (var key in variables) {
      if (variables.hasOwnProperty(key)) {
        this.variables[key] = variables[key];
      }
    }
  };

  /**
   * Render HTML with content
   * @param {string} content - Main content HTML
   * @returns {string} Complete rendered HTML
   */
  HTMLRenderer.prototype.render = function(content) {
    if (!this.template) {
      return this._getDefaultTemplate(content);
    }

    var html = this.template;

    // Inject content
    html = html.replace('{{content}}', content);

    // Inject header
    if (this.config.header && this.config.header.enabled) {
      var headerHTML = this._renderHeader();
      html = html.replace('{{header}}', headerHTML);
    } else {
      html = html.replace('{{header}}', '');
    }

    // Inject footer
    if (this.config.footer && this.config.footer.enabled) {
      var footerHTML = this._renderFooter();
      html = html.replace('{{footer}}', footerHTML);
    } else {
      html = html.replace('{{footer}}', '');
    }

    // Replace all variables
    html = this._substituteVariables(html);

    return html;
  };

  /**
   * Render header HTML
   * @returns {string} Header HTML
   */
  HTMLRenderer.prototype._renderHeader = function() {
    var content = this.config.header.content || '';
    content = this._substituteVariables(content);

    return '<div class="pdf-header">' + content + '</div>';
  };

  /**
   * Render footer HTML
   * @returns {string} Footer HTML
   */
  HTMLRenderer.prototype._renderFooter = function() {
    var content = this.config.footer.content || '';
    content = this._substituteVariables(content);

    return '<div class="pdf-footer">' + content + '</div>';
  };

  /**
   * Substitute template variables
   * @param {string} text - Text with variables
   * @returns {string} Text with substituted values
   */
  HTMLRenderer.prototype._substituteVariables = function(text) {
    var result = text;

    // Replace custom variables
    for (var key in this.variables) {
      if (this.variables.hasOwnProperty(key)) {
        var pattern = new RegExp('\\{\\{' + key + '\\}\\}', 'g');
        result = result.replace(pattern, this.variables[key]);
      }
    }

    // Replace metadata variables
    if (this.config.metadata) {
      for (var metaKey in this.config.metadata) {
        if (this.config.metadata.hasOwnProperty(metaKey)) {
          var metaPattern = new RegExp('\\{\\{' + metaKey + '\\}\\}', 'g');
          result = result.replace(metaPattern, this.config.metadata[metaKey]);
        }
      }
    }

    // Replace remaining variables with empty string
    result = result.replace(/\{\{[^}]+\}\}/g, '');

    return result;
  };

  /**
   * Get default template
   * @param {string} content - Content to wrap
   * @returns {string} Default HTML template
   */
  HTMLRenderer.prototype._getDefaultTemplate = function(content) {
    return '<!DOCTYPE html>\n' +
      '<html lang="en">\n' +
      '<head>\n' +
      '    <meta charset="UTF-8">\n' +
      '    <meta name="viewport" content="width=device-width, initial-scale=1.0">\n' +
      '    <title>' + (this.config.metadata && this.config.metadata.title || 'Document') + '</title>\n' +
      '    <style>\n' +
      this._getDefaultStyles() +
      '    </style>\n' +
      '</head>\n' +
      '<body>\n' +
      '    {{header}}\n' +
      '    <main class="content">\n' +
      content +
      '    </main>\n' +
      '    {{footer}}\n' +
      '</body>\n' +
      '</html>';
  };

  /**
   * Get default CSS styles
   * @returns {string} Default CSS
   */
  HTMLRenderer.prototype._getDefaultStyles = function() {
    return '        body {\n' +
      '            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;\n' +
      '            line-height: 1.6;\n' +
      '            color: #333;\n' +
      '            max-width: 800px;\n' +
      '            margin: 0 auto;\n' +
      '            padding: 20px;\n' +
      '        }\n' +
      '        h1, h2, h3, h4, h5, h6 {\n' +
      '            margin-top: 24px;\n' +
      '            margin-bottom: 16px;\n' +
      '            font-weight: 600;\n' +
      '            line-height: 1.25;\n' +
      '        }\n' +
      '        code {\n' +
      '            background: #f6f8fa;\n' +
      '            padding: 2px 6px;\n' +
      '            border-radius: 3px;\n' +
      '            font-family: monospace;\n' +
      '        }\n' +
      '        pre {\n' +
      '            background: #f6f8fa;\n' +
      '            padding: 16px;\n' +
      '            border-radius: 6px;\n' +
      '            overflow-x: auto;\n' +
      '        }\n' +
      '        table {\n' +
      '            border-collapse: collapse;\n' +
      '            width: 100%;\n' +
      '            margin: 16px 0;\n' +
      '        }\n' +
      '        th, td {\n' +
      '            border: 1px solid #ddd;\n' +
      '            padding: 8px 12px;\n' +
      '            text-align: left;\n' +
      '        }\n' +
      '        th {\n' +
      '            background: #f6f8fa;\n' +
      '            font-weight: 600;\n' +
      '        }\n';
  };

  /**
   * Generate complete HTML document
   * @param {string} content - Content HTML
   * @param {string} cssPath - Path to CSS file
   * @returns {string} Complete HTML document
   */
  HTMLRenderer.prototype.generateDocument = function(content, cssPath) {
    var html = this.render(content);

    // If custom CSS path provided, inject it
    if (cssPath) {
      var cssLink = '<link rel="stylesheet" href="' + cssPath + '">';
      html = html.replace('</head>', cssLink + '\n</head>');
    }

    return html;
  };

  /**
   * Inject CSS into HTML
   * @param {string} html - HTML content
   * @param {string} css - CSS content
   * @returns {string} HTML with injected CSS
   */
  HTMLRenderer.prototype.injectCSS = function(html, css) {
    var styleTag = '<style>\n' + css + '\n</style>';
    return html.replace('</head>', styleTag + '\n</head>');
  };

  /**
   * Inject JavaScript into HTML
   * @param {string} html - HTML content
   * @param {string} js - JavaScript content
   * @returns {string} HTML with injected JavaScript
   */
  HTMLRenderer.prototype.injectJS = function(html, js) {
    var scriptTag = '<script>\n' + js + '\n</script>';
    return html.replace('</body>', scriptTag + '\n</body>');
  };

  // Export for different environments
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = HTMLRenderer;
  } else {
    global.HTMLRenderer = HTMLRenderer;
  }

})(typeof window !== 'undefined' ? window : global);
