var lastFrame = new Date();
var c = require('./config.json');
c.port =  process.env.PORT || c.port;

exports.getRandomInt = function(min,max){
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
};

exports.getColor = function(){
    return 'hsl(' + Math.floor(Math.random() * 360) + ', 100%, 50%)';
};

exports.getDT = function(){
	var currentFrame = new Date();
	var dt = currentFrame - lastFrame;
	lastFrame = currentFrame;
	return dt/1000;
}
exports.getMagSq = function(x1, y1, x2, y2){
	return Math.pow(x2-x1,2) + Math.pow(y2-y1, 2);
}

exports.getMag = function(x,y){
	return Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2));
}

exports.dotProduct = function(a, b){
    return a.x * b.x + a.y * b.y;
}


exports.loadConfig = function(){
    return c;
}
