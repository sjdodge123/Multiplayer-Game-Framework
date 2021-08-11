'use strict';
var utils = require('./utils.js');
var c = utils.loadConfig();

var listItem = null;
var player = null;
var prop = null;

exports.sendPlayerUpdates = function(playerList){
	var packet = [];
	for(prop in playerList){
		player = playerList[prop];
		listItem = [
			player.id,
			player.x,
			player.y,
			//player.weapon.angle,
			player.velX,
			player.velY,
		];
		packet.push(listItem);
	}
	packet = JSON.stringify(packet);
	player = null;
	listItem = null;
	prop = null;
	return packet;
}
exports.worldResize = function(world){
	var packet = [];
	packet[0] = world.x;
	packet[1] = world.y;
	packet[2] = world.width;
	packet[3] = world.height;

	packet = JSON.stringify(packet);
	return packet;
}
exports.playerSpawns = function(playerList){
	var packet = [];
	for(prop in playerList){
		player = playerList[prop];
		listItem = [
			player.id,
			player.x,
			player.y,
			player.color
			//player.weapon.angle,
			//player.weapon.name,
		];
		packet.push(listItem);
	}
	packet = JSON.stringify(packet);
	player = null;
	listItem = null;
	prop = null;
	return packet;
}
exports.appendPlayer = function(player){
	var packet = [];
	packet[0] = player.id;
	packet[1] = player.x;
	packet[2] = player.y;
	packet[3] = player.color;
	//packet[4] = player.weapon.angle;
	//packet[5] = player.weapon.name;
	//packet[6] = player.weapon.level;
	//packet[7] = player.weapon.powerCost;
	packet = JSON.stringify(packet);
	player = null;
	listItem = null;
	prop = null;
	return packet;
}