# Super Vibe

> "Don't Panic" - The Hitchhiker's Guide to the Galaxy

Super Vibe is a companion project to [Mistral Vibe](https://github.com/mistralai/mistral-vibe) that provides additional helper tools to enhance your coding assistant experience.

## Features

- **Web Search Tool**: Integrates SearXNG as a web search engine to fetch information from the web.
- **Coding Guidelines Agent**: Tool that works on your files to make sure they are as per the coding guidelines.
- **Remote Vibe**: Discord bot for controlling Devstral <> OpenCode sessions remotely via Discord

## Installation

### Prerequisites

1. Install Docker on your system
2. Have Mistral Vibe installed and configured

### Setting up SearXNG for Web Search Tool

1. Navigate to the helpers directory:
   ```bash
   cd helpers/searxng
   ```

2. Start SearXNG using Docker Compose:
   ```bash
   docker compose -f docker-compose.yml up -d
   ```

3. Test that SearXNG is running by visiting http://localhost:8888/

### Installing Super Vibe Tools

1. Create the Vibe tools directory if it doesn't exist:
   ```bash
   mkdir -p ~/.vibe/tools
   mkdir -p ~/.vibe/prompts
   ```

2. Symlink the tools to your Vibe installation:
   ```bash
   ln -sf <super-vibe-path>/tools/web_search.py ~/.vibe/tools/
   ln -sf <super-vibe-path>/prompts/web_search.md ~/.vibe/prompts/
   ```

   Alternatively, you can symlink these in your specific project directory instead of globally.

### Installing Super Vibe Agents

1. Create the Vibe agents director if it doesn't exist:
   ```bash
   mkdir -p ~/.vibe/agents
   mkdir -p ~/.vibe/prompts
   ```

2. Symlink the tools to your Vibe installation:
   ```bash
   ln -s <super-vibe-path>/agents/python_linter.toml ~/.vibe/agents/python_linter.toml
   ln -s <super-vibe-path>/prompts/python_linter.md ~/.vibe/tools/prompts/python_linter.md

   ln -s <super-vibe-path>/agents/vapt_agent.toml ~/.vibe/agents/vapt_agent.toml
   ln -s <super-vibe-path>/prompts/vapt_agent.md ~/.vibe/tools/prompts/vapt_agent.md
   ```

### Setting up Remote Vibe

1. Navigate to the remote-vibe directory:
   ```bash
   cd apps/remote-vibe/discord
   ```

2. Install dependencies:
   ```bash
   pnpm install
   ```

3. Run the development server:
   ```bash
   pnpm dev
   ```

4. Follow the CLI prompts to configure your Discord bot and API keys

### Setting up MCPs

We have VAPT agent that uses MCPs to conduct VAPT testing. Here's an example of how to set it up:

1. Follow the instructions here - https://github.com/0x4m4/hexstrike-ai (i.e clone the repo, setup venv and install deps)

2. Install as many security tools as you can (Instructions to setup popular tools are provided in the repo ^)

3. Once done, start the MCP server `python3 hexstrike_server.py --port 8889`

4. Change the hexstrike python path in vapt_agent.toml file with your system's directory path

5. Once done, you can instantiate the VAPT agent that uses your MCP with `vibe --agent vapt_agent`

### Configuration

By default, SearXNG runs on port 8888. If you change the port, update the configuration in your `config.toml`:

```toml
[tools.web_search]
searxng_url = "http://localhost:YOUR_PORT"
```

## Usage

### Web Search

You can now use the web search tool directly in Vibe:

```
> Search for 'Siddhartha Gunti' and tell me what you find
```

Or provide a direct link for analysis:

```
> Can you tell me how to implement MCPs in Vibe - https://github.com/mistralai/mistral-vibe
```

### Coding Guidelines Agent

You can start Vibe with `vibe --agent python_linter` to start in the agent mode.

### Remote Vibe

Once configured, you can control OpenCode sessions in any computer via Discord channels. Each project gets its own channel where you can send messages to control the OpenCode session.

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
│   └── web_search.md        # Web search tool prompt
├── tools/
│   └── web_search.py        # Web search tool implementation
└── README.md                # This file
```

## Contributing

Contributions are welcome! Please feel free to submit pull requests or open issues for:

- New helper tools
- Bug fixes
- Documentation improvements
- Feature enhancements

## License

Copyright 2025 Siddhartha Gunti

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the LICENSE file for the full license text.

## Acknowledgments

- Built on top of [Mistral Vibe](https://github.com/mistralai/mistral-vibe)
- Uses [SearXNG](https://github.com/searxng/searxng) for web search functionality
- Inspired by [Kimaki](https://github.com/remorses/kimaki) for the remote control starter
