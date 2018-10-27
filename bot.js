var Discord = require('discord.io');
var logger = require('winston');
var auth = require('./auth.json');
// Configure logger settings
logger.remove(logger.transports.Console);
logger.add(logger.transports.Console, {
    colorize: true
});
logger.level = 'debug';
// Initialize Discord Bot
var bot = new Discord.Client({
   token: auth.token,
   autorun: true
});
bot.on('ready', function (evt) {
    logger.info('Connected');
    logger.info('Logged in as: ');
    logger.info(bot.username + ' - (' + bot.id + ')');
});

var tabChance = ['C', 'C', 'M', 'M'] ;

function roll(user, type) {
    if(isNaN(type)) {
        return "Valeur non valide --> Usage : 'd valeur_entiere' "
    }
    var nb = Math.ceil(Math.random() * (type))
    var crit = ''
        if(type === 100) {
            if(nb <= 5)  {
                crit = " c'est une réussite critique !"
            } else if (nb >= 95) {
                crit = " c'est un echec critique !"
            }
        }
        if(nb > type) {
            nb--;
        }
        return '' + user + ' a fait ' + nb + ' avec le d' + type + ' ' + crit
}

function print1DimTab(tab) {
	var message = '[ '
	for (var i = 0; i < tab.length ; i++) {
		if(tab[i] != tab[i-1] && i >=1) {
			message += ' | '
		}
		message += tab[i]
	}
	message += ' ]'
	return message
}

function useChance(tabChance) {
	var add = true;
	for (var i = 0 ; i < tabChance.length ; i++) {
		if((tabChance[i] === 'C' && add)) {
			tabChance[i] = 'M'
			add = false
		}
	}
	tabChance.sort()
}

function addChance(tabChance) {
	var add = true;
	for (var i = 0 ; i < tabChance.length ; i++) {
		if((tabChance[i] === 'M' && add)) {
			tabChance[i] = 'C'
			add = false
		}
	}
	tabChance.sort()
}

bot.on("message", function (user, userID, channelID, message, evt) {
    // Our bot needs to know if it will execute a command
    // It will listen for messages that will start with `!`
    if (message.substring(0, 1) == '!') {
        var args = message.substring(1).split(' ');
        var cmd = args[0];        
        args = args.splice(1);

        switch(cmd) {
            // !info
            case "info":
                bot.sendMessage({
                    to: channelID,
                    message: " Ce bot réalise des lancés de dés \n Tape !d suivi d'un espace et de la valeur souhaitée et ça roule (!commandes pour toutes les regarder) \n Exemple : !d 4"                     
                });
                break;
             // !info_mj
            case "info_mj":
                bot.sendMessage({
                    to: channelID,
                    message: " Ce bot réalise des lancés de d4 d6 d8 et d100 et dit hello que pour toi Smair <3 \n Tape !d suivi de la valeur souhaité et ça roule \n Exemple : !d4"                     
                });
                break;
            // !commandes
            case "commandes":
                bot.sendMessage({
                    to: channelID,
                    message: " Liste des commandes : \n - !info : Description du bot \n - !d4 : Pour lancer un dé 4 \n - !d6 : Pour lancer un dé 6 \n - !d100 : Pour lancer un dé 100 \n - !hello : ça mange pas de pain \n - !hello_everybody : ça mange pas de pain non plus \n - !chance : Pour voir l'état des dés de Chance/Malchance (Reset quand le bot se déco) \n - !chance_use : Pour utiliser un dé de Chance \n - !chance_add : Pour ajouter un dé de Chance \n"             
                });
                break;
            // !d type
            case "d": 
                bot.sendMessage({
                    to: channelID,
                    message: roll(user, message.substring(3).split(' '))   
                });
                break;
            // !d4
            case "d4": 
                bot.sendMessage({
                    to: channelID,
                    message: roll(user, 4)   
                });
                break;
            // !d6
            case 'd6':
                bot.sendMessage({
                    to: channelID,
                    message: roll(user, 6)
                });
                break;
                        case 'd8':
                bot.sendMessage({
                    to: channelID,
                    message: roll(user, 8) 
                });
                break;
            // !d100
            case 'd100':                
                bot.sendMessage({
                    to: channelID,
                    message: roll(user, 100)         
                });
                break;
            // !chance
            case 'chance':                
                bot.sendMessage({
                    to: channelID,
                    message: print1DimTab(tabChance)                 
                });
                break;
            // !chance_use
            case 'chance_use':  
            	useChance(tabChance)              
                bot.sendMessage({
                    to: channelID,
                    message: print1DimTab(tabChance)                
                });
                break;
            // !chance_add
            case 'chance_add':  
            	addChance(tabChance)            	            
                bot.sendMessage({
                    to: channelID,
                    message: print1DimTab(tabChance)                
                });
                break;
            // !hello
            case "hello_everybody":                
                bot.sendMessage({
                    to: channelID,
                    message: 'Bonjour à tous !! Si vous ne savez pa ce que je fais, tapez !info ou !commandes !'                 
                });
                break;
            // !hello
            case "hello":                
                bot.sendMessage({
                    to: channelID,
                    message: 'Hello ' + user + ' :)'                 
                });
                break;

         }
     }
});