# restarting the discord bot

ONLY restart the discord bot if the user explicitly asks for it.

To restart the discord bot process so it uses the new code, send a SIGUSR2 signal to it.

1. Find the process ID (PID) of the remote-vibe discord bot (e.g., using `ps aux | grep remote-vibe` or searching for "remote-vibe" in process list).
2. Send the signal: `kill -SIGUSR2 <PID>`

The bot will wait 1000ms and then restart itself with the same arguments.
