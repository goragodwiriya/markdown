/**
 * PDFGenerator.js
 * Orchestrates PDF generation from HTML
 * Handles browser-based and Node.js PDF rendering
 */

(function(global) {
  'use strict';

  /**
   * PDF Generator Class
   * Main orchestrator for PDF generation process
   */
  function PDFGenerator(config) {
    this.config = config || {};
    this.renderer = null;
    this.parser = null;
  }

  /**
   * Set HTML renderer
   * @param {HTMLRenderer} renderer - HTML renderer instance
   */
  PDFGenerator.prototype.setRenderer = function(renderer) {
    this.renderer = renderer;
  };

  /**
   * Set Markdown parser
   * @param {MarkdownParser} parser - Markdown parser instance
   */
  PDFGenerator.prototype.setParser = function(parser) {
    this.parser = parser;
  };

  /**
   * Generate PDF from Markdown
   * @param {string} markdown - Markdown content
   * @param {Function} callback - Callback function(error, result)
   */
  PDFGenerator.prototype.generateFromMarkdown = function(markdown, callback) {
    try {
      // Parse Markdown to HTML
      var html = this.parser.parse(markdown);

      // Render complete HTML document
      var document = this.renderer.render(html);

      // Generate PDF
      this._generatePDF(document, callback);
    } catch (error) {
      callback(error, null);
    }
  };

  /**
   * Generate PDF from HTML
   * @param {string} html - HTML content
   * @param {Function} callback - Callback function(error, result)
   */
  PDFGenerator.prototype.generateFromHTML = function(html, callback) {
    try {
      this._generatePDF(html, callback);
    } catch (error) {
      callback(error, null);
    }
  };

  /**
   * Internal PDF generation
   * @param {string} html - Complete HTML document
   * @param {Function} callback - Callback function
   */
  PDFGenerator.prototype._generatePDF = function(html, callback) {
    // Check environment
    if (typeof window !== 'undefined') {
      this._generateBrowserPDF(html, callback);
    } else if (typeof process !== 'undefined' && process.versions && process.versions.node) {
      this._generateNodePDF(html, callback);
    } else {
      callback(new Error('Unsupported environment for PDF generation'), null);
    }
  };

  /**
   * Generate PDF in browser environment
   * @param {string} html - HTML content
   * @param {Function} callback - Callback function
   */
  PDFGenerator.prototype._generateBrowserPDF = function(html, callback) {
    // Create iframe for rendering
    var iframe = document.createElement('iframe');
    iframe.style.position = 'absolute';
    iframe.style.left = '-9999px';
    iframe.style.width = this._getPageWidth();
    iframe.style.height = this._getPageHeight();

    document.body.appendChild(iframe);

    var self = this;

    iframe.onload = function() {
      try {
        // Write HTML to iframe
        var doc = iframe.contentDocument || iframe.contentWindow.document;
        doc.open();
        doc.write(html);
        doc.close();

        // Wait for resources to load
        setTimeout(function() {
          // Use browser print API
          iframe.contentWindow.print();

          // Clean up
          document.body.removeChild(iframe);

          callback(null, {
            success: true,
            message: 'PDF print dialog opened'
          });
        }, 1000);
      } catch (error) {
        document.body.removeChild(iframe);
        callback(error, null);
      }
    };

    // Trigger load
    iframe.src = 'about:blank';
  };

  /**
   * Generate PDF in Node.js environment
   * @param {string} html - HTML content
   * @param {Function} callback - Callback function
   */
  PDFGenerator.prototype._generateNodePDF = function(html, callback) {
    // This method provides the interface for Node.js PDF generation
    // Actual implementation requires puppeteer or similar library
    // which should be loaded separately to avoid dependencies

    var result = {
      html: html,
      config: this.config,
      instructions: 'Use puppeteer or similar library to convert HTML to PDF'
    };

    callback(null, result);
  };

  /**
   * Get page width based on configuration
   * @returns {string} Page width
   */
  PDFGenerator.prototype._getPageWidth = function() {
    var sizes = {
      'A4': '210mm',
      'A3': '297mm',
      'A5': '148mm',
      'Letter': '8.5in',
      'Legal': '8.5in'
    };

    return sizes[this.config.pageSize] || sizes['A4'];
  };

  /**
   * Get page height based on configuration
   * @returns {string} Page height
   */
  PDFGenerator.prototype._getPageHeight = function() {
    var sizes = {
      'A4': '297mm',
      'A3': '420mm',
      'A5': '210mm',
      'Letter': '11in',
      'Legal': '14in'
    };

    return sizes[this.config.pageSize] || sizes['A4'];
  };

  /**
   * Generate print CSS
   * @returns {string} Print-specific CSS
   */
  PDFGenerator.prototype.generatePrintCSS = function() {
    var css = '@page {\n';
    css += '    size: ' + this.config.pageSize + ';\n';
    css += '    margin: ' + this.config.margins.top + ' ';
    css += this.config.margins.right + ' ';
    css += this.config.margins.bottom + ' ';
    css += this.config.margins.left + ';\n';
    css += '}\n\n';

    css += '@media print {\n';
    css += '    body {\n';
    css += '        margin: 0;\n';
    css += '        padding: 0;\n';
    css += '    }\n';
    css += '    .page-break {\n';
    css += '        page-break-after: always;\n';
    css += '    }\n';
    css += '    .no-break {\n';
    css += '        page-break-inside: avoid;\n';
    css += '    }\n';
    css += '    .pdf-header {\n';
    css += '        position: running(header);\n';
    css += '    }\n';
    css += '    .pdf-footer {\n';
    css += '        position: running(footer);\n';
    css += '    }\n';
    css += '}\n';

    return css;
  };

  /**
   * Save HTML to file (Node.js only)
   * @param {string} html - HTML content
   * @param {string} filepath - Output file path
   * @param {Function} callback - Callback function
   */
  PDFGenerator.prototype.saveHTML = function(html, filepath, callback) {
    if (typeof require === 'undefined') {
      callback(new Error('File system operations only available in Node.js'), null);
      return;
    }

    try {
      var fs = require('fs');
      fs.writeFile(filepath, html, 'utf8', function(error) {
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
   * Batch process multiple Markdown files
   * @param {Array} files - Array of {markdown, output} objects
   * @param {Function} callback - Callback function
   */
  PDFGenerator.prototype.batchProcess = function(files, callback) {
    var results = [];
    var errors = [];
    var completed = 0;
    var self = this;

    if (!files || files.length === 0) {
      callback(null, []);
      return;
    }

    files.forEach(function(file, index) {
      self.generateFromMarkdown(file.markdown, function(error, result) {
        completed++;

        if (error) {
          errors.push({index: index, error: error});
        } else {
          results.push({index: index, result: result});
        }

        if (completed === files.length) {
          callback(errors.length > 0 ? errors : null, results);
        }
      });
    });
  };

  /**
   * Get PDF metadata
   * @returns {Object} PDF metadata
   */
  PDFGenerator.prototype.getMetadata = function() {
    return {
      title: this.config.metadata && this.config.metadata.title || '',
      author: this.config.metadata && this.config.metadata.author || '',
      subject: this.config.metadata && this.config.metadata.subject || '',
      keywords: this.config.metadata && this.config.metadata.keywords || [],
      creator: 'Markdown to PDF Generator',
      producer: 'HTML/CSS Rendering Engine'
    };
  };

  // Export for different environments
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = PDFGenerator;
  } else {
    global.PDFGenerator = PDFGenerator;
  }

})(typeof window !== 'undefined' ? window : global);
