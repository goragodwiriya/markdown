# Markdown to PDF Generator

A professional, framework-free Markdown to PDF converter built with vanilla JavaScript, HTML, and CSS.

## ✨ Features

- **Pure Vanilla JavaScript** - No frameworks, no build tools required
- **Universal Compatibility** - Runs in browsers, Node.js, Apache/PHP, Nginx
- **GitHub Flavored Markdown** - Full GFM support with syntax highlighting
- **Mermaid Diagrams** - 12+ diagram types (flowcharts, ERD, sequence, etc.)
- **Extensible Architecture** - Plugin-based, SOLID principles
- **Print-Perfect CSS** - @page rules, custom themes, embedded fonts
- **Security First** - HTML sanitization, XSS prevention
- **Unicode Support** - Full international character support including Thai
- **Batch Processing** - Handle multiple files efficiently

## 📁 Project Structure

```
markdown-to-pdf/
├── src/
│   ├── core/
│   │   ├── MarkdownParser.js      # Markdown → HTML conversion
│   │   ├── HTMLRenderer.js        # HTML template management
│   │   ├── PDFGenerator.js        # PDF rendering orchestration
│   │   └── ConfigManager.js       # Configuration handling
│   ├── plugins/
│   │   ├── SyntaxHighlighter.js   # Code syntax highlighting
│   │   ├── TOCGenerator.js        # Table of contents
│   │   └── ImageProcessor.js      # Image handling
│   ├── utils/
│   │   ├── Sanitizer.js           # HTML sanitization
│   │   └── Logger.js              # Error handling & logging
│   └── index.js                   # Main entry point
├── templates/
│   └── default.html               # Default HTML template
├── styles/
│   ├── default.css                # Default PDF styles
│   └── themes/
│       ├── modern.css             # Modern theme
│       └── classic.css            # Classic theme
├── fonts/
│   └── NotoSans/                  # Unicode font support
├── examples/
│   ├── sample.md                  # Example Markdown
│   ├── sample-mermaid.md          # Mermaid diagram examples
│   ├── config.json                # Configuration example
│   └── usage.js                   # Usage examples
└── dist/
    └── output.pdf                 # Generated PDFs
```

## 🚀 Quick Start

### Option 1: Browser (No Installation)

```bash
# Just open in your browser
open examples/browser-example.html
```

1. Type or paste Markdown in the editor
2. Click "Update Preview" to see HTML
3. Click "Generate PDF" to create PDF

### Option 2: Node.js

```bash
# Install Puppeteer (one-time)
npm install puppeteer

# Run the example
node examples/node-puppeteer.js examples/sample.md dist/output.pdf

# Check your PDF
open dist/output.pdf
```

### Option 3: Quick Script

```javascript
const MarkdownToPDF = require('./src/index.js');

const generator = new MarkdownToPDF({
    pageSize: 'A4',
    enableTOC: true,
    syntaxHighlighting: true
});

const markdown = `
# My Document

This is **bold** and this is *italic*.

## Code Example

\`\`\`javascript
console.log('Hello, World!');
\`\`\`
`;

generator.convert(markdown, function(error, result) {
    if (error) {
        console.error('Error:', error);
    } else {
        console.log('Success!');
    }
});
```

## ⚙️ Configuration

```json
{
    "pageSize": "A4",
    "margins": {
        "top": "2cm",
        "right": "2cm",
        "bottom": "2cm",
        "left": "2cm"
    },
    "theme": "default",
    "template": "templates/default.html",
    "enableTOC": true,
    "syntaxHighlighting": true,
    "sanitizeHTML": true,
    "enableMermaid": true,
    "mermaidTheme": "default",
    "fonts": ["fonts/NotoSans/"],
    "header": {
        "enabled": true,
        "content": "{{title}}"
    },
    "footer": {
        "enabled": true,
        "content": "Page {{page}} of {{totalPages}}"
    }
}
```

### Common Configurations

**For Documentation:**
```javascript
{ pageSize: 'A4', enableTOC: true, syntaxHighlighting: true }
```

**For Reports:**
```javascript
{ pageSize: 'Letter', margins: { top: '1in', right: '1in', bottom: '1in', left: '1in' } }
```

**For E-books:**
```javascript
{ pageSize: 'A5', enableTOC: true }
```

## 🔌 Plugin System

Extend functionality through plugins:

```javascript
const customPlugin = {
    name: 'CustomPlugin',
    stage: 'postprocess',
    process: function(html, config) {
        // Transform HTML
        return html;
    }
};

generator.registerPlugin(customPlugin);
```

## 🔐 Security

- HTML sanitization using whitelist approach
- XSS prevention through content escaping
- Remote resource validation
- Safe image handling (local, URL, base64)

## 🌐 Browser Compatibility

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Node.js 14+

## 📚 Documentation

| Guide | Description |
|-------|-------------|
| [Usage Guide](USAGE_GUIDE.md) | Comprehensive API reference, examples, and troubleshooting |
| [Mermaid Guide](MERMAID_GUIDE.md) | Complete guide for all 12+ Mermaid diagram types |
| [Examples](examples/) | Sample files and usage examples |

## 🐛 Troubleshooting

| Issue | Solution |
|-------|----------|
| Cannot find module | Ensure you're in the project root directory |
| Puppeteer not found | Run `npm install puppeteer` |
| Images not showing | Enable `security.allowRemoteImages: true` |
| Syntax highlighting not working | Specify language in code blocks: ` ```javascript ` |

## 📜 License

MIT
