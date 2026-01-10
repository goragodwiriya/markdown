/**
 * MermaidRenderer.js
 * Plugin for rendering Mermaid diagrams
 * Supports flowcharts, ER diagrams, sequence diagrams, and more
 */

(function(global) {
  'use strict';

  /**
   * Mermaid Renderer Plugin
   * Converts Mermaid code blocks to rendered diagrams
   */
  function MermaidRenderer(config) {
    this.config = config || {};
    this.name = 'MermaidRenderer';
    this.stage = 'preprocess';
    this.theme = this.config.mermaidTheme || 'default';
    this.initialized = false;
  }

  /**
   * Initialize Mermaid library
   */
  MermaidRenderer.prototype.initialize = function() {
    if (typeof mermaid === 'undefined') {
      console.warn('Mermaid library not loaded');
      return false;
    }

    try {
      mermaid.initialize({
        startOnLoad: false,
        theme: this.theme,
        securityLevel: 'loose',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        flowchart: {
          useMaxWidth: true,
          htmlLabels: true,
          curve: 'basis'
        },
        sequence: {
          useMaxWidth: true,
          diagramMarginX: 50,
          diagramMarginY: 10
        },
        gantt: {
          useMaxWidth: true,
          fontSize: 11
        }
      });
      this.initialized = true;
      return true;
    } catch (error) {
      console.error('Failed to initialize Mermaid:', error);
      return false;
    }
  };

  /**
   * Process Markdown content
   * @param {string} markdown - Markdown content
   * @param {Object} config - Configuration
   * @returns {string} Processed markdown
   */
  MermaidRenderer.prototype.process = function(markdown, config) {
    if (!config.enableMermaid) {
      return markdown;
    }

    // Initialize if not already done
    if (!this.initialized) {
      this.initialize();
    }

    // Replace ```mermaid blocks with HTML containers
    return markdown.replace(/```mermaid\n([\s\S]*?)```/g, function(match, code) {
      var id = 'mermaid-' + Math.random().toString(36).substr(2, 9);
      return '\n<div class="mermaid-container"><div class="mermaid" id="' + id + '">\n' +
        code.trim() + '\n</div></div>\n';
    });
  };

  /**
   * Render all Mermaid diagrams in the document
   * @param {HTMLElement} container - Container element
   * @param {Function} callback - Callback function
   */
  MermaidRenderer.prototype.renderDiagrams = function(container, callback) {
    if (!this.initialized) {
      if (callback) callback(new Error('Mermaid not initialized'));
      return;
    }

    var mermaidElements = container.querySelectorAll('.mermaid');
    var total = mermaidElements.length;
    var completed = 0;
    var errors = [];

    if (total === 0) {
      if (callback) callback(null, []);
      return;
    }

    // Render each diagram
    for (var i = 0; i < mermaidElements.length; i++) {
      this._renderSingleDiagram(mermaidElements[i], i, function(error) {
        completed++;
        if (error) {
          errors.push(error);
        }

        if (completed === total) {
          if (callback) {
            callback(errors.length > 0 ? errors : null, completed);
          }
        }
      });
    }
  };

  /**
   * Render a single Mermaid diagram
   * @param {HTMLElement} element - Mermaid element
   * @param {number} index - Element index
   * @param {Function} callback - Callback function
   */
  MermaidRenderer.prototype._renderSingleDiagram = function(element, index, callback) {
    try {
      var code = element.textContent.trim();
      var id = element.id || 'mermaid-' + index;
      element.id = id;

      // Use mermaid.render for async rendering
      if (mermaid.render) {
        mermaid.render('mermaid-svg-' + index, code)
          .then(function(result) {
            element.innerHTML = result.svg;
            if (callback) callback(null);
          })
          .catch(function(error) {
            console.error('Mermaid render error:', error);
            element.innerHTML = '<div class="mermaid-error">⚠️ Error: ' +
              error.message + '</div>';
            if (callback) callback(error);
          });
      } else {
        // Fallback for older versions
        element.removeAttribute('data-processed');
        mermaid.init(undefined, element);
        if (callback) callback(null);
      }
    } catch (error) {
      console.error('Mermaid error:', error);
      element.innerHTML = '<div class="mermaid-error">⚠️ Error: ' + error.message + '</div>';
      if (callback) callback(error);
    }
  };

  /**
   * Get CSS for Mermaid styling
   * @returns {string} CSS styles
   */
  MermaidRenderer.prototype.getCSS = function() {
    return '.mermaid-container {\n' +
      '    margin: 32px 0;\n' +
      '    padding: 24px;\n' +
      '    background: #f9fafb;\n' +
      '    border-radius: 8px;\n' +
      '    border: 1px solid #e5e7eb;\n' +
      '    overflow-x: auto;\n' +
      '}\n' +
      '.mermaid {\n' +
      '    display: flex;\n' +
      '    justify-content: center;\n' +
      '    align-items: center;\n' +
      '    min-height: 100px;\n' +
      '}\n' +
      '.mermaid svg {\n' +
      '    max-width: 100%;\n' +
      '    height: auto;\n' +
      '}\n' +
      '.mermaid-error {\n' +
      '    color: #dc2626;\n' +
      '    background: #fee2e2;\n' +
      '    padding: 16px;\n' +
      '    border-radius: 6px;\n' +
      '    border: 1px solid #fecaca;\n' +
      '    font-family: monospace;\n' +
      '}\n';
  };

  /**
   * Set Mermaid theme
   * @param {string} theme - Theme name
   */
  MermaidRenderer.prototype.setTheme = function(theme) {
    this.theme = theme;
    this.initialized = false;
    this.initialize();
  };

  /**
   * Get supported diagram types
   * @returns {Array} Array of supported diagram types
   */
  MermaidRenderer.prototype.getSupportedTypes = function() {
    return [
      'flowchart',
      'sequenceDiagram',
      'classDiagram',
      'stateDiagram',
      'erDiagram',
      'gantt',
      'pie',
      'gitGraph',
      'journey',
      'mindmap',
      'timeline',
      'quadrantChart'
    ];
  };

  /**
   * Validate Mermaid code
   * @param {string} code - Mermaid code
   * @returns {Object} Validation result
   */
  MermaidRenderer.prototype.validate = function(code) {
    try {
      // Basic validation
      if (!code || typeof code !== 'string') {
        return {valid: false, error: 'Invalid code'};
      }

      var trimmed = code.trim();
      if (trimmed.length === 0) {
        return {valid: false, error: 'Empty code'};
      }

      // Check for diagram type
      var types = this.getSupportedTypes();
      var hasValidType = false;

      for (var i = 0; i < types.length; i++) {
        if (trimmed.indexOf(types[i]) !== -1) {
          hasValidType = true;
          break;
        }
      }

      if (!hasValidType) {
        return {valid: false, error: 'Unknown diagram type'};
      }

      return {valid: true};
    } catch (error) {
      return {valid: false, error: error.message};
    }
  };

  /**
   * Get diagram statistics
   * @param {HTMLElement} container - Container element
   * @returns {Object} Statistics
   */
  MermaidRenderer.prototype.getStats = function(container) {
    var mermaidElements = container.querySelectorAll('.mermaid');
    var errorElements = container.querySelectorAll('.mermaid-error');

    return {
      total: mermaidElements.length,
      rendered: mermaidElements.length - errorElements.length,
      errors: errorElements.length
    };
  };

  // Export for different environments
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = MermaidRenderer;
  } else {
    global.MermaidRenderer = MermaidRenderer;
  }

})(typeof window !== 'undefined' ? window : global);
