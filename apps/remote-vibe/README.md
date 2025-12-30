<div align='center'>
    <br/>
    <br/>
    <h3>remote-vibe</h3>
    <p>IronMan's Jarvis for coding agents, inside Discord</p>
    <br/>
    <br/>
</div>

Remote-vibe is a Discord bot you can install in a Discord server to control opencode sessions in any computer via Discord

When running the `remote-vibe` cli the first time the cli will ask you choose what existing opencode projects to add to Discord, Remote-vibe will create a new channel for each project. Writing a message in that channel will start a new opencode session

Remote-vibe will store the bot state in a local sqlite database. You should keep the remote-vibe cli running to be able to communicate to it via Discord

## Usage

```bash
cd discord
pnpm install
pnpm dev
```

The cli will ask you for

- Discord bot app id and token
- What opencode projects add to Discord
- Gemini API key for audio transcriptions and voice channels interaction
- Mistral API key for Voxtral audio translation

Remote-vibe requires you to create a new Discord bot for each new computer you will install remote-vibe in. You can create as many bots as you want, then install each bot in spare machines to be able to control these machines via Discord. Each Discord channel will be associated with a specific machine and project directory.

## Best Practices

- **Set notifications to mentions only** - This way you won't be spammed with notifications during a session. When a session finishes, the bot adds a ✅ reaction to your initial message (or ❌ on error), so you can check the thread at your convenience.

- **Send long messages as files** - Discord has a character limit for free users. To send longer prompts, tap the plus icon in Discord and use "Send message as file". File attachments don't count towards the message limit and Remote-vibe will read the file content as your prompt.

- **Permissions** - Only users with specific Discord permissions can interact with the bot. Other users' messages are ignored. Allowed:
  - Server Owner
  - Administrator
  - Manage Server
  - "Remote-vibe" role (case-insensitive) - create a role named "Remote-vibe" and assign it to trusted users

## Changing the Model

To change the model used by OpenCode, edit the project's `opencode.json` config file and set the `model` field:

```json
{
  "model": "mistral/devstral-medium-latest"
}
```

Examples:
- `"mistral/devstral-medium-latest"` - Mistral Devstral 2 Medium (default)
- `"anthropic/claude-sonnet-4-20250514"` - Claude Sonnet 4
- `"anthropic/claude-opus-4-20250514"` - Claude Opus 4
- `"openai/gpt-4o"` - GPT-4o
- `"google/gemini-2.5-pro"` - Gemini 2.5 Pro

Format is `provider/model-name`. You can also set `small_model` for tasks like title generation.
