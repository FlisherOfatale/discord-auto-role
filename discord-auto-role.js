/*

Simple Discord.js v12 Module that allow discord member to assign and remove themself role by using the bot
Author: Flisher (andre@jmle.net)

2.0.0 Initial v12 Version  
1.3.0 Latest Discord.JS v11 version, use "npm i discord-auto-role@discord.js-v11" to install  
1.0.0 Initial publish  

*/

module.exports = function (bot, options) {
	const description = {
		name: `discord-auto-role`,
		filename: `discord-auto-role.js`,
		version: `2.0.0`
	}

	console.log(`Module: ${description.name} | Loaded version ${description.version} from ("${description.filename}")`)

	// Check if version is 12, if not, abort
	let DiscordJSversion = require('discord.js').version
	if (DiscordJSversion.substring(0, 2) !== "12") console.error(`This version of discord-auto-role only run on DiscordJS v12 and up, please run "npm install discord-auto-role@discord.js-v11" to install an DiscordJS v11`)
	if (DiscordJSversion.substring(0, 2) !== "12") return

	bot.on("message", async message => {

		// do not take action on bots
		if (message.author.bot) return;
		if (message.channel.type !== "text") return;
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
								m.delete({
									"timeout": modconf.prunetimer
								})
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
					message.delete({
						timeout: 3000
					})
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