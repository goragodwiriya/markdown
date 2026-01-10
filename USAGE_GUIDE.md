# Usage Guide

## Table of Contents

1. [Installation](#installation)
2. [Quick Start](#quick-start)
3. [Configuration](#configuration)
4. [API Reference](#api-reference)
5. [Examples](#examples)
6. [Plugins](#plugins)
7. [Templates](#templates)
8. [Troubleshooting](#troubleshooting)

## Installation

### Browser Usage

Include the scripts in your HTML:

```html
<!DOCTYPE html>
<html>
<head>
    <script src="src/utils/Logger.js"></script>
    <script src="src/utils/Sanitizer.js"></script>
    <script src="src/core/ConfigManager.js"></script>
    <script src="src/core/MarkdownParser.js"></script>
    <script src="src/core/HTMLRenderer.js"></script>
    <script src="src/core/PDFGenerator.js"></script>
    <script src="src/plugins/SyntaxHighlighter.js"></script>
    <script src="src/plugins/TOCGenerator.js"></script>
    <script src="src/plugins/ImageProcessor.js"></script>
    <script src="src/index.js"></script>
</head>
<body>
    <!-- Your content -->
</body>
</html>
```

### Node.js Usage

```bash
# Clone or download the repository
git clone https://github.com/example/markdown-to-pdf.git
cd markdown-to-pdf

# No npm install needed - pure vanilla JavaScript!
```

## Quick Start

### Basic Conversion

```javascript
// Initialize generator
const generator = new MarkdownToPDF({
    pageSize: 'A4',
    theme: 'default'
});

// Convert Markdown to PDF
const markdown = '# Hello World\n\nThis is **bold** text.';

generator.convert(markdown, function(error, result) {
    if (error) {
        console.error('Error:', error);
    } else {
        console.log('Success:', result);
    }
});
```

### File Conversion (Node.js)

```javascript
const MarkdownToPDF = require('./src/index.js');

const generator = new MarkdownToPDF();

generator.convertFile('input.md', 'output.pdf', function(error, result) {
    if (error) {
        console.error('Error:', error);
    } else {
        console.log('HTML generated:', result.htmlPath);
        console.log('Use puppeteer to convert HTML to PDF');
    }
});
```

## Configuration

### Configuration Options

```javascript
{
    // Page settings
    pageSize: 'A4',              // A4, A3, A5, Letter, Legal
    margins: {
        top: '2cm',
        right: '2cm',
        bottom: '2cm',
        left: '2cm'
    },

    // Styling
    theme: 'default',            // Theme name
    template: 'templates/default.html',

    // Features
    enableTOC: false,            // Table of contents
    syntaxHighlighting: true,    // Code syntax highlighting
    sanitizeHTML: true,          // HTML sanitization

    // Fonts
    fonts: ['fonts/NotoSans/'],

    // Header
    header: {
        enabled: false,
        content: '',
        height: '1cm'
    },

    // Footer
    footer: {
        enabled: true,
        content: 'Page {{page}} of {{totalPages}}',
        height: '1cm'
    },

    // Metadata
    metadata: {
        title: '',
        author: '',
        subject: '',
        keywords: []
    },

    // Security
    security: {
        allowRemoteImages: false,
        allowExternalLinks: true,
        sanitizationLevel: 'strict'
    },

    // Performance
    performance: {
        batchSize: 10,
        timeout: 30000
    }
}
```

### Loading Configuration from File

```javascript
const fs = require('fs');
const configJSON = fs.readFileSync('config.json', 'utf8');
const config = JSON.parse(configJSON);

const generator = new MarkdownToPDF(config);
```

### Updating Configuration

```javascript
// Get configuration value
const pageSize = generator.getConfig('pageSize');

// Set configuration value
generator.setConfig('pageSize', 'Letter');
generator.setConfig('margins.top', '1in');

// Get all configuration
const allConfig = generator.getConfig();
```

## API Reference

### MarkdownToPDF Class

#### Constructor

```javascript
new MarkdownToPDF(config)
```

Creates a new instance with optional configuration.

#### Methods

##### convert(markdown, callback)

Convert Markdown string to PDF.

```javascript
generator.convert(markdown, function(error, result) {
    // Handle result
});
```

##### convertFile(inputPath, outputPath, callback)

Convert Markdown file to PDF (Node.js only).

```javascript
generator.convertFile('input.md', 'output.pdf', function(error, result) {
    // Handle result
});
```

##### setTemplate(templateContent)

Set custom HTML template.

```javascript
const template = '<html>...</html>';
generator.setTemplate(template);
```

##### loadTemplate(filepath, callback)

Load template from file (Node.js only).

```javascript
generator.loadTemplate('template.html', function(error) {
    // Template loaded
});
```

##### setVariables(variables)

Set template variables.

```javascript
generator.setVariables({
    title: 'My Document',
    author: 'John Doe',
    date: '2024-01-01'
});
```

##### registerPlugin(plugin)

Register custom plugin.

```javascript
const plugin = {
    name: 'MyPlugin',
    stage: 'postprocess',
    process: function(html, config) {
        return html;
    }
};

generator.registerPlugin(plugin);
```

##### getConfig(path)

Get configuration value.

```javascript
const pageSize = generator.getConfig('pageSize');
const margins = generator.getConfig('margins');
```

##### setConfig(path, value)

Set configuration value.

```javascript
generator.setConfig('pageSize', 'A4');
generator.setConfig('enableTOC', true);
```

##### getLogs()

Get all log entries.

```javascript
const logs = generator.getLogs();
```

##### exportLogs()

Export logs as JSON string.

```javascript
const logsJSON = generator.exportLogs();
```

##### batchConvert(files, callback)

Convert multiple files.

```javascript
const files = [
    { input: 'file1.md', output: 'file1.pdf' },
    { input: 'file2.md', output: 'file2.pdf' }
];

generator.batchConvert(files, function(errors, results) {
    // Handle results
});
```

##### getVersion()

Get library version.

```javascript
const version = generator.getVersion();
```

## Examples

### Example 1: Simple Document

```javascript
const generator = new MarkdownToPDF();

const markdown = `
# My Document

This is a simple document with **bold** and *italic* text.

## Features

- Easy to use
- Fast conversion
- Professional output
`;

generator.convert(markdown, function(error, result) {
    console.log('Done!');
});
```

### Example 2: Document with Table of Contents

```javascript
const generator = new MarkdownToPDF({
    enableTOC: true
});

const markdown = `
# Introduction

Content here...

## Chapter 1

More content...

## Chapter 2

Even more content...
`;

generator.convert(markdown, function(error, result) {
    console.log('Document with TOC generated!');
});
```

### Example 3: Code Documentation

```javascript
const generator = new MarkdownToPDF({
    syntaxHighlighting: true
});

const markdown = `
# API Documentation

## Example Code

\`\`\`javascript
function hello(name) {
    console.log('Hello, ' + name);
}
\`\`\`

## Usage

Call the function like this:

\`\`\`javascript
hello('World');
\`\`\`
`;

generator.convert(markdown, function(error, result) {
    console.log('Code documentation generated!');
});
```

### Example 4: Custom Header and Footer

```javascript
const generator = new MarkdownToPDF({
    header: {
        enabled: true,
        content: '{{title}} - {{author}}'
    },
    footer: {
        enabled: true,
        content: 'Page {{page}} | {{date}}'
    },
    metadata: {
        title: 'My Report',
        author: 'John Doe'
    }
});

generator.setVariables({
    date: new Date().toLocaleDateString()
});

generator.convert(markdown, function(error, result) {
    console.log('Document with header/footer generated!');
});
```

### Example 5: Batch Processing

```javascript
const generator = new MarkdownToPDF();

const files = [
    { input: 'chapter1.md', output: 'chapter1.pdf' },
    { input: 'chapter2.md', output: 'chapter2.pdf' },
    { input: 'chapter3.md', output: 'chapter3.pdf' }
];

generator.batchConvert(files, function(errors, results) {
    if (errors) {
        console.error('Some files failed:', errors);
    }
    console.log('Completed:', results.length, 'files');
});
```

## Plugins

### Using Built-in Plugins

Plugins are automatically registered based on configuration:

```javascript
const generator = new MarkdownToPDF({
    syntaxHighlighting: true,  // Enables SyntaxHighlighter
    enableTOC: true            // Enables TOCGenerator
});
```

### Creating Custom Plugins

```javascript
const customPlugin = {
    name: 'WordCounter',
    stage: 'postprocess',  // 'preprocess' or 'postprocess'
    process: function(html, config) {
        // Transform HTML
        const wordCount = html.split(/\s+/).length;
        return html + '<div>Words: ' + wordCount + '</div>';
    }
};

generator.registerPlugin(customPlugin);
```

### Plugin Stages

- **preprocess**: Runs before Markdown parsing
- **postprocess**: Runs after HTML generation

### Available Plugins

#### SyntaxHighlighter

Adds syntax highlighting to code blocks.

```javascript
// Automatically enabled with syntaxHighlighting: true
```

#### TOCGenerator

Generates table of contents from headings.

```javascript
// Automatically enabled with enableTOC: true
```

#### ImageProcessor

Processes and validates images.

```javascript
// Always enabled
```

## Templates

### Using Default Template

```javascript
const generator = new MarkdownToPDF({
    template: 'templates/default.html'
});
```

### Creating Custom Template

Create an HTML file with placeholders:

```html
<!DOCTYPE html>
<html>
<head>
    <title>{{title}}</title>
    <style>
        /* Your custom styles */
    </style>
</head>
<body>
    {{header}}
    <main>
        {{content}}
    </main>
    {{footer}}
</body>
</html>
```

Load the template:

```javascript
generator.loadTemplate('my-template.html', function(error) {
    if (!error) {
        // Template loaded successfully
    }
});
```

### Template Variables

Available variables:

- `{{content}}` - Main content (required)
- `{{header}}` - Header content
- `{{footer}}` - Footer content
- `{{title}}` - Document title
- `{{author}}` - Document author
- `{{subject}}` - Document subject
- `{{keywords}}` - Document keywords
- `{{page}}` - Current page number
- `{{totalPages}}` - Total pages
- Custom variables via `setVariables()`

## Troubleshooting

### Common Issues

#### Issue: PDF not generating in browser

**Solution**: The browser environment uses the print dialog. Make sure pop-ups are not blocked.

```javascript
// Browser will open print dialog
generator.convert(markdown, function(error, result) {
    // Print dialog should appear
});
```

#### Issue: Images not showing

**Solution**: Check image paths and security settings.

```javascript
const generator = new MarkdownToPDF({
    security: {
        allowRemoteImages: true  // Enable remote images
    }
});
```

#### Issue: Syntax highlighting not working

**Solution**: Ensure syntax highlighting is enabled and language is specified.

```javascript
const generator = new MarkdownToPDF({
    syntaxHighlighting: true
});

// In Markdown, specify language:
// ```javascript
// code here
// ```
```

#### Issue: Table of contents not appearing

**Solution**: Enable TOC and ensure headings have proper syntax.

```javascript
const generator = new MarkdownToPDF({
    enableTOC: true
});

// Use proper heading syntax:
// # Heading 1
// ## Heading 2
```

#### Issue: Unicode characters not displaying

**Solution**: Ensure proper font support and UTF-8 encoding.

```html
<meta charset="UTF-8">
```

### Debugging

Enable debug logging:

```javascript
const generator = new MarkdownToPDF();

// After conversion, check logs
generator.convert(markdown, function(error, result) {
    const logs = generator.getLogs();
    console.log('Logs:', logs);
});
```

Export logs for analysis:

```javascript
const logsJSON = generator.exportLogs();
fs.writeFileSync('debug.json', logsJSON);
```

### Getting Help

1. Check the logs: `generator.getLogs()`
2. Review configuration: `generator.getConfig()`
3. Validate Markdown syntax
4. Check browser console for errors
5. Review ARCHITECTURE.md for technical details

## Best Practices

### 1. Configuration Management

Store configuration in separate files:

```javascript
const config = require('./config.json');
const generator = new MarkdownToPDF(config);
```

### 2. Error Handling

Always handle errors:

```javascript
generator.convert(markdown, function(error, result) {
    if (error) {
        console.error('Conversion failed:', error);
        // Handle error appropriately
        return;
    }
    // Process result
});
```

### 3. Resource Management

Clean up resources in batch processing:

```javascript
generator.batchConvert(files, function(errors, results) {
    // Process results
    // Clean up temporary files
});
```

### 4. Security

Enable HTML sanitization:

```javascript
const generator = new MarkdownToPDF({
    sanitizeHTML: true,
    security: {
        allowRemoteImages: false,
        sanitizationLevel: 'strict'
    }
});
```

### 5. Performance

Use batch processing for multiple files:

```javascript
// Better than converting files one by one
generator.batchConvert(files, callback);
```

## Production Deployment

### Node.js with Puppeteer

For actual PDF generation in Node.js, use Puppeteer:

```javascript
const MarkdownToPDF = require('./src/index.js');
const puppeteer = require('puppeteer');
const fs = require('fs');

async function generatePDF(markdown, outputPath) {
    const generator = new MarkdownToPDF();

    // Generate HTML
    generator.convert(markdown, async function(error, result) {
        if (error) {
            console.error('Error:', error);
            return;
        }

        // Save HTML temporarily
        const htmlPath = outputPath.replace('.pdf', '.html');
        fs.writeFileSync(htmlPath, result.html);

        // Convert to PDF with Puppeteer
        const browser = await puppeteer.launch();
        const page = await browser.newPage();
        await page.goto('file://' + htmlPath, { waitUntil: 'networkidle0' });
        await page.pdf({
            path: outputPath,
            format: 'A4',
            printBackground: true
        });
        await browser.close();

        // Clean up
        fs.unlinkSync(htmlPath);

        console.log('PDF generated:', outputPath);
    });
}

// Usage
generatePDF('# Hello World', 'output.pdf');
```

### Apache/PHP Integration

```php
<?php
$markdown = file_get_contents('input.md');
$config = json_encode(['pageSize' => 'A4']);

// Execute Node.js script
$command = "node convert.js " . escapeshellarg($markdown) . " " . escapeshellarg($config);
$output = shell_exec($command);

echo "PDF generated: " . $output;
?>
```

### Nginx Static Serving

Serve the library as static files and use client-side conversion:

```nginx
location /markdown-to-pdf/ {
    root /var/www/html;
    index index.html;
}
```
