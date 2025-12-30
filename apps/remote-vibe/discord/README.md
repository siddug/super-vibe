# Super Vibe Discord Bot

A Discord bot that integrates OpenCode coding sessions with Discord channels and voice.

## Development Setup

1. Clone and install dependencies:
```bash
cd apps/remote-vibe/discord
npm install
```

2. Copy the sample environment file and configure your API keys:
```bash
cp .env.example .env
```

Edit `.env` with your required API keys:
- **Discord Bot Token**: Get from https://discord.com/developers/applications
- **Mistral API Key**: Get from https://console.mistral.ai/api-keys (required for all AI features)

**Note**: Mistral is used for all AI functionality including the base model, real-time features, audio translation, and voice processing.

3. Run the bot:
```bash
npm run dev
```

## Production Setup

Run the interactive setup:

```bash
remote-vibe
```

This will guide you through:
1. Creating a Discord application at https://discord.com/developers/applications
2. Getting your bot token
3. Installing the bot to your Discord server
4. Creating channels for your OpenCode projects

## Commands

### Start the bot

```bash
remote-vibe
```

## Discord Slash Commands

Once the bot is running, you can use these commands in Discord:

- `/session <prompt>` - Start a new OpenCode session
- `/resume <session>` - Resume an existing session
- `/add-project <project>` - Add a new project to Discord
- `/accept` - Accept a permission request
- `/accept-always` - Accept and auto-approve similar requests
- `/reject` - Reject a permission request

## Voice Support

Join a voice channel that has an associated project directory, and the bot will join with Jarvis-like voice interaction powered by Gemini.

**Required for voice and AI features:**
- **Mistral API Key**: Required for all AI functionality including base model, real-time features, audio translation, and voice processing

This API key should be set in your `.env` file or provided during setup.
