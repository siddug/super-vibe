# Super Vibe - Project Summary

## Overview
Super Vibe is a companion project to [Mistral Vibe](https://github.com/mistralai/mistral-vibe) that provides additional helper tools to enhance the coding assistant experience. The project offers web search capabilities, coding guidelines enforcement, and remote control of OpenCode sessions via Discord.

## Key Features

### 1. Web Search Tool
- **Technology**: Uses SearXNG (local web search engine) via Docker
- **Capabilities**: 
  - Search the web using keywords
  - Fetch and convert web page content to markdown
  - Configurable parameters (language, safesearch, categories)
- **Implementation**: 
  - Python tool: `tools/web_search.py`
  - Prompt template: `prompts/web_search.md`
  - SearXNG configuration: `helpers/searxng/`

### 2. Python Linter Agent
- **Purpose**: Enforces coding guidelines on Python files
- **Configuration**: `agents/python_linter.toml`
- **Prompt**: `prompts/python_linter.md` (28KB comprehensive guidelines)
- **Features**:
  - Code style enforcement
  - Best practices validation
  - Automatic code quality checks

### 3. VAPT (Vulnerability Assessment & Penetration Testing) Agent
- **Purpose**: Security testing using MCP (Machine Code Protocol) servers
- **Configuration**: `agents/vapt_agent.toml`
- **Prompt**: `prompts/vapt_agent.md`
- **Integration**: Uses Hexstrike MCP for security analysis
- **Setup**: Requires external Hexstrike server setup

### 4. Remote Vibe (Discord Bot)
- **Purpose**: Control OpenCode sessions remotely via Discord
- **Location**: `apps/remote-vibe/`
- **Technology Stack**:
  - TypeScript/Node.js with pnpm
  - Discord.js for bot integration
  - SQLite for state management
- **Features**:
  - Create Discord channels for each OpenCode project
  - Send messages to control sessions
  - Voice channel support with audio transcription
  - Multi-model support (Mistral, Claude, GPT, Gemini)
  - Role-based permissions
- **Best Practices**:
  - Notifications set to mentions only
  - Long messages sent as files
  - Specific Discord permissions required

## Project Structure

```
super-vibe/
├── agents/                  # Agent configurations
│   ├── python_linter.toml   # Python coding guidelines agent
│   └── vapt_agent.toml      # Security testing agent
├── apps/
│   └── remote-vibe/         # Discord bot for remote control
│       ├── discord/         # Bot implementation
│       └── ...
├── helpers/
│   └── searxng/             # SearXNG web search setup
│       ├── config/          # Configuration files
│       └── docker-compose.yml
├── prompts/                 # Prompt templates
│   ├── python_linter.md     # Comprehensive Python guidelines
│   ├── vapt_agent.md        # VAPT agent instructions
│   └── web_search.md        # Web search tool instructions
├── tools/
│   └── web_search.py        # Web search implementation
└── README.md                # Main documentation
```

## Installation & Setup

### Web Search
1. Start SearXNG: `docker compose -f helpers/searxng/docker-compose.yml up -d`
2. Symlink tools to `~/.vibe/tools/` and prompts to `~/.vibe/prompts/`

### Agents
1. Symlink agent configs to `~/.vibe/agents/`
2. Symlink prompts to `~/.vibe/prompts/`

### Remote Vibe
1. Install dependencies: `cd apps/remote-vibe/discord && pnpm install`
2. Run development server: `pnpm dev`
3. Configure Discord bot token and API keys

## Usage Examples

### Web Search
```
> Search for 'Siddhartha Gunti' and tell me what you find
> Can you tell me how to implement MCPs in Vibe - https://github.com/mistralai/mistral-vibe
```

### Python Linter
```bash
vibe --agent python_linter
```

### VAPT Agent
Requires Hexstrike MCP server setup and configuration in `vapt_agent.toml`

### Remote Vibe
- Each project gets its own Discord channel
- Messages in channels control OpenCode sessions
- Supports voice commands with audio transcription

## Technical Details

### Web Search Implementation
- Uses `httpx` for async HTTP requests
- Supports both search and fetch actions
- Automatic HTML to markdown conversion
- Configurable timeouts and result limits
- Error handling for network issues

### Remote Vibe Architecture
- TypeScript-based Discord bot
- SQLite database for state management
- Multi-model support through OpenCode configuration
- Role-based access control
- Signal-based restart mechanism (SIGUSR2)

### Security (VAPT)
- Uses MCP (Machine Code Protocol) for security testing
- Hexstrike integration for vulnerability assessment
- Configurable MCP server endpoints

## Contribution Guidelines

- Follow existing code style
- Add comprehensive tests
- Update documentation
- Use kebab-case for filenames
- No emojis in code/messages unless requested
- Never auto-commit without explicit instruction

## License

Apache License 2.0
Copyright 2025 Siddhartha Gunti

## Dependencies

- Docker (for SearXNG)
- Python 3.8+ (for tools)
- Node.js 18+ (for Remote Vibe)
- pnpm (for Remote Vibe dependencies)
- Mistral Vibe (base platform)

## Future Enhancements

- Additional agent types
- Enhanced security features
- More web search capabilities
- Improved Discord bot features
- Better error handling and logging
