# Super Vibe Project Summary

## Overview

Super Vibe is a companion project to [Mistral Vibe](https://github.com/mistralai/mistral-vibe) that provides additional helper tools to enhance your coding assistant experience. It extends Mistral Vibe with web search capabilities, coding guidelines enforcement, and remote control functionality via Discord.

## Key Features

### 1. Web Search Tool

**Purpose**: Integrates SearXNG as a web search engine to fetch information from the web.

**Components**:
- `tools/web_search.py` - Main implementation
- `prompts/web_search.md` - Tool prompt configuration
- `helpers/searxng/` - Docker-based SearXNG instance

**Capabilities**:
- Perform keyword searches using SearXNG
- Fetch and convert web page content to markdown
- Support for categories, language filtering, and safe search
- Configurable timeout and result limits

**Usage Example**:
```bash
> Search for 'Siddhartha Gunti' and tell me what you find
> Can you tell me how to implement MCPs in Vibe - https://github.com/mistralai/mistral-vibe
```

### 2. Coding Guidelines Agent (Python Linter)

**Purpose**: Ensures code adheres to Python coding guidelines and linting rules.

**Components**:
- `agents/python_linter.toml` - Agent configuration
- `prompts/python_linter.md` - Comprehensive coding guidelines

**Key Guidelines**:
- **Type Safety**: Mandatory type annotations for all functions
- **Code Structure**: Single responsibility principle
- **Naming**: Specific, descriptive variable and function names
- **Error Handling**: Proper exception handling
- **Testing**: Arrange-Act-Assert pattern
- **Nesting**: Maximum 2-3 levels of indentation

**Tool Integration**:
- Ruff for linting and formatting
- Pyright for type checking
- Pytest for testing

### 3. Remote Vibe (Discord Bot)

**Purpose**: Control OpenCode sessions remotely via Discord channels.

**Components**:
- `apps/remote-vibe/discord/` - Discord bot implementation
- TypeScript-based CLI and bot

**Features**:
- **Project Channels**: Each project gets its own Discord channel
- **Message-Based Control**: Send messages to control OpenCode sessions
- **Multi-Bot Support**: Create different bots for different machines
- **Role-Based Access**: Only users with specific permissions can interact
- **File Attachments**: Send long prompts as file attachments
- **Model Configuration**: Change models via `opencode.json`

**Setup Process**:
1. Install dependencies with `pnpm install`
2. Run development server with `pnpm dev`
3. Configure Discord bot token and API keys
4. Select OpenCode projects to add to Discord
5. Bot creates channels and manages sessions

**Best Practices**:
- Set notifications to "mentions only"
- Send long messages as files
- Use role-based permissions
- Monitor session completion via reactions (✅/❌)

## Technical Architecture

### Web Search Implementation

The web search tool uses:
- **SearXNG**: Self-hosted privacy-respecting metasearch engine
- **Docker**: Containerized deployment for easy setup
- **HTTPX**: Async HTTP client for making requests
- **Markdownify/BeautifulSoup**: HTML to markdown conversion
- **Pydantic**: Data validation and configuration management

### Python Linter Agent

The linter agent follows a structured approach:
1. **Linting**: Check code against Ruff rules
2. **Syntax Validation**: Ensure Python syntax correctness
3. **Documentation Review**: Check comments and docstrings
4. **Code Quality**: Remove unused code, improve naming

### Remote Vibe System

The Discord bot architecture includes:
- **CLI Interface**: Command-line setup and configuration
- **Discord.js**: Discord API integration
- **SQLite Database**: Local state storage
- **Worker Threads**: Background processing
- **OpenCode SDK**: Integration with OpenCode sessions

## Installation

### Prerequisites
- Docker installed
- Mistral Vibe installed and configured
- Node.js and pnpm for Remote Vibe

### Setup Steps

#### Web Search
```bash
cd helpers/searxng
docker compose -f docker-compose.yml up -d
ln -sf <super-vibe-path>/tools/web_search.py ~/.vibe/tools/
ln -sf <super-vibe-path>/prompts/web_search.md ~/.vibe/prompts/
```

#### Python Linter
```bash
ln -s <super-vibe-path>/agents/python_linter.toml ~/.vibe/agents/python_linter.toml
ln -s <super-vibe-path>/prompts/python_linter.md ~/.vibe/tools/prompts/python_linter.md
```

#### Remote Vibe
```bash
cd apps/remote-vibe/discord
pnpm install
pnpm dev
```

## Usage Patterns

### Web Search
```
# Search action
vibe --tool web_search --action search --query "Python async best practices"

# Fetch action
vibe --tool web_search --action fetch --url "https://docs.python.org/3/library/asyncio.html"
```

### Python Linter
```bash
# Start in agent mode
vibe --agent python_linter

# Agent will guide through linting process
```

### Remote Vibe
```
# In Discord channel associated with a project:
# "Implement user authentication system"
# Bot creates OpenCode session and executes the request
# Session results posted back to Discord thread
```

## Project Structure

```
super-vibe/
├── apps/
│   └── remote-vibe/          # Remote Vibe Discord bot
│       ├── discord/          # Discord bot implementation
│       └── ...
├── helpers/
│   └── searxng/              # SearXNG web search
│       ├── config/          # SearXNG configuration files
│       │   └── settings.yml
│       ├── data/            # SearXNG data directory
│       └── docker-compose.yml
├── prompts/
│   ├── web_search.md        # Web search tool prompt
│   └── python_linter.md     # Python linting guidelines
├── tools/
│   └── web_search.py        # Web search tool implementation
├── agents/
│   ├── python_linter.toml   # Python linter agent config
│   └── vapt_agent.toml      # VAPT agent config
└── README.md                # Main documentation
```

## Security Considerations

### VAPT Agent
The project includes a VAPT (Vulnerability Assessment and Penetration Testing) agent that can integrate with MCPs (Multi-Tool Control Protocols) like Hexstrike for security testing.

**Setup**:
1. Clone Hexstrike repository
2. Install security tools
3. Start MCP server
4. Configure VAPT agent with correct paths
5. Use with `vibe --agent vapt_agent`

## Development Practices

### Coding Standards
- **Type Annotations**: Required for all functions
- **Line Length**: 88 characters maximum
- **Import Organization**: Alphabetical ordering
- **Error Handling**: Specific exception handling
- **Testing**: Comprehensive unit and integration tests

### Tooling
- **Linting**: Ruff with custom configuration
- **Formatting**: Ruff format
- **Type Checking**: Pyright
- **Testing**: Pytest with mocking
- **Logging**: Loguru

## Future Enhancements

Potential areas for improvement:
- **Additional Tools**: More helper tools for different programming languages
- **Enhanced Security**: Better authentication for Remote Vibe
- **Performance**: Optimize web search and processing
- **Documentation**: More detailed examples and tutorials
- **Integration**: Support for more coding assistants and platforms

## License

Copyright 2025 Siddhartha Gunti
Licensed under the Apache License, Version 2.0

## Acknowledgments

- Built on top of Mistral Vibe
- Uses SearXNG for web search functionality
- Inspired by Kimaki for remote control concept
