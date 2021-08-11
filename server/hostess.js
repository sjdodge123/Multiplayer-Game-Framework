var utils = require('./utils.js');
var c = utils.loadConfig();
var messenger = require('./messenger.js');
var game = require('./game.js');

var roomList = {},
	maxPlayersInRoom = c.maxPlayersInRoom;

exports.findARoom = function(clientID){
    if(getRoomCount() == 0){
        console.log("No rooms exist; Starting a new room");
        return generateNewRoom();
    }
    for(var sig2 in roomList){
        if(roomList[sig2].hasSpace()){
            return sig2;
        }
    }
    return generateNewRoom();
}
exports.kickFromRoom = function(clientID){
	var room = searchForRoom(clientID);
	if(room != undefined){
		room.leave(clientID);
	}
}
exports.joinARoom = function(sig,clientID){
	roomList[sig].join(clientID);
	return roomList[sig];
}
exports.updateRooms = function(dt){
	for(var sig in roomList){
		var room = roomList[sig];
		if(room == null){
			delete roomList[sig];
			continue;
		}
		if(!room.game.gameEnded){
			room.update(dt);
		} else if(room.alive){
			room.alive = false;
			messenger.messageRoomBySig(room.sig,"gameOver",room.game.winner);
			reclaimRoom(room.sig); //setTimeout(reclaimRoom,roomKickTimeout*1000,room.sig);
		}
	}
}
exports.getRoomBySig = function(sig){
	return roomList[sig];
}

function getRoomCount(){
	var count = 0;
	for(var sig in roomList){
		count++;
	}
	return count;
}
function searchForRoom(id){
	var room;
	for(var sig in roomList){
		if(roomList[sig].checkRoom(id)){
			room = roomList[sig];
		}
	}
	return room;
}

function generateRoomSig(){
	var sig = utils.getRandomInt(0,99);
	if(roomList[sig] == null || roomList[sig] == undefined){
		return sig;
	}
	sig = generateRoomSig();
}

function generateNewRoom(){
	var sig = generateRoomSig();
	roomList[sig] = game.getRoom(sig,maxPlayersInRoom);
	return sig;
}
    