/*--------------------------------------------------------*/
var PLAY = 1;
var END = 0;
var WIN = 2;
var gameState = PLAY;

var trex, trex_running, trex_collided;
var jungle, invisiblejungle;
var kangaroo, invisibleGround;

var obstaclesGroup, obstacle1;

var score=0;

var gameOver, restart;

function preload(){
  kangaroo_running =   loadAnimation("assets/kangaroo1.png","assets/kangaroo2.png","assets/kangaroo3.png");
  kangaroo_collided = loadAnimation("assets/kangaroo1.png");
  jungleImage = loadImage("assets/bg.png");
  shrub1 = loadImage("assets/shrub1.png");
  shrub2 = loadImage("assets/shrub2.png");
  shrub3 = loadImage("assets/shrub3.png");
  obstacle1 = loadImage("assets/stone.png");
  gameOverImg = loadImage("assets/gameOver.png");
  restartImg = loadImage("assets/restart.png");
  jumpSound = loadSound("assets/jump.wav");
  collidedSound = loadSound("assets/collided.wav");
}

function setup() {
  createCanvas(800, 400);

  jungle = createSprite(400,100,400,20);
  jungle.addImage("jungle",jungleImage);
  jungle.scale=0.3
  jungle.x = width /2;

  kangaroo = createSprite(150,280,20,20);
  kangaroo.addAnimation("running",kangaroo_running);
  kangaroo.addAnimation("collided",kangaroo_collided);
  kangaroo.scale = 0.16;
  kangaroo.setCollider("circle",20,20,20);
  kangaroo.colliderRadius = 300;

  invisibleGround = createSprite(400,305,800,100);
  invisibleGround.visible = false;
  

  shrubsGroup = new Group();
  obstaclesGroup = new Group();
  
  score = 0;

}

function draw() {
  background(255);
  
  kangaroo.x = camera.position.x - 270; 
  kangaroo.collide(invisibleGround);

  if(gameState === PLAY){
    jungle.velocityX = -3;

    if(jungle.x < 0){
      jungle.x = jungle.width/10;
    }
    if(keyDown("space") && kangaroo.y > 245){
      kangaroo.velocityY = -18;
      jumpSound.play();
    }
    kangaroo.velocityY = kangaroo.velocityY + 1;

    spawnShrubs();
   spawnObstacles();

   if(shrubsGroup.isTouching(kangaroo)){
    score = score + 1;
    shrubsGroup.destroyEach();
  }
  if(obstaclesGroup.isTouching(kangaroo))
   gameState = END;
  }

  if(gameState === END){
    var gameOver = createSprite(400,150,20,20);
    gameOver.addImage(gameOverImg);

    var restart = createSprite(400,210,20,20);
    restart.addImage(restartImg);
    restart.scale = 0.1;

    kangaroo.velocityY = 0;
    kangaroo.changeAnimation("collided",kangaroo_collided);
    shrubsGroup.setVelocityXEach(0);
    obstaclesGroup.setVelocityXEach(0);

    jungle.velocityX = 0;

  }

  drawSprites();

}

function spawnShrubs(){
  if(frameCount%150 === 0){

    var shrub = createSprite(camera.position.x+500,280,40,10);
    shrub.velocityX = shrub.velocityX - 7;
    shrub.scale = 0.08;

    var rando = Math.round(random(1,3));
    switch(rando) {
      case 1: shrub.addImage(shrub1);
              break;
      case 2: shrub.addImage(shrub2);
              break;
      case 3: shrub.addImage(shrub3);
              break;
      default: break;
    }
    shrubsGroup.add(shrub);
  }
}

function spawnObstacles(){
  if(frameCount%110 === 0){

    var obstacle = createSprite(camera.position.x+500,290,40,10);
   obstacle.addImage(obstacle1);
   obstacle.velocityX = obstacle.velocity.x -7;
   obstaclesGroup.add(obstacle); 
   
   obstacle.scale = 0.15;
  }
}

