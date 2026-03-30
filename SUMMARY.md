# Super Vibe - Project Summary

## Overview
Super Vibe is a companion project to [Mistral Vibe](https://github.com/mistralai/mistral-vibe) that provides additional helper tools to enhance the coding assistant experience. The project offers three main components:

1. **Web Search Tool** - Integrates SearXNG for web search capabilities
2. **Coding Guidelines Agent** - Python linter agent for code quality
3. **Remote Vibe** - Discord bot for remote control of OpenCode sessions

## Repository Structure

```
super-vibe/
├── agents/                  # Agent configurations
│   ├── python_linter.toml    # Python linter agent config
│   └── vapt_agent.toml       # VAPT agent with MCP integration
├── apps/                    # Applications
│   └── remote-vibe/         # Remote Vibe Discord bot
│       ├── discord/         # Discord bot implementation (TypeScript)
│       └── ...
├── helpers/                 # Helper utilities
│   └── searxng/             # SearXNG web search setup
│       ├── config/          # SearXNG configuration
│       └── docker-compose.yml
├── prompts/                 # Prompt templates
│   ├── python_linter.md     # Python linter prompt (28KB)
│   ├── vapt_agent.md        # VAPT agent prompt
│   └── web_search.md        # Web search tool prompt
├── tools/                   # Tool implementations
│   └── web_search.py        # Web search tool (Python)
├── README.md                # Main documentation
└── SUMMARY.md               # This file
```

## Key Components

### 1. Web Search Tool
- **File**: `tools/web_search.py`
- **Prompt**: `prompts/web_search.md`
- **Features**:
  - Search the web using SearXNG instance
  - Fetch and convert web page content to markdown
  - Configurable parameters: categories, language, safesearch, result count
  - Automatic HTML to markdown conversion
  - Content truncation for large pages

### 2. Python Linter Agent
- **Config**: `agents/python_linter.toml`
- **Prompt**: `prompts/python_linter.md` (28KB comprehensive guidelines)
- **Features**:
  - Code quality analysis
  - Style guideline enforcement
  - Best practice recommendations

### 3. VAPT Agent
- **Config**: `agents/vapt_agent.toml`
- **Prompt**: `prompts/vapt_agent.md`
- **Features**:
  - MCP (Machine Code Processor) integration
  - Hexstrike MCP server configuration
  - Security testing capabilities

### 4. Remote Vibe (Discord Bot)
- **Location**: `apps/remote-vibe/`
- **Tech Stack**: TypeScript, Discord.js
- **Features**:
  - Control OpenCode sessions via Discord
  - Per-project Discord channels
  - Voice channel interaction
  - Role-based permissions
  - SQLite database for state management
  - Audio transcription capabilities

## Installation & Setup

### Web Search with SearXNG
```bash
cd helpers/searxng
docker compose -f docker-compose.yml up -d
```

### Tool Installation
```bash
# Symlink tools to Vibe installation
ln -sf <super-vibe-path>/tools/web_search.py ~/.vibe/tools/
ln -sf <super-vibe-path>/prompts/web_search.md ~/.vibe/prompts/

# Symlink agents
ln -s <super-vibe-path>/agents/python_linter.toml ~/.vibe/agents/
ln -s <super-vibe-path>/prompts/python_linter.md ~/.vibe/tools/prompts/
```

### Remote Vibe Setup
```bash
cd apps/remote-vibe/discord
pnpm install
pnpm dev
```

## Usage Examples

### Web Search
```
# Search for information
Search for 'Siddhartha Gunti' and tell me what you find

# Fetch page content
Can you tell me how to implement MCPs in Vibe - https://github.com/mistralai/mistral-vibe
```

### Python Linter
```bash
vibe --agent python_linter
```

### Remote Vibe
- Install Discord bot
- Configure API keys (Discord, Gemini, Mistral)
- Add OpenCode projects to Discord channels
- Send messages to channels to control sessions

## Technical Details

### Web Search Tool Implementation
- Uses `httpx` for async HTTP requests
- Supports both search and fetch actions
- Configurable timeout (default: 30s)
- Maximum results: 10 (configurable)
- Content length limit: 50,000 characters
- Multiple HTML to markdown conversion strategies

### Remote Vibe Architecture
- TypeScript-based Discord bot
- SQLite database for persistent state
- Role-based access control
- Audio transcription via Gemini API
- Voice channel support
- Signal-based restart mechanism (SIGUSR2)

## Recent Commits
- `7a33493` - Adding vapt_agent with hexstripe mcp
- `9a93cc7` - Remote vibe code readme
- `f8f3ea9` - feat: add remote-vibe discord bot
- `9a52469` - Docs: Instructions on how to use the python linter
- `82ac7ef` - v0: python linter
- `6500064` - Init: Web Search (via SearXNG)

## License
Apache License 2.0
Copyright 2025 Siddhartha Gunti

## Dependencies
- Python 3.x
- Docker (for SearXNG)
- Node.js/pnpm (for Remote Vibe)
- Optional: markdownify, beautifulsoup4 (for enhanced HTML conversion)
