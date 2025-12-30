// Manual command registration script
import { REST, Routes, SlashCommandBuilder } from 'discord.js'
import { createLogger } from '../src/logger.js'

const logger = createLogger('COMMAND-REGISTER')

async function registerCommands(token: string, appId: string) {
  const commands = [
    new SlashCommandBuilder()
      .setName('resume')
      .setDescription('Resume an existing OpenCode session')
      .addStringOption((option) => {
        option
          .setName('session')
          .setDescription('The session to resume')
          .setRequired(true)
          .setAutocomplete(true)
        return option
      })
      .toJSON(),
    new SlashCommandBuilder()
      .setName('session')
      .setDescription('Start a new OpenCode session')
      .addStringOption((option) => {
        option
          .setName('prompt')
          .setDescription('Prompt content for the session')
          .setRequired(true)
        return option
      })
      .addStringOption((option) => {
        option
          .setName('files')
          .setDescription(
            'Files to mention (comma or space separated; autocomplete)',
          )
          .setAutocomplete(true)
          .setMaxLength(6000)
        return option
      })
      .toJSON(),
    new SlashCommandBuilder()
      .setName('add-project')
      .setDescription('Create Discord channels for a new OpenCode project')
      .addStringOption((option) => {
        option
          .setName('project')
          .setDescription('Select an OpenCode project')
          .setRequired(true)
          .setAutocomplete(true)
        return option
      })
      .toJSON(),
    new SlashCommandBuilder()
      .setName('create-new-project')
      .setDescription('Create a new project folder, initialize git, and start a session')
      .addStringOption((option) => {
        option
          .setName('name')
          .setDescription('Name for the new project folder')
          .setRequired(true)
        return option
      })
      .toJSON(),
    new SlashCommandBuilder()
      .setName('add-existing-project')
      .setDescription('Add an existing project folder and start a session (skips git init if already exists)')
      .addStringOption((option) => {
        option
          .setName('path')
          .setDescription('Path to existing project folder')
          .setRequired(true)
        return option
      })
      .toJSON(),
    new SlashCommandBuilder()
      .setName('accept')
      .setDescription('Accept a pending permission request (this request only)')
      .toJSON(),
    new SlashCommandBuilder()
      .setName('accept-always')
      .setDescription('Accept and auto-approve future requests matching this pattern')
      .toJSON(),
    new SlashCommandBuilder()
      .setName('reject')
      .setDescription('Reject a pending permission request')
      .toJSON(),
    new SlashCommandBuilder()
      .setName('abort')
      .setDescription('Abort the current OpenCode request in this thread')
      .toJSON(),
    new SlashCommandBuilder()
      .setName('share')
      .setDescription('Share the current session as a public URL')
      .toJSON(),
  ]

  const rest = new REST().setToken(token)

  try {
    logger.log(`Registering ${commands.length} slash commands...`)
    const data = (await rest.put(Routes.applicationCommands(appId), {
      body: commands,
    })) as any[]

    logger.log(`Successfully registered ${data.length} slash commands`)
    console.log('✅ Commands registered successfully!')
    console.log('New commands will be available in Discord after a restart.')
    return data
  } catch (error) {
    logger.error(
      'Failed to register slash commands: ' + String(error),
    )
    console.error('❌ Failed to register commands:', error)
    throw error
  }
}

// Get token and appId from environment or prompt
async function main() {
  // Try to get from environment first
  let token = process.env.DISCORD_TOKEN
  let appId = process.env.DISCORD_APP_ID

  if (!token || !appId) {
    // Try to get from database
    try {
      const { getDatabase } = await import('../src/discordBot.js')
      const db = getDatabase()
      const botRow = db
        .prepare(
          'SELECT app_id, token FROM bot_tokens ORDER BY created_at DESC LIMIT 1',
        )
        .get() as { app_id: string; token: string } | undefined

      if (botRow) {
        appId = botRow.app_id
        token = botRow.token
        console.log('Using credentials from database')
      }
    } catch (error) {
      console.log('Could not get credentials from database:', error)
    }
  }

  if (!token || !appId) {
    console.error('❌ Discord token and app ID are required')
    console.error('Set DISCORD_TOKEN and DISCORD_APP_ID environment variables')
    console.error('Or run the bot setup first to save credentials')
    process.exit(1)
  }

  try {
    await registerCommands(token, appId)
  } catch (error) {
    process.exit(1)
  }
}

main()