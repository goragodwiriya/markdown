# Examples Directory

This directory contains various examples and demos for the Markdown to PDF Generator.

## 📁 Files Overview

### Interactive Viewers

#### `viewer.html` - Clean Minimal Viewer
A distraction-free Markdown viewer with live preview.

**Features:**
- 📁 Browse and open Markdown files
- 👁️ Live preview with full styling
- ⚙️ Configurable settings
- 📥 Export to PDF
- 🎨 Clean, minimal design
- ⌨️ Keyboard shortcuts (Ctrl+O, Ctrl+P)
- 🖱️ Drag & drop support

**Usage:**
```bash
open viewer.html
```

#### `viewer-mermaid.html` - Viewer with Mermaid Support
Enhanced viewer with support for Mermaid diagrams.

**Features:**
- All features from `viewer.html`
- 📊 12+ Mermaid diagram types
- 🎨 5 Mermaid themes
- 🔄 Live diagram rendering
- ⚠️ Error handling for invalid syntax

**Supported Diagrams:**
- Flowcharts
- Sequence Diagrams
- Entity Relationship Diagrams (ERD)
- Class Diagrams
- State Diagrams
- Gantt Charts
- Pie Charts
- Git Graphs
- User Journey
- Mindmaps
- Timelines
- Quadrant Charts

**Usage:**
```bash
open viewer-mermaid.html
```

### Sample Files

#### `sample.md` - Comprehensive Markdown Example
Demonstrates all supported Markdown features.

**Includes:**
- Headings (H1-H6)
- Text formatting (bold, italic, strikethrough)
- Lists (ordered, unordered, nested)
- Code blocks with syntax highlighting
- Tables
- Blockquotes
- Links and images
- Horizontal rules
- Unicode characters

#### `sample-mermaid.md` - Mermaid Diagram Examples
Complete showcase of all Mermaid diagram types.

**Includes:**
- 12 different diagram types
- Real-world examples
- Best practices
- Tips and tricks

### Configuration

#### `config.json` - Configuration Example
Complete configuration file with all available options.

**Includes:**
- Page settings
- Margins
- Header/footer
- Metadata
- Security settings
- Performance options

### Node.js Examples

#### `usage.js` - Node.js Usage Examples
10 different usage patterns for Node.js.

**Examples:**
1. Basic conversion
2. File conversion
3. Custom configuration
4. Custom template
5. Custom plugin
6. Batch processing
7. Configuration management
8. Logging and debugging
9. Image processing
10. Complete workflow

**Usage:**
```bash
node usage.js
```

#### `node-puppeteer.js` - Puppeteer Integration
Complete PDF generation with Puppeteer.

**Features:**
- Full PDF generation
- CLI interface
- Batch processing
- Error handling
- Async/await support

**Usage:**
```bash
# Install Puppeteer first
npm install puppeteer

# Convert single file
node node-puppeteer.js input.md output.pdf

# Run examples
node node-puppeteer.js example1
node node-puppeteer.js example2
```

#### `browser-example.html` - Original Interactive Demo
The original browser example with editor and preview.

**Features:**
- Split view (editor + preview)
- Live preview
- Configuration UI
- Syntax highlighting toggle
- TOC toggle

## 🚀 Quick Start Guide

### 1. For Quick Preview
```bash
# Just want to view a Markdown file?
open viewer.html
# Then click "Open File" and select your .md file
```

### 2. For Diagrams
```bash
# Need flowcharts or ERD?
open viewer-mermaid.html
# Then open sample-mermaid.md to see examples
```

### 3. For Development
```bash
# Want to integrate into your app?
# See usage.js for code examples
node usage.js
```

### 4. For PDF Generation
```bash
# Need actual PDF files?
npm install puppeteer
node node-puppeteer.js sample.md output.pdf
```

## 📖 Learning Path

### Beginner
1. Open `viewer.html`
2. Load `sample.md`
3. Explore the preview
4. Try different settings

### Intermediate
1. Open `viewer-mermaid.html`
2. Load `sample-mermaid.md`
3. Try different Mermaid themes
4. Create your own diagrams

### Advanced
1. Study `usage.js` examples
2. Try `node-puppeteer.js`
3. Create custom plugins
4. Integrate into your workflow

## 💡 Tips

### For Viewers
- **Drag & Drop**: Just drag .md files onto the viewer
- **Keyboard Shortcuts**:
  - `Ctrl/Cmd + O` - Open file
  - `Ctrl/Cmd + P` - Export PDF
  - `Esc` - Close settings
- **Settings**: Click ⚙️ to customize

### For Mermaid
- **Test First**: Use [Mermaid Live Editor](https://mermaid.live/) to test syntax
- **Keep Simple**: Complex diagrams are hard to read
- **Use Themes**: Try different themes for better appearance
- **Check Errors**: Red error messages show syntax issues

### For Node.js
- **Start Simple**: Begin with basic examples
- **Use Puppeteer**: For actual PDF generation
- **Batch Process**: Process multiple files efficiently
- **Check Logs**: Use `getLogs()` for debugging

## 🐛 Troubleshooting

### Viewer Issues

**Problem**: File won't open
- **Solution**: Check file extension (.md, .markdown, .txt)

**Problem**: Preview not showing
- **Solution**: Check browser console for errors

**Problem**: Mermaid not rendering
- **Solution**: Enable "Mermaid Diagrams" in settings

### Node.js Issues

**Problem**: Module not found
- **Solution**: Run from project root directory

**Problem**: Puppeteer fails
- **Solution**: Install with `npm install puppeteer`

**Problem**: PDF not generating
- **Solution**: Check file paths are correct

## 📚 Documentation

- [Main README](../README.md) - Project overview
- [Quick Start](../QUICKSTART.md) - 5-minute guide
- [Usage Guide](../USAGE_GUIDE.md) - Complete API reference
- [Mermaid Guide](../MERMAID_GUIDE.md) - Mermaid documentation
- [Mermaid Quick Ref](../MERMAID_QUICK_REFERENCE.md) - Quick patterns

## 🎯 Use Cases

### Documentation
- API documentation
- User manuals
- Technical guides
→ Use `viewer.html` with `sample.md` as template

### Diagrams
- System architecture
- Database schemas
- Process flows
→ Use `viewer-mermaid.html` with `sample-mermaid.md`

### Reports
- Business reports
- Project status
- Analytics
→ Use `node-puppeteer.js` for batch generation

### Presentations
- Slide content
- Handouts
- Notes
→ Use custom templates with themes

## 🔗 Related Files

- [Architecture](../ARCHITECTURE.md) - Technical details
- [Deployment](../DEPLOYMENT.md) - Production guide
- [Project Summary](../PROJECT_SUMMARY.md) - Overview

## 📞 Support

Having issues? Check:
1. Browser console for errors
2. File paths are correct
3. Required libraries loaded
4. Settings are configured

Still stuck? Review the documentation or check the examples!

---

**Happy Converting!** 📄✨
