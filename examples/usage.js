/**
 * Usage Examples for Markdown to PDF Generator
 * Demonstrates various ways to use the library
 */

// For Node.js environment
const MarkdownToPDF = require('../src/index.js');
const fs = require('fs');

// ============================================
// Example 1: Basic Usage
// ============================================
function basicExample() {
  console.log('=== Example 1: Basic Usage ===\n');

  const generator = new MarkdownToPDF({
    pageSize: 'A4',
    theme: 'default'
  });

  const markdown = '# Hello World\n\nThis is a **simple** example.';

  generator.convert(markdown, function(error, result) {
    if (error) {
      console.error('Error:', error);
    } else {
      console.log('Success:', result);
    }
  });
}

// ============================================
// Example 2: File Conversion
// ============================================
function fileConversionExample() {
  console.log('\n=== Example 2: File Conversion ===\n');

  const generator = new MarkdownToPDF({
    pageSize: 'A4',
    enableTOC: true,
    syntaxHighlighting: true
  });

  generator.convertFile(
    'examples/sample.md',
    'dist/output.pdf',
    function(error, result) {
      if (error) {
        console.error('Error:', error);
      } else {
        console.log('Success:', result);
      }
    }
  );
}

// ============================================
// Example 3: Custom Configuration
// ============================================
function customConfigExample() {
  console.log('\n=== Example 3: Custom Configuration ===\n');

  // Load configuration from file
  const configJSON = fs.readFileSync('examples/config.json', 'utf8');
  const config = JSON.parse(configJSON);

  const generator = new MarkdownToPDF(config);

  // Set custom variables
  generator.setVariables({
    title: 'My Custom Document',
    author: 'Jane Smith',
    date: new Date().toLocaleDateString()
  });

  const markdown = fs.readFileSync('examples/sample.md', 'utf8');

  generator.convert(markdown, function(error, result) {
    if (error) {
      console.error('Error:', error);
    } else {
      console.log('Success:', result);
    }
  });
}

// ============================================
// Example 4: Custom Template
// ============================================
function customTemplateExample() {
  console.log('\n=== Example 4: Custom Template ===\n');

  const generator = new MarkdownToPDF();

  // Load custom template
  generator.loadTemplate('templates/default.html', function(error) {
    if (error) {
      console.error('Error loading template:', error);
      return;
    }

    const markdown = '# Custom Template\n\nUsing a custom HTML template.';

    generator.convert(markdown, function(error, result) {
      if (error) {
        console.error('Error:', error);
      } else {
        console.log('Success:', result);
      }
    });
  });
}

// ============================================
// Example 5: Custom Plugin
// ============================================
function customPluginExample() {
  console.log('\n=== Example 5: Custom Plugin ===\n');

  const generator = new MarkdownToPDF();

  // Create custom plugin
  const customPlugin = {
    name: 'WordCounter',
    stage: 'postprocess',
    process: function(html, config) {
      // Count words in HTML
      const text = html.replace(/<[^>]*>/g, '');
      const wordCount = text.split(/\s+/).length;

      // Add word count at the end
      const counter = '<div class="word-count">Word count: ' + wordCount + '</div>';
      return html + counter;
    }
  };

  // Register plugin
  generator.registerPlugin(customPlugin);

  const markdown = '# Plugin Example\n\nThis document will have a word count.';

  generator.convert(markdown, function(error, result) {
    if (error) {
      console.error('Error:', error);
    } else {
      console.log('Success:', result);
    }
  });
}

// ============================================
// Example 6: Batch Processing
// ============================================
function batchProcessingExample() {
  console.log('\n=== Example 6: Batch Processing ===\n');

  const generator = new MarkdownToPDF({
    pageSize: 'A4',
    enableTOC: true
  });

  const files = [
    {input: 'examples/sample.md', output: 'dist/sample1.pdf'},
    {input: 'examples/sample.md', output: 'dist/sample2.pdf'},
    {input: 'examples/sample.md', output: 'dist/sample3.pdf'}
  ];

  generator.batchConvert(files, function(errors, results) {
    if (errors) {
      console.error('Errors occurred:', errors);
    }

    if (results) {
      console.log('Completed:', results.length, 'files');
      results.forEach(function(result) {
        console.log('  -', result.file, '✓');
      });
    }
  });
}

// ============================================
// Example 7: Configuration Management
// ============================================
function configManagementExample() {
  console.log('\n=== Example 7: Configuration Management ===\n');

  const generator = new MarkdownToPDF();

  // Get configuration
  console.log('Page size:', generator.getConfig('pageSize'));
  console.log('Margins:', generator.getConfig('margins'));

  // Update configuration
  generator.setConfig('pageSize', 'Letter');
  generator.setConfig('margins.top', '1in');

  console.log('Updated page size:', generator.getConfig('pageSize'));
  console.log('Updated margins:', generator.getConfig('margins'));

  // Get all configuration
  const allConfig = generator.getConfig();
  console.log('All config keys:', Object.keys(allConfig));
}

// ============================================
// Example 8: Logging and Debugging
// ============================================
function loggingExample() {
  console.log('\n=== Example 8: Logging and Debugging ===\n');

  const generator = new MarkdownToPDF();

  const markdown = '# Logging Example\n\nThis will generate logs.';

  generator.convert(markdown, function(error, result) {
    // Get logs
    const logs = generator.getLogs();

    console.log('Total logs:', logs.length);

    logs.forEach(function(log) {
      console.log('[' + log.level.toUpperCase() + ']', log.message);
    });

    // Export logs
    const logsJSON = generator.exportLogs();
    fs.writeFileSync('dist/logs.json', logsJSON);
    console.log('\nLogs exported to dist/logs.json');
  });
}

// ============================================
// Example 9: Image Processing
// ============================================
function imageProcessingExample() {
  console.log('\n=== Example 9: Image Processing ===\n');

  const generator = new MarkdownToPDF({
    security: {
      allowRemoteImages: true,
      allowExternalLinks: true
    }
  });

  const markdown = `# Image Examples

## Local Image
![Local](./images/logo.png)

## Remote Image
![Remote](https://via.placeholder.com/400x200)

## Base64 Image
![Base64](data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==)
`;

  generator.convert(markdown, function(error, result) {
    if (error) {
      console.error('Error:', error);
    } else {
      console.log('Success:', result);
    }
  });
}

// ============================================
// Example 10: Complete Workflow
// ============================================
function completeWorkflowExample() {
  console.log('\n=== Example 10: Complete Workflow ===\n');

  // Step 1: Load configuration
  const config = JSON.parse(fs.readFileSync('examples/config.json', 'utf8'));

  // Step 2: Initialize generator
  const generator = new MarkdownToPDF(config);

  // Step 3: Load template
  generator.loadTemplate('templates/default.html', function(error) {
    if (error) {
      console.error('Template error:', error);
      return;
    }

    // Step 4: Set variables
    generator.setVariables({
      title: 'Complete Workflow Example',
      author: 'System',
      date: new Date().toISOString()
    });

    // Step 5: Read Markdown
    const markdown = fs.readFileSync('examples/sample.md', 'utf8');

    // Step 6: Convert
    generator.convert(markdown, function(error, result) {
      if (error) {
        console.error('Conversion error:', error);
        return;
      }

      console.log('Conversion successful!');
      console.log('Result:', result);

      // Step 7: Export logs
      const logs = generator.exportLogs();
      fs.writeFileSync('dist/workflow-logs.json', logs);
      console.log('Logs saved to dist/workflow-logs.json');
    });
  });
}

// ============================================
// Run Examples
// ============================================

// Uncomment the example you want to run:

// basicExample();
// fileConversionExample();
// customConfigExample();
// customTemplateExample();
// customPluginExample();
// batchProcessingExample();
// configManagementExample();
// loggingExample();
// imageProcessingExample();
// completeWorkflowExample();

// Run all examples
console.log('Markdown to PDF Generator - Usage Examples\n');
console.log('Uncomment the example you want to run in examples/usage.js\n');
console.log('Available examples:');
console.log('1. basicExample()');
console.log('2. fileConversionExample()');
console.log('3. customConfigExample()');
console.log('4. customTemplateExample()');
console.log('5. customPluginExample()');
console.log('6. batchProcessingExample()');
console.log('7. configManagementExample()');
console.log('8. loggingExample()');
console.log('9. imageProcessingExample()');
console.log('10. completeWorkflowExample()');
