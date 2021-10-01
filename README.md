<p align="center"><a href="https://nodei.co/npm/discord-auto-role/"><img src="https://nodei.co/npm/discord-auto-role.png"></a></p>

# discord-auto-role
An extremely simple Discord.js Module that allow discord member to assign and remove themself role by using the bot

## Installation
This module assumes you already have a basic [Discord.js](https://discord.js.org/#/) bot setup.
Simply type the following command to install the module and it depedencies.
```
npm i discord-auto-role
``` 

##Discord.js v11 and v12 compatibility 
You can install DiscordJS v11 and v12 version using tag.  These aren't maintained anymore.
V11: `npm install discord-auto-role@discord.js-v11`  
V12: `npm install discord-auto-role@discord.js-v12`  

Once you've done this, setting the module will be very easy.
And you can follow the code  below to get started!

###Single-Server Usage (no server ID required in the configuration)
```js
const AutoRole = require("discord-auto-role");

AutoRole(bot, {
		"prefix" : "!",
		"roles" : 
		{
			"australia" : "Australia",
			"austria" : "Austria"
		},
		"helpcmd" :  "location",
		"msg" : "Please use one of the following command to assign or remove the desired group:",
		"prunetimer" : "30000" 
});
```
###Multi-Servers Usage 

```js
const AutoRole = require("discord-streaming");

AutoRole(bot, {
	"serverid1" : {
		"prefix" : "!",
		"roles" : 
		{
			"australia" : "Australia",
			"austria" : "Austria"
		},
		"helpcmd" :  "location",
		"msg" : "Please use one of the following command to assign or remove the desired group:",
		"prunetimer" : "30000" 
	},
	"serverid2" : {
		"prefix" : "!",
		"roles" : 
		{
			"tomato" : "Tomato Group",
			"potato" : "potatogroupid",
		},
		"helpcmd" :  "location",
		"msg" : "Please use one of the following command to assign or remove the desired group:",
		"prunetimer" : "30000" 
	}
});
```

##Caveat:
-If you take actions on roles that have duplicate name, the module might get confused  
-Multi-Servers configuration require to know Server ID  
-There is no custom feedback message, configuration option to be added  
-The bot automatically remove command after 3000ms, configuration option to be added  

###English:
This module was initialy coded for the Bucherons.ca gamers community, the Star Citizen Organization "Gardiens du LYS", Bar Citizen Coordinators and Bar Citizen Montreal Discord Servers.

###Français:
Ce module a initiallement été conçu pour la communauté de gamers Bucherons.ca, la communauté gaming pour adultes au Québec, l'organisation des Gardiens du LYS dans Star Citizen, les serveurs Discord de Bar Citizen Coordinators et Bar Citizen Montreal
  
Liens:  https://www.bucherons.ca, https://www.gardiensdulys.com, https://www.barcitizen.sc, https://www.barcitizenmtl.com

##Support:
You can reach me via my Discord Development Server at https://discord.gg/Tmtjkwz

###History:  
3.0.2 Initial v13 Version
2.0.0 Initial v12 Version  
1.3.0 Latest Discord.JS v11 version, use "npm i discord-auto-role@discord.js-v11" to install  
1.0.0 Initial publish  