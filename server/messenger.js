var utils = require('./utils.js');
var hostess = require('./hostess.js');
var c = utils.loadConfig();
var compressor = require('./compressor.js');
var mailBoxList = {},
	roomMailList = {},
	io;

exports.build = function(mainIO){
    io = mainIO;
}
exports.addMailBox = function(id,client){
	mailBoxList[id] = client;
	checkForMail(mailBoxList[id]);
}
exports.removeMailBox = function(id){
	delete mailBoxList[id];
}
exports.addRoomToMailBox = function(id,roomSig){
	roomMailList[id] = roomSig;
}
exports.removeRoomMailBox = function(id){
	delete roomMailList[id];
}
exports.getClient = function(id){
	return mailBoxList[id];
}
exports.messageRoomBySig = function(sig,header,payload){
	messageRoomBySig(sig,header,payload);
}
exports.getTotalPlayers = function(){
	var count = 0;
	for(var box in mailBoxList){
		count++;
	}
	return count;
}

function checkForMail(client){
    client.emit("welcome",client.id);

    client.on('enterGame', function(){
        var roomSig = hostess.findARoom(client.id);
		var room = hostess.joinARoom(roomSig,client.id);

		//Add this player to the list of current clients in the room
		room.clientList[client.id] = client.id;

		//Spawn a player for the new player
		room.playerList[client.id] = room.world.spawnNewPlayer(client.id);

		//Send the current gamestate to the new player
		var worldData = compressor.worldResize(room.world);
		var playerData = compressor.playerSpawns(room.playerList);
		var gameState = {
			clientList:room.clientList,
			playerList:playerData,
			config:c,
			myID:client.id,
			world:worldData,
			maxLobbyTime:c.lobbyWaitTime
		};
		client.emit("gameState" , gameState);

		//Update all existing players with the new player's info
		var appendPlayerData = compressor.appendPlayer(room.playerList[client.id]);
		var appendPlayerList = {
			id:client.id,
			player:appendPlayerData
		};
		client.broadcast.to(String(roomSig)).emit("playerJoin",appendPlayerList);
    });

	client.on('playerLeaveRoom',function(){
		hostess.kickFromRoom(client.id);
	});

	client.on('movement',function(packet){
		var room = hostess.getRoomBySig(roomMailList[client.id]);
		if(room == undefined){
			return;
		}
		var player = room.playerList[client.id];
		if(player != null){
			if(player.enabled){
				player.moveForward = packet.moveForward;
				player.moveBackward = packet.moveBackward;
				player.turnLeft = packet.turnLeft;
				player.turnRight = packet.turnRight;
			}
		}
	});


}


function messageRoomBySig(sig,header,payload){
	io.to(String(sig)).emit(header,payload);
}