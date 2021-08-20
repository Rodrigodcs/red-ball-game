
const screenWidth = window.innerWidth;
const screenHeight = window.innerHeight;
const scoreUI = document.querySelector(".score")


const canvas = document.querySelector("#canvas");
canvas.width = screenWidth;
canvas.height = screenHeight;
const context = canvas.getContext("2d");

let intervalId;

let time = 0;
let score = 0

let gameEnded=false;

let player = {
  x: screenWidth / 2,
  y: screenHeight / 2,
  radius: 100,
  color: "red",
};

let enemies = [{x: 0, y: 0, radius: 30, color: "blue", speedX: 5, speedY: 5}];
let food = {x: screenWidth+30, y: screenHeight+30, radius: 30, color: "green", speedX: 5, speedY: 5};

function enemyCreator(){
  let x=15;
  let y=15;
  const randomizer= Math.random()
  if(randomizer<0.25){
    y=Math.random()*screenHeight-15
  }else if(randomizer<0.5){
    y=Math.random()*screenHeight-15
    x=screenWidth-15
  }else if(randomizer<0.75){
    x=Math.random()*screenWidth-15
  }else{
    x=Math.random()*screenWidth-15
    y=screenHeight-15
  }
  return {x , y , radius: 30, color: "blue", speedX: (Math.random()-0.5)*10, speedY: (Math.random()-0.5)*10}
}

function generateNewFood(){
  let x=0;
  let y=0;
  let speedX=0
  let speedY=0
  const randomizer =Math.random();
  if(randomizer<0.25){
    y=Math.random()*((screenHeight-15)/2)+screenHeight/4
    speedX=5
    speedY=Math.random()*2.5
  }else if(randomizer<0.5){
    y=Math.random()*((screenHeight-15)/2)+screenHeight/4
    x=screenWidth
    speedX=-5
    speedY=-Math.random()*2.5
  }else if(randomizer<0.75){
    x=Math.random()*((screenWidth-15)/2)+screenWidth/4
    y=screenHeight
    speedX=-Math.random()*2.5
    speedY=-5
  }else{
    x=Math.random()*((screenWidth-15)/2)+screenWidth/4
    speedX=Math.random()*2.5
    speedY=5
  }
  food = {x, y, radius: 30, color: "green", speedX, speedY};
}

function drawEnemies() {
  enemies.forEach(e=>{
    drawCircle(e.x, e.y, e.radius, e.color);
  })
}

function drawFood() {
  drawCircle(food.x, food.y, food.radius, food.color);
}

function onMouseMove(event) {
  player.x = event.clientX;
  player.y = event.clientY;
}

function drawCircle(x, y, radius, color) {
  context.beginPath();
  context.fillStyle = color;
  context.arc(x, y, radius, 0, 2 * Math.PI);
  context.fill();
}

function clearScreen() {
  context.clearRect(0, 0, canvas.width, canvas.height);
}

function drawPlayer() {
  drawCircle(player.x, player.y, player.radius, player.color);
}

function moveEnemies() {
  enemies.forEach(enemy=>{
    enemy.x += enemy.speedX;
    enemy.y += enemy.speedY;
  })
}

function moveFood(){
  food.x += food.speedX;
  food.y += food.speedY;
}

function checkEnemyCollision() {
  let colision = false
  enemies.forEach(enemy=>{
    const distance = Math.sqrt(
      (player.x - enemy.x) ** 2 + (player.y - enemy.y) ** 2
    );
    const colided = distance < player.radius + enemy.radius;
    if(colided === true){
      
      colision = true
    }
  })
  return colision
}

function checkFoodCollision(){
  const distance = Math.sqrt(
    (player.x - food.x) ** 2 + (player.y - food.y) ** 2
  );
  return distance < player.radius + food.radius
}

function foodCollided(){
  score+=10
  food.x=food.speedX*1000
  food.y=food.speedY*1000
  updateScore()
}

function bounceEnemiesOnEdge() {
  enemies.forEach(enemy=>{
    if (enemy.x < 0 || enemy.x > screenWidth-enemy.radius/2) {
      enemy.speedX *= -1;
    }

    if (enemy.y < 0 || enemy.y > screenHeight-enemy.radius/2) {
      enemy.speedY *= -1;
    }
  })
}

function checkFood(){
  if (food.x < 0 || food.x > screenWidth ||food.y < 0 || food.y > screenHeight) {
    return true
  }
  return false;
}

function increaseEnemiesSpeed() {
  enemies.forEach(enemy=>{
    enemy.speedX *= 1.001;
    enemy.speedY *= 1.001;
  })
}

function endGame() {
  gameEnded=true;
  console.log("Fim do jogo!",score);
  score=0;
  clearInterval(intervalId);
}

function newGame(){
  if(gameEnded){
    gameEnded=false
    startGame()
  }
}

function startGame() {
  player.x = screenWidth / 2;
  player.y = screenHeight / 2;

  enemies = [{x: 0, y: 0, radius: 30, color: "blue", speedX: 5, speedY: 5}];
  
  clearInterval(intervalId);
  intervalId = setInterval(gameLoop, 1000 / 60);
}

function checkTime(){
  time++;
  if(time===60){
    score++
    time=0
    updateScore()
  }
}

function updateScore(){
  scoreUI.innerHTML="Score: "+score
}

function gameLoop() {
  clearScreen();
  moveEnemies();
  moveFood()
  
  if (checkEnemyCollision()) {
    endGame();
  }
  if (checkFoodCollision()){
    foodCollided();
  }

  bounceEnemiesOnEdge();

  drawPlayer();
  drawEnemies();
  drawFood();

  if(Math.random()<0.01 && checkFood()){
    generateNewFood()
  }

  if(Math.random()<0.05){
    const newEnemy = enemyCreator()
    enemies.push(newEnemy)
  }
  
  checkTime()
}

startGame();
   