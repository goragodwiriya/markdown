/**
 * index.js
 * Main entry point for Markdown to PDF Generator
 * Orchestrates all components and provides public API
 */

(function(global) {
  'use strict';

  // Import dependencies (for Node.js)
  var ConfigManager, MarkdownParser, HTMLRenderer, PDFGenerator, Sanitizer, Logger;
  var SyntaxHighlighter, TOCGenerator, ImageProcessor;

  if (typeof module !== 'undefined' && module.exports) {
    ConfigManager = require('./core/ConfigManager.js');
    MarkdownParser = require('./core/MarkdownParser.js');
    HTMLRenderer = require('./core/HTMLRenderer.js');
    PDFGenerator = require('./core/PDFGenerator.js');
    Sanitizer = require('./utils/Sanitizer.js');
    Logger = require('./utils/Logger.js');
    SyntaxHighlighter = require('./plugins/SyntaxHighlighter.js');
    TOCGenerator = require('./plugins/TOCGenerator.js');
    ImageProcessor = require('./plugins/ImageProcessor.js');
  } else {
    // Browser environment - assume scripts are loaded
    ConfigManager = global.ConfigManager;
    MarkdownParser = global.MarkdownParser;
    HTMLRenderer = global.HTMLRenderer;
    PDFGenerator = global.PDFGenerator;
    Sanitizer = global.Sanitizer;
    Logger = global.Logger;
    SyntaxHighlighter = global.SyntaxHighlighter;
    TOCGenerator = global.TOCGenerator;
    ImageProcessor = global.ImageProcessor;
  }

  /**
   * Main MarkdownToPDF Class
   * Public API for the library
   */
  function MarkdownToPDF(userConfig) {
    // Initialize configuration
    this.configManager = new ConfigManager(userConfig);
    this.config = this.configManager.getAll();

    // Initialize logger
    this.logger = new Logger({level: 'info'});
    this.logger.info('MarkdownToPDF initialized');

    // Initialize core components
    this.parser = new MarkdownParser(this.config);
    this.renderer = new HTMLRenderer(this.config);
    this.generator = new PDFGenerator(this.config);
    this.sanitizer = new Sanitizer({level: this.config.security.sanitizationLevel});

    // Set up generator dependencies
    this.generator.setParser(this.parser);
    this.generator.setRenderer(this.renderer);

    // Initialize and register plugins
    this._initializePlugins();
  }

  /**
   * Initialize plugins
   */
  MarkdownToPDF.prototype._initializePlugins = function() {
    // Syntax highlighter
    if (this.config.syntaxHighlighting) {
      this.syntaxHighlighter = new SyntaxHighlighter(this.config);
      this.parser.registerPlugin(this.syntaxHighlighter);
      this.logger.info('SyntaxHighlighter plugin registered');
    }

    // TOC generator
    if (this.config.enableTOC) {
      this.tocGenerator = new TOCGenerator(this.config);
      this.parser.registerPlugin(this.tocGenerator);
      this.logger.info('TOCGenerator plugin registered');
    }

    // Image processor
    this.imageProcessor = new ImageProcessor(this.config);
    this.parser.registerPlugin(this.imageProcessor);
    this.logger.info('ImageProcessor plugin registered');
  };

  /**
   * Convert Markdown string to PDF
   * @param {string} markdown - Markdown content
   * @param {Function} callback - Callback function(error, result)
   */
  MarkdownToPDF.prototype.convert = function(markdown, callback) {
    var self = this;

    try {
      this.logger.info('Starting conversion');

      // Parse Markdown to HTML
      var html = this.parser.parse(markdown);
      this.logger.debug('Markdown parsed to HTML');

      // Sanitize HTML if enabled
      if (this.config.sanitizeHTML) {
        html = this.sanitizer.sanitize(html);
        this.logger.debug('HTML sanitized');
      }

      // Render complete document
      var document = this.renderer.render(html);
      this.logger.debug('HTML document rendered');

      // Inject CSS
      var css = this._generateCSS();
      document = this.renderer.injectCSS(document, css);
      this.logger.debug('CSS injected');

      // Generate PDF
      this.generator.generateFromHTML(document, function(error, result) {
        if (error) {
          self.logger.error('PDF generation failed', error);
          callback(error, null);
        } else {
          self.logger.info('PDF generation completed');
          callback(null, result);
        }
      });
    } catch (error) {
      this.logger.error('Conversion failed', error);
      callback(error, null);
    }
  };

  /**
   * Convert Markdown file to PDF (Node.js only)
   * @param {string} inputPath - Input Markdown file path
   * @param {string} outputPath - Output PDF file path
   * @param {Function} callback - Callback function(error, result)
   */
  MarkdownToPDF.prototype.convertFile = function(inputPath, outputPath, callback) {
    if (typeof require === 'undefined') {
      var error = this.logger.createError('File operations only available in Node.js', 'ENV_ERROR');
      callback(error, null);
      return;
    }

    var self = this;
    var fs = require('fs');

    // Read input file
    fs.readFile(inputPath, 'utf8', function(error, markdown) {
      if (error) {
        self.logger.error('Failed to read input file', error);
        callback(error, null);
        return;
      }

      self.logger.info('Input file read: ' + inputPath);

      // Convert to HTML
      self.convert(markdown, function(error, result) {
        if (error) {
          callback(error, null);
          return;
        }

        // For Node.js, result contains HTML and instructions
        // Save HTML for manual PDF conversion
        var htmlPath = outputPath.replace(/\.pdf$/, '.html');

        self.generator.saveHTML(result.html, htmlPath, function(error, saveResult) {
          if (error) {
            self.logger.error('Failed to save HTML', error);
            callback(error, null);
          } else {
            self.logger.info('HTML saved: ' + htmlPath);
            callback(null, {
              success: true,
              htmlPath: htmlPath,
              message: 'HTML generated. Use puppeteer or similar to convert to PDF.'
            });
          }
        });
      });
    });
  };

  /**
   * Generate combined CSS
   * @returns {string} Complete CSS
   */
  MarkdownToPDF.prototype._generateCSS = function() {
    var css = this.generator.generatePrintCSS();

    // Add plugin CSS
    if (this.syntaxHighlighter) {
      css += '\n' + this.syntaxHighlighter.getCSS();
    }

    if (this.tocGenerator) {
      css += '\n' + this.tocGenerator.getCSS();
    }

    if (this.imageProcessor) {
      css += '\n' + this.imageProcessor.getCSS();
    }

    return css;
  };

  /**
   * Register custom plugin
   * @param {Object} plugin - Plugin object with process method
   */
  MarkdownToPDF.prototype.registerPlugin = function(plugin) {
    this.parser.registerPlugin(plugin);
    this.logger.info('Custom plugin registered: ' + (plugin.name || 'unnamed'));
  };

  /**
   * Set template
   * @param {string} templateContent - HTML template content
   */
  MarkdownToPDF.prototype.setTemplate = function(templateContent) {
    this.renderer.loadTemplate(templateContent);
    this.logger.info('Custom template loaded');
  };

  /**
   * Load template from file (Node.js only)
   * @param {string} filepath - Template file path
   * @param {Function} callback - Callback function(error)
   */
  MarkdownToPDF.prototype.loadTemplate = function(filepath, callback) {
    if (typeof require === 'undefined') {
      var error = this.logger.createError('File operations only available in Node.js', 'ENV_ERROR');
      callback(error);
      return;
    }

    var self = this;
    var fs = require('fs');

    fs.readFile(filepath, 'utf8', function(error, content) {
      if (error) {
        self.logger.error('Failed to load template', error);
        callback(error);
      } else {
        self.setTemplate(content);
        callback(null);
      }
    });
  };

  /**
   * Set template variables
   * @param {Object} variables - Key-value pairs
   */
  MarkdownToPDF.prototype.setVariables = function(variables) {
    this.renderer.setVariables(variables);
    this.logger.debug('Template variables set');
  };

  /**
   * Get configuration
   * @param {string} path - Configuration path (optional)
   * @returns {*} Configuration value
   */
  MarkdownToPDF.prototype.getConfig = function(path) {
    if (path) {
      return this.configManager.get(path);
    }
    return this.configManager.getAll();
  };

  /**
   * Update configuration
   * @param {string} path - Configuration path
   * @param {*} value - New value
   */
  MarkdownToPDF.prototype.setConfig = function(path, value) {
    this.configManager.set(path, value);
    this.config = this.configManager.getAll();
    this.logger.debug('Configuration updated: ' + path);
  };

  /**
   * Get logs
   * @returns {Array} Log entries
   */
  MarkdownToPDF.prototype.getLogs = function() {
    return this.logger.getLogs();
  };

  /**
   * Export logs
   * @returns {string} JSON string of logs
   */
  MarkdownToPDF.prototype.exportLogs = function() {
    return this.logger.exportJSON();
  };

  /**
   * Batch convert multiple files
   * @param {Array} files - Array of {input, output} objects
   * @param {Function} callback - Callback function(error, results)
   */
  MarkdownToPDF.prototype.batchConvert = function(files, callback) {
    var self = this;
    var results = [];
    var errors = [];
    var completed = 0;

    if (!files || files.length === 0) {
      callback(null, []);
      return;
    }

    this.logger.info('Starting batch conversion: ' + files.length + ' files');

    files.forEach(function(file, index) {
      self.convertFile(file.input, file.output, function(error, result) {
        completed++;

        if (error) {
          errors.push({index: index, file: file.input, error: error});
        } else {
          results.push({index: index, file: file.input, result: result});
        }

        if (completed === files.length) {
          self.logger.info('Batch conversion completed');
          callback(errors.length > 0 ? errors : null, results);
        }
      });
    });
  };

  /**
   * Get version
   * @returns {string} Version string
   */
  MarkdownToPDF.prototype.getVersion = function() {
    return '1.0.0';
  };

  // Export for different environments
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = MarkdownToPDF;
  } else {
    global.MarkdownToPDF = MarkdownToPDF;
  }

})(typeof window !== 'undefined' ? window : global);
