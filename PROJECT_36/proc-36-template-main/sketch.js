var dog,sadDog,happyDog, database;
var foodS,foodStock;
var addFood;
var foodObj;
var feedDog,lastFed,fedT;


function preload(){
sadDog=loadImage("Dog.png");
happyDog=loadImage("happy dog.png");
}

function setup() {
  database=firebase.database();
  createCanvas(1000,400);

  foodObj = new Food();

  foodStock=database.ref('Food');
  foodStock.on("value",readStock);
  
  lastFed=database.ref('FeedTime')
  lastFed.on("value",lastFeeded);

  dog=createSprite(800,200,150,150);
  dog.addImage(sadDog);
  dog.scale=0.15;

  feedDog=createButton("Feed The Dog");
  feedDog.position(690,95);
  feedDog.mousePressed(feedtheDog);

  addFood=createButton("Add Food");
  addFood.position(800,95);
  addFood.mousePressed(addFoods);

}

function draw() {
  background(46,139,87);
  foodObj.display();

  textSize(16);
  fill("black");
  if(fedT>=12){
    text("Last Feed : "+fedT+"PM",300,30);
  } else if(fedT==0){
    text("Last Feed : 12 AM",300,30);
  } else {
    text("Last Feed : "+fedT+"AM",300,30);
  }
  if(fedT>=24){
    fedT = 0;
    database.ref('/').update({
      FeedTime:fedT
    })
  }

  if(foodS<=0){
    textSize(30)
    text("Out of Stock,Kindly add more food | Warning!Do Not 'feed the dog' now",15,100);
  }

  drawSprites();
}

function readStock(data){
  foodS=data.val();
  foodObj.updateFoodStock(foodS);
}


function feedtheDog(){
  dog.addImage(happyDog);
  foodS--;
  database.ref('/').update({
    Food:foodS
  })
  fedT++;
  database.ref('/').update({
    FeedTime:fedT
  })
}

function addFoods(){
  foodS++;
  database.ref('/').update({
    Food:foodS
  })
}

function lastFeeded(data){
  fedT=data.val();
}
