function drawObjects(dt){
    drawBackground(dt);
    drawPlayers(dt);
}

function drawBackground() {
	gameContext.clearRect(0, 0, gameCanvas.width, gameCanvas.height);
}

function drawPlayers(dt){
    for(var id in playerList){
       var player = playerList[id];
       if(player == null){
           continue;
       }
       drawPlayer(player);
    }
}
function drawPlayer(player){
    gameContext.beginPath();
    gameContext.arc(player.x, player.y, player.radius, 0, 2 * Math.PI);
    gameContext.fillStyle = player.color;
    gameContext.fill();
    gameContext.lineWidth = 1.5;
    gameContext.strokeStyle = "black";
    gameContext.stroke();
}
