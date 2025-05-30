[![MseeP.ai Security Assessment Badge](https://mseep.net/pr/cablate-mcp-doc-forge-badge.png)](https://mseep.ai/app/cablate-mcp-doc-forge)

# Simple Document Processing MCP Server
[![smithery badge](https://smithery.ai/badge/@cablate/mcp-doc-forge)](https://smithery.ai/server/@cablate/mcp-doc-forge)

A powerful Model Context Protocol (MCP) server providing comprehensive document processing capabilities.

<a href="https://glama.ai/mcp/servers/pb9df6lnel"><img width="380" height="200" src="https://glama.ai/mcp/servers/pb9df6lnel/badge" alt="Simple Document Processing Server MCP server" /></a>

## Features

### Document Reader
- Read DOCX, PDF, TXT, HTML, CSV

### Document Conversion
- DOCX to HTML/PDF conversion
- HTML to TXT/Markdown conversion
- PDF manipulation (merge, split)

### Text Processing
- Multi-encoding transfer support (UTF-8, Big5, GBK)
- Text formatting and cleaning
- Text comparison and diff generation
- Text splitting by lines or delimiter

### HTML Processing
- HTML cleaning and formatting
- Resource extraction (images, links, videos)
- Structure-preserving conversion

## Installation

### Installing via Smithery

To install Document Processing Server for Claude Desktop automatically via [Smithery](https://smithery.ai/server/@cablate/mcp-doc-forge):

```bash
npx -y @smithery/cli install @cablate/mcp-doc-forge --client claude
```

### Manual Installation
```bash
npm install -g @cablate/mcp-doc-forge
```


## Usage

### Cli

```bash
mcp-doc-forge
```

### With [Dive Desktop](https://github.com/OpenAgentPlatform/Dive)

1. Click "+ Add MCP Server" in Dive Desktop
2. Copy and paste this configuration:

```json
{
  "mcpServers": {
    "searxng": {
      "command": "npx",
      "args": [
        "-y",
        "@cablate/mcp-doc-forge"
      ],
      "enabled": true
    }
  }
}
```

3. Click "Save" to install the MCP server

## License

MIT

## Contributing

Welcome community participation and contributions! Here are ways to contribute:

- ⭐️ Star the project if you find it helpful
- 🐛 Submit Issues: Report problems or provide suggestions
- 🔧 Create Pull Requests: Submit code improvements

## Contact

If you have any questions or suggestions, feel free to reach out:

- 📧 Email: [reahtuoo310109@gmail.com](mailto:reahtuoo310109@gmail.com)
- 📧 GitHub: [CabLate](https://github.com/cablate/)
- 🤝 Collaboration: Welcome to discuss project cooperation
- 📚 Technical Guidance: Sincere welcome for suggestions and guidance



