/**
 * SyntaxHighlighter.js
 * Plugin for syntax highlighting in code blocks
 * Lightweight implementation without external dependencies
 */

(function(global) {
  'use strict';

  /**
   * Syntax Highlighter Plugin
   * Adds syntax highlighting to code blocks
   */
  function SyntaxHighlighter(config) {
    this.config = config || {};
    this.name = 'SyntaxHighlighter';
    this.stage = 'postprocess';
    this._initializePatterns();
  }

  /**
   * Initialize syntax patterns for different languages
   */
  SyntaxHighlighter.prototype._initializePatterns = function() {
    this.patterns = {
      javascript: [
        {pattern: /\b(function|const|let|var|return|if|else|for|while|class|extends|import|export|async|await)\b/g, className: 'keyword'},
        {pattern: /\b(true|false|null|undefined)\b/g, className: 'boolean'},
        {pattern: /\b\d+\b/g, className: 'number'},
        {pattern: /"([^"\\]|\\.)*"|'([^'\\]|\\.)*'/g, className: 'string'},
        {pattern: /\/\/.*/g, className: 'comment'},
        {pattern: /\/\*[\s\S]*?\*\//g, className: 'comment'}
      ],
      python: [
        {pattern: /\b(def|class|if|elif|else|for|while|return|import|from|as|try|except|finally|with|lambda|yield)\b/g, className: 'keyword'},
        {pattern: /\b(True|False|None)\b/g, className: 'boolean'},
        {pattern: /\b\d+\b/g, className: 'number'},
        {pattern: /"([^"\\]|\\.)*"|'([^'\\]|\\.)*'/g, className: 'string'},
        {pattern: /#.*/g, className: 'comment'}
      ],
      css: [
        {pattern: /\b(color|background|margin|padding|border|width|height|display|position|font|text)\b/g, className: 'property'},
        {pattern: /#[0-9a-fA-F]{3,6}\b/g, className: 'color'},
        {pattern: /\b\d+px|\d+em|\d+%/g, className: 'number'},
        {pattern: /\/\*[\s\S]*?\*\//g, className: 'comment'}
      ],
      html: [
        {pattern: /&lt;[^&]*&gt;/g, className: 'tag'},
        {pattern: /\b(class|id|src|href|alt|title)=/g, className: 'attribute'},
        {pattern: /"([^"\\]|\\.)*"/g, className: 'string'}
      ]
    };
  };

  /**
   * Process HTML content
   * @param {string} html - HTML content
   * @param {Object} config - Configuration
   * @returns {string} Processed HTML
   */
  SyntaxHighlighter.prototype.process = function(html, config) {
    if (!config.syntaxHighlighting) {
      return html;
    }

    var self = this;

    // Find all code blocks
    return html.replace(/<code class="language-(\w+)">([\s\S]*?)<\/code>/g, function(match, language, code) {
      return self._highlightCode(code, language);
    });
  };

  /**
   * Highlight code based on language
   * @param {string} code - Code content
   * @param {string} language - Programming language
   * @returns {string} Highlighted HTML
   */
  SyntaxHighlighter.prototype._highlightCode = function(code, language) {
    var patterns = this.patterns[language.toLowerCase()];

    if (!patterns) {
      return '<code class="language-' + language + '">' + code + '</code>';
    }

    var highlighted = code;

    // Apply patterns in order
    for (var i = 0; i < patterns.length; i++) {
      var pattern = patterns[i];
      highlighted = this._applyPattern(highlighted, pattern);
    }

    return '<code class="language-' + language + ' highlighted">' + highlighted + '</code>';
  };

  /**
   * Apply syntax pattern
   * @param {string} code - Code content
   * @param {Object} pattern - Pattern object
   * @returns {string} Highlighted code
   */
  SyntaxHighlighter.prototype._applyPattern = function(code, pattern) {
    return code.replace(pattern.pattern, function(match) {
      return '<span class="' + pattern.className + '">' + match + '</span>';
    });
  };

  /**
   * Get CSS for syntax highlighting
   * @returns {string} CSS styles
   */
  SyntaxHighlighter.prototype.getCSS = function() {
    return '.highlighted .keyword { color: #d73a49; font-weight: bold; }\n' +
      '.highlighted .boolean { color: #005cc5; }\n' +
      '.highlighted .number { color: #005cc5; }\n' +
      '.highlighted .string { color: #032f62; }\n' +
      '.highlighted .comment { color: #6a737d; font-style: italic; }\n' +
      '.highlighted .property { color: #6f42c1; }\n' +
      '.highlighted .color { color: #e36209; }\n' +
      '.highlighted .tag { color: #22863a; }\n' +
      '.highlighted .attribute { color: #6f42c1; }\n';
  };

  /**
   * Add language support
   * @param {string} language - Language name
   * @param {Array} patterns - Array of pattern objects
   */
  SyntaxHighlighter.prototype.addLanguage = function(language, patterns) {
    this.patterns[language.toLowerCase()] = patterns;
  };

  // Export for different environments
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = SyntaxHighlighter;
  } else {
    global.SyntaxHighlighter = SyntaxHighlighter;
  }

})(typeof window !== 'undefined' ? window : global);
