$(function() {
  var c=document.getElementById("myCanvas");
  var ctx=c.getContext("2d");
  var totalText = document.getElementById("total");
  //ctx.scale(20, 20);
  var width = c.width;
  var height = c.height;
  var grid = 10;
  var direction = 0;
  var enemyDirection = 1;
  var directionold = 0;
  var res = width / grid;
  var gravity = 0;
  var rand = Math.floor((Math.random() * 5));
  var keychangable = true;
  var x = (width / 2) - res;
  var counter = 1;
  var total = 0;
  var gameOver = false;
  var gameWin = false;
  var onceki = [];
  var pacmanOpen = true;
  var pacman = {x: 3, y: 2};
  var enemy = {x: 8, y: 6};
  var enemy2 = {x: 4, y: 5};
  var targetPoint = 0;
  //var randomenemy = {x: 12, y: 10};
  var enemies = [];
  var randomenemies = [];
  enemies.push(enemy);
  enemies.push(enemy2);
  //randomenemies.push(randomenemy);
  //var walls = [{x: 3, y:2}, {x: 3, y:3}];
  var board = [];
  for(var i = 0; i < grid; i++){
    var arr = [];
    for(var j = 0; j < grid; j ++){
      if(i === 0 || j === 0 || i === (grid -1) || j === (grid -1)){
        arr.push(2)
      }else{
        arr.push(0);
      }
    }
    board.push(arr);
  }

  createWalls();
  createWalls();
  createWalls();
  createWalls();
  generateFood();
  board[pacman.x][pacman.y] = 3;
  for(var i = 0; i < enemies.length; i++){
      board[enemies[i].x][enemies[i].y] = 4;
  }
  for(var k = 0; k < randomenemies.length; k++){
      board[randomenemies[k].x][randomenemies[k].y] = 4;
  }

  //console.table(board);
  document.addEventListener('keypress', function(e){
    if(keychangable){
      directionold = direction;
      if(e.keyCode === 119){//yukarı
        if(direction !== 3){
            direction = 1;
            keychangable = false;
        }

      }else if (e.keyCode === 100){//saga
        if(direction !== 4){
            direction = 2;
            keychangable = false;
        }

      }else if (e.keyCode === 115){//asagı
        if(direction !== 1){
            direction = 3;
            keychangable = false;
        }
      }else if (e.keyCode === 97 ){//sola
        if(direction !== 2){
            direction = 4;
            keychangable = false;
        }
      }
    }
})
function move(direction){
  if(direction === 1){//yukarı
    if(board[pacman.x][pacman.y -1] === 2){
      direction = 0;
    }else{
        board[pacman.x][pacman.y] = 0;
        pacman.y = pacman.y - 1;
        if(board[pacman.x][pacman.y] === 1){
          total = total+ 1;
        }
    }
  }else if (direction === 2){//saga
    if(board[pacman.x + 1][pacman.y] === 2){
      direction = 0;
    }else{
      board[pacman.x][pacman.y] = 0;
      pacman.x = pacman.x + 1;
      if(board[pacman.x][pacman.y] === 1){
        total = total+ 1;
      }
    }
  }else if (direction === 3){//asagı
    if(board[pacman.x][pacman.y +1] === 2){
      direction = 0;
    }else{
      board[pacman.x][pacman.y] = 0;
      pacman.y = pacman.y + 1;
      if(board[pacman.x][pacman.y] === 1){
        total = total+ 1;
      }
    }
  }else if (direction === 4){//sola
    if(board[pacman.x - 1][pacman.y] === 2){
      direction = 0;
    }else{
      board[pacman.x][pacman.y] = 0;
      pacman.x = pacman.x - 1;
      if(board[pacman.x][pacman.y] === 1){
        total = total+ 1;
      }
    }
  }
    board[pacman.x][pacman.y] = 3;

    totalText.innerHTML = total;

}
function enemyMove(){
  for(var i = 0; i < enemies.length; i++){
    var freepaths = getFreePaths(enemies[i]);
    console.log(Math.abs(enemies[i].x - pacman. x ))
    board[enemies[i].x][enemies[i].y] = onceki[i];
    console.log( Math.abs(enemies[i].y - pacman.y))
    if(Math.abs(enemies[i].x - pacman.x ) >= Math.abs(enemies[i].y - pacman.y)){// x farkı daha buyuk
      if(enemies[i].x < pacman.x){ // enemy saga gitmek istio
        if(freepaths[1] === 1){
          enemies[i].x +=1;
          console.log("enemy + x");
        }else{// sag dolu
          if(enemies[i].y < pacman.y){//enemy asagı gitmek istio
            if(freepaths[2] === 1){//asagı serbest
              enemies[i].y += 1;
                console.log("enemy + y");
            }else{//asagı serbest diil
              if(freepaths[0] === 1){// yukarı serbest
                  console.log("enemy - y");
                enemies[i].y -=1;// yukarı götür
              }else{//yukarı serbest diil sola götür
                console.log("enemy - x");
                enemies[i].x -=1;
              }
            }
          }else{//yukarı gitmek istio
            if(freepaths[0] === 1){
              enemies[i].y -=1;
            }else{//yukarı serbest diil
              if(freepaths[2] === 1){
                enemies[i].y += 1;
              }else{
                enemies[i].x -=1;
              }
            }
          }
        }
      }else{// enemy sola gitmek istio
        if(freepaths[3] === 1){// sol serbest
          enemies[i].x -=1;
        }else{//sol serbest diil
          if(enemies[i].y <= pacman.y){// asa gitmek istio
            if(freepaths[2] === 1){
              enemies[i].y += 1;
            }else{
              if(freepaths[0] === 1){
                enemies[i].y -=1;
              }else{
                enemies[i].x +=1;
              }
            }
          }
        }
      }
    }else{
      if(enemies[i].y < pacman.y){//enemy asa gitmek istio
        if(freepaths[2] === 1){
          enemies[i].y += 1;
        }else{//asagı dolu
          if(enemies[i].x < pacman.x){//enemy saga gitmek istio
            if(freepaths[1] === 1){//sag serbest
              enemies[i].x += 1;
            }
            else{//sag dolu
              if(freepaths[3] === 1){//sol serbest
                enemies[i].x -=1;
              }else{//yukarı cıkar
                enemies[i].y -=1;
              }
            }
          }else{// sola gitmek istio
            if(freepaths[3] === 1){
              enemies[i].x -=1;
            }else{//sol dolu
              enemies[i].y -=1;
            }
          }
        }
      }else if(enemies[i].y > pacman.y){//yukarı gitmek istio
        if(freepaths[0] === 1){//yukarı serbest
            enemies[i].y -= 1;
        }else{// yukarı serbest diil
          if(enemies[i].x < pacman.x){//saga gitmek istio
            if(freepaths[1] === 1){//sag serbest
              enemies[i].x += 1
            }else{
              if(freepaths[3] === 1){
                enemies[i].x -= 1;
              }else{
                enemies[i].y +=1;
              }
            }
          }else{// sola gitmek istio
            if(freepaths[3] === 1){
              enemies[i].x -= 1;
            }else{
              if(freepaths[1] === 1){
                enemies[i].x += 1;
              } else{
                enemies[i].y +=1;
              }
            }
          }
        }
      }else if(enemies[i].x < pacman.x){//enemy saga gitmek istio
        if(freepaths[1] === 1){
          enemies[i].x += 1;
        }else{
          if(freepaths[0] === 1){
            enemies[i].y -= 1;
          }else{
            if(freepaths[2] === 1){
              enemies[i].y += 1;
            }else{
              enemies[i].x -=1;
            }
          }
        }
      }else{//enemy sola gitmek istio
        if(freepaths[3] === 1){
          enemies[i].x -=1;
        }else{
          if(freepaths[0] === 1){
            enemies[i].y -=1;
          }else{
            if(freepaths[2] === 1){
              enemies[i].y +=1;
            }else{
              enemies[i].x +=1;
            }
          }
        }
      }
    }

    console.log(enemies[i].x +" - " + enemies[i].y);
    if(board[enemies[i].x][enemies[i].y] === 3){
      onceki[i] = 0;
    }else{
      onceki[i] = board[enemies[i].x][enemies[i].y];
    }
    board[enemies[i].x][enemies[i].y] = 4;
  }
}
function getFreePaths(enemy){
  var paths = [];
  if(board[enemy.x][enemy.y -1] !== 2){
    paths.push(1);
  }else{
    paths.push(0)
  }
  if(board[enemy.x + 1][enemy.y] !== 2){
    paths.push(1);
  }else{
    paths.push(0)
  }
  if(board[enemy.x][enemy.y + 1] !== 2){
    paths.push(1);
  }else{
    paths.push(0)
  }
  if(board[enemy.x - 1][enemy.y] !== 2){
    paths.push(1);
  }else{
    paths.push(0)
  }
  console.log(paths);
  return paths;
}
function drawBoard(){

  ctx.fillStyle="black";
  ctx.fillRect(0, 0, c.width, c.height);
  for(var k = 0; k < grid; k ++){
    for(var n = 0; n < grid; n++){

      if(board[k][n] === 0){
        ctx.fillStyle="black";
        ctx.fillRect((k * res), (n * res), res -80, res - 80);
      }else if(board[k][n] === 1){
        ctx.fillStyle="yellow";
        ctx.beginPath();
        ctx.arc((k * res) + res/2,(n * res) + res/2,4,0,2*Math.PI);
        ctx.fill();
      }else if(board[k][n] === 2){
        ctx.lineWidth=10;
        ctx.strokeStyle="rgb(0, 0, 153)";
        ctx.strokeRect((k * res), (n * res), res, res);
      }if(board[k][n] === 3){

        if(!pacmanOpen){
          ctx.fillStyle="yellow";
          ctx.beginPath();
          ctx.arc(( k* res) + res/2,(n * res) + res/2, 20, 0 * Math.PI, 2 * Math.PI, false);
          ctx.fillStyle = "rgb(255, 255, 0)";
          ctx.fill();
        }else{
          if(direction === 1){
            ctx.fillStyle="yellow";
            ctx.beginPath();
            ctx.arc(( k* res) + res/2,(n * res) + res/2, 20, 0.25 * Math.PI, 1.25 * Math.PI, false);
            ctx.fillStyle = "rgb(255, 255, 0)";
            ctx.fill();
            ctx.beginPath();
            ctx.arc((k * res) + res/2,(n * res) + res/2, 20, 1.75 * Math.PI, 0.75 * Math.PI, false);
            ctx.fill();
          }
          else if(direction === 2){
            ctx.fillStyle="yellow";
            ctx.beginPath();
            ctx.arc(( k* res) + res/2,(n * res) + res/2, 20, 0.25 * Math.PI, 1.25 * Math.PI, false);
            ctx.fillStyle = "rgb(255, 255, 0)";
            ctx.fill();
            ctx.beginPath();
            ctx.arc((k * res) + res/2,(n * res) + res/2, 20, 0.75 * Math.PI, 1.75 * Math.PI, false);
            ctx.fill();
          }
          else if(direction === 3){
            ctx.fillStyle="yellow";
            ctx.beginPath();
            ctx.arc(( k* res) + res/2,(n * res) + res/2, 20, 0.75 * Math.PI, 1.75 * Math.PI, false);
            ctx.fillStyle = "rgb(255, 255, 0)";
            ctx.fill();
            ctx.beginPath();
            ctx.arc((k * res) + res/2,(n * res) + res/2, 20, 1.25 * Math.PI, 0.25 * Math.PI, false);
            ctx.fill();
          }else if(direction === 4){
            ctx.fillStyle="yellow";
            ctx.beginPath();
            ctx.arc(( k* res) + res/2,(n * res) + res/2, 20, 1.75 * Math.PI, 0.75 * Math.PI, false);
            ctx.fillStyle = "rgb(255, 255, 0)";
            ctx.fill();
            ctx.beginPath();
            ctx.arc((k * res) + res/2,(n * res) + res/2, 20, 1.25 * Math.PI, 0.25 * Math.PI, false);
            ctx.fill();
          }
        }

      }else if(board[k][n] === 4){
        ctx.fillStyle="rgb(255, 153, 0)";
        ctx.fillRect((k * res)+10, (n * res) +10, res -20, res - 20);
      }
      // for(var m = 0; m < walls.length; m ++){
      //   if(walls[m].x === k && walls[m].y === n){
      //     ctx.fillStyle="red";
      //     ctx.fillRect((k * res), (n * res), res, res);
      //   }
      // }
    }
  }
}
function createWalls(){
  // var rand = Math.floor((Math.random() * (grid - 2)) + 2);
  // var randlen = Math.floor((Math.random() * (grid - 2)) + 2);
  // //console.log(rand);
  // for(var n = 2; n < randlen; n++){
  //   board[rand][n] = 2;
  // }
  // var rand1= Math.floor((Math.random() * (grid - 2)) + 2);
  // var randlen1 = Math.floor((Math.random() * (grid - 2)) + 2);
  // for(var n = 2; n < randlen1; n++){
  //   board[n][rand] = 2;
  // }
  for(var i = 2; i < grid -2; i ++){
    for(var j = 2; j < grid -2 ; j ++){
      if(i % 2 === 0 && j % 2 === 0){
        for(var k = 0; k < 2; k++){
            board[i][j + k] = 2;
        }

      }
    }
  }
}
function generateFood(){
  for(var i = 0; i < grid; i++){
    for(var k = 0; k < grid; k++){
      if(board[i][k] !== 2){
        board[i][k] = 1;
        targetPoint += 1;
      }
    }
  }
  console.log(targetPoint);
}
function enemyRandomMove(){

  for(var i = 0; i < enemies.length; i++){
     var rand = Math.floor((Math.random() * 4) + 1);
     var paths = getFreePaths(enemies[i]);
     //console.log(rand);
     board[enemies[i].x][enemies[i].y] = onceki[i];
     if(rand === 1 && paths[0] === 1){
       enemies[i].y -=1;
     }else if(rand === 2 && paths[1] === 1){
       enemies[i].x +=1;
     }else if(rand === 3 && paths[2] === 1){
       enemies[i].y +=1;
     }else if(rand === 4 && paths[3] === 1){
       enemies[i].x -=1;
     }

     onceki[i] = board[enemies[i].x][enemies[i].y];
     board[enemies[i].x][enemies[i].y] = 4;
  }

}
function checkdeath(){
  for(var i = 0; i < enemies.length; i++){
    //console.log(res);
    console.log(Math.abs(enemies[i].x - pacman.x));
    if(Math.abs(enemies[i].x - pacman.x) <= 0 && Math.abs(enemies[i].y - pacman.y) <=0 ){
      gameOver = true;
      drawBoard();
      ctx.lineWidth=2;
      ctx.strokeStyle="red";
      ctx.font = "100px Georgia";
      ctx.strokeText("KAYBETTİN",width/6,height/2);
      clearIntervals();
    }
    if(total === targetPoint - enemies.length){
      gameWin = true;
      drawBoard();
      ctx.lineWidth=2;
      ctx.strokeStyle="yellow";
      ctx.font = "100px Arial";
      ctx.strokeText("KAZANDIN",width/6,height/2);
      clearIntervals();
    }
  }
}
function clearIntervals(){
    clearInterval(enemyUpInt);
    clearInterval(updateInt);
    clearInterval(pacmanMoveInt);
    clearInterval(checkkeystrokeyInt);
    clearInterval(checkDeathInt);
}
  function updateEnemy(){
    var rand = Math.floor((Math.random() * 4) + 1);
    if(rand < 2){
      enemyRandomMove();
    }else{
        enemyMove();
    }
  }
  function update(){
    //var rand = Math.floor((Math.random() * 4) );
      move(direction)
      keychangable = true;
  }
  function checkkeystroke(){
    if(gameOver){
    }else{
      drawBoard();
    }
  }
  function pacmanmoveanimation(){
    pacmanOpen = !pacmanOpen;
  }
    var enemyUpInt = setInterval(updateEnemy, 600);
    var updateInt = setInterval(update, 300);
    var pacmanMoveInt = setInterval(pacmanmoveanimation, 150);
    var checkkeystrokeyInt = setInterval(checkkeystroke, 1000/60);
    var checkDeathInt =setInterval(checkdeath, 20);
});
