/*

Simple Discord.js v13 Module that allow discord member to assign and remove themself role by using the bot
Author: Flisher (andre@jmle.net)

*/

module.exports = function (client, options) {
	const description = {
		name: `discord-auto-role`,
		filename: `discord-auto-role.js`,
		version: `3.0.1`
	}

	const debug = true
	console.log(`Module: ${description.name} | Loaded - version ${description.version} from ("${description.filename}")`)
	const DiscordJSversion = require("discord.js").version.substring(0, 2)

	if (DiscordJSversion === '11') console.error("This version of discord-auto-role only run on DiscordJS V13 and up, please run \"npm i discord-playing@discord.js-v11\" to install an older version")
	if (DiscordJSversion === '12') console.error("This version of discord-auto-role only run on DiscordJS V13 and up, please run \"npm i discord-playing@discord.js-v12\" to install an older version")
	if (DiscordJSversion !== '13') return

	// Check that required Gateway Intention
	const {
		Intents
	} = require('discord.js');
	const liveIntent = new Intents(client.options.intents)
	const requiredIntent = ['GUILDS', 'GUILD_MEMBERS', 'GUILD_MESSAGES']
	const gotAllIntent = liveIntent.has(requiredIntent)

	if (gotAllIntent) {
	// Continue
	} else {
		console.log(`Module: ${description.name} | Version ${description.version} NOT initialized due to the following reasons ")`)
		for (let i in requiredIntent) {
			let checkedIntent = requiredIntent[i]
			if (!liveIntent.has(requiredIntent[i])) {
				console.log(`Module: ${description.name} | Missing Gateway Intent ${requiredIntent[i]}`)
			}
		}
	}

	client.on("messageCreate", async message => {
		if (debug) console.log(`Module: ${description.name} | DEBUG | messageCreate triggered`)

		// do not take action on bots
		if (message.author.bot) return;

		if (!message.channel.isText()) return;
		
		var modconf
		// Validate single or multi-server configuration
		if (options && options.prefix) {
			// Single Server Configuration
			modconf = options;
		} else {
			// Multi-Servers Configuration
			modconf = options[message.guild.id];
		}
		if (modconf && modconf.prefix) {
			// If the confugration is loaded
			if (!message.content.startsWith(modconf.prefix)) return
			if (message.channel.name == undefined) return

			let command = message.content.split(" ")[0].slice(1);
			let args = message.content.split(" ").slice(1);
			let tobedeleted = false;
			// check for helpcmd
			if (command == modconf.helpcmd) {
				let msg = "";
				for (let role in modconf.roles) {
					msg = msg + `\n${modconf.prefix}${role} -> ${modconf.roles[role]}`
				}
				msg = `${modconf.msg} (requested by <@${message.author.id}>)\n\`\`\`-${msg}\`\`\``
				tobedeleted = true;
				if (modconf.prunetimer && modconf.prunetimer > 0) {
					try {
						message.channel.send(msg).then(m => {
							try {
								setTimeout(() => m.delete(), modconf.prunetimer);
							} catch (e) {
								console.error(`Module: ${description.name} -> Error while deleting instruction message): \n ${e}`);
								console.error(e)
							}
						})
					} catch (e) {
						console.error(`Module: ${description.name} -> Error while sending instruction message with pruning delay): \n ${e}`);
						console.error(e)
					}
				} else {
					try {
						message.channel.send(msg)
					} catch (e) {
						console.error(`Module: ${description.name} -> Error while sending instruction message without pruning delay): \n ${e}`);
						console.error(e)
					}
				}

			}

			// Check for role assignment command
			let guild = message.guild;
			// If the bot can manage role
			for (let role in modconf.roles) {
				if (role === command) {
					tobedeleted = true;
					let tmpRole = modconf.roles[command];

					tmpRole = guild.roles.cache.find(val => val.name === tmpRole) || guild.roles.get(tmpRole)

					let roleid = tmpRole.id
					let memberHasRole = message.member.roles.cache.find(val => val.id === roleid)
					let resolvableRole = message.guild.roles.cache.find(val => val.id === roleid)
					if (memberHasRole) {
						try {
							await message.member.roles.remove(resolvableRole)
						} catch (e) {
							console.error(`Module: ${description.name} -> Error while removing Role): \n ${e}`);
							console.error(e)
						}
						try {
							message.channel.send(`Role "${tmpRole.name}" has been removed from ${message.member.user}`);
						} catch (e) {
							console.error(`Module: ${description.name} -> Error while sending message after removing  Role): \n ${e}`);
							console.error(e)
						}
					} else {
						try {
							await message.member.roles.add(resolvableRole)
						} catch (e) {
							console.error(`Module: ${description.name} -> Error while adding Role): \n ${e}`);
							console.error(e)
						}
						try {
							message.channel.send(`Role "${tmpRole.name}" has been added to ${message.member.user}`);
						} catch (e) {
							console.error(`Module: ${description.name} -> Error while sending message after adding Role): \n ${e}`);
							console.error(e)
						}
					}
				}
			}

			// cleanup the request message if it was treated
			if (tobedeleted === true) {
				try {
					setTimeout(() => message.delete(), 3000);
				} catch (e) {
					console.error(`Module: ${description.name} -> Error while deleting user command message): \n ${e}`);
					console.error(e)
				}
			}

		} else {
			// console.log(`Configuration not found for Server "${message.guild.name}" (${message.guild.id})`);
		}
	});
}