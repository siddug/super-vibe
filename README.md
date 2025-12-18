# Super Vibe

Super Vibe is a companion project to [Mistral Vibe](https://github.com/mistralai/mistral-vibe) that provides additional helper tools to enhance your coding assistant experience.

## Features

- **Web Search Tool**: Integrates SearXNG as a web search engine to fetch information from the web
- **Easy Integration**: Tools can be symlinked to your Vibe installation for seamless use
- **Customizable**: Configure search engine settings and tool behavior

## Installation

### Prerequisites

1. Install Docker on your system
2. Have Mistral Vibe installed and configured

### Setting up SearXNG

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
   mkdir -p ~/.vibe/tools/prompts
   ```

2. Symlink the tools to your Vibe installation:
   ```bash
   ln -sf <super-vibe-path>/tools/web_search.py ~/.vibe/tools/
   ln -sf <super-vibe-path>/prompts/web_search.md ~/.vibe/tools/prompts/
   ```

   Alternatively, you can symlink these in your specific project directory instead of globally.

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

## Project Structure

```
super-vibe/
├── helpers/
│   └── searxng/
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
