
var canvas = document.createElement("canvas");
var ctx = canvas.getContext("2d");
canvas.width = 512; //pixels
canvas.height = 480; //pixels
document.body.appendChild(canvas);


var bgReady = false;
var bgImage = new Image();
bgImage.onload = function () {
    bgReady = true;
};
bgImage.src = "images/background.png";

// Hero image
var heroReady = false;
var heroImage = new Image();
heroImage.onload = function () {
    heroReady = true;
};
heroImage.src = "images/hero.png";

// Monster image
var monsterReady = false;
var monsterImage = new Image();
monsterImage.onload = function () {
    monsterReady = true;
};
monsterImage.src = "images/monster.png";

let healthReady = false;
let noHealth = new Image();
let lowHealth = new Image();
let healthy = new Image();
noHealth.onload = function () {
    healthReady = true;
};
noHealth.src = "images/nohealth.png";
lowHealth.src = "images/somehealth.png";
healthy.src ="images/healthy.png";


var scenoryReady = false;
let sImage1 = new Image();
let sImage2 = new Image();
let sImage3 = new Image();
sImage1.onload = function() {
    scenoryReady = true;
}
sImage1.src = "images/tree1.png";
sImage2.src = "images/tree2.png";
sImage3.src = "images/tree3.png";

let soundHit = new sound("sounds/sword-attack.wav");
let soundTree = new sound("sounds/shaken-bush.mp3");
let soundBack = new sound("sounds/background.wav");

// Game objects
var hero = {
    speed: 256, // movement in pixels per seco
    x: 0,  // where on the canvas are they?
    y: 0  // where on the canvas are they?
};
var monster = {
// for this version, the monster does not move, so just and x and y
    x: 0,
    y: 0
};

let tree1 = {
    x: 300, y: 300
};
let tree2 = {
    x: 25, y: 45
};
let tree3 = {
    x: 150, y: 150
};

let scenoryArrayForCollision = [];

scenoryArrayForCollision.push(tree1);
scenoryArrayForCollision.push(tree2);
scenoryArrayForCollision.push(tree3);

var monstersCaught = 1;



// Handle keyboard controls
var keysDown = {}; //object were we properties when keys go down
                // and then delete them when the key goes up
// so the object tells us if any key is down when that keycode
// is down.  In our game loop, we will move the hero image if when
// we go thru render, a key is down

addEventListener("click",function(){
    soundBack.play();
});

addEventListener("keydown", function (e) {
    //console.log(e.key + " down")
    keysDown[e.keyCode] = true;
    soundBack.play();
}, false);

addEventListener("keyup", function (e) {
    //console.log(e.key + " up")
    delete keysDown[e.keyCode];
}, false);

// Update game objects
var update = function (modifier) {
    if (38 in keysDown && hero.y > 2) { //  holding up key
        hero.y -= hero.speed * modifier;
    }
    if (40 in keysDown && hero.y < canvas.height - 16 - 2) { //  holding down key
        hero.y += hero.speed * modifier;
    }
    if (37 in keysDown && hero.x > 2) { // holding left key
        hero.x -= hero.speed * modifier;
    }
    if (39 in keysDown && hero.x < canvas.width - 16 - 2) { // holding right key
        hero.x += hero.speed * modifier;
    }
    
    //console.log(hero.x + "," + hero.y);

        // Are they touching?
        if (
            hero.x <= (monster.x + 16)
            && monster.x <= (hero.x + 16)
            && hero.y <= (monster.y + 16)
            && monster.y <= (hero.y + 16)
        ) {
            soundHit.play();
            ++monstersCaught;       // keep track of our “score”
            reset();       // start a new cycle
        }

    for(let i = 0; i < scenoryArrayForCollision.length; i++) {
        if (hero.x <= (scenoryArrayForCollision[i].x +10) && scenoryArrayForCollision[i].x <= (hero.x + 10) &&
        hero.y <= (scenoryArrayForCollision[i].y +10) && scenoryArrayForCollision[i].y <= (hero.y +10)) {
            soundTree.play();
            --monstersCaught;
        reset();

            
        }
    }
};


//=============================================================

var render = function () {
    ctx.textBaseline = "top";  
    ctx.fillStyle = "rgb(250, 250, 250)";
    ctx.font = "16px Helvetica";
    ctx.textAlign = "left";
   

    if(monstersCaught>-1 && monstersCaught <5){
    if (bgReady) {
        ctx.drawImage(bgImage, 0, 0);
    }

    if (heroReady) {
        ctx.drawImage(heroImage, hero.x, hero.y);
    }

    if (monsterReady) {
        ctx.drawImage(monsterImage, monster.x, monster.y);
    }

    if (scenoryReady) {
        ctx.drawImage(sImage1, tree1.x, tree1.y);
        ctx.drawImage(sImage2, tree2.x, tree2.y);
        ctx.drawImage(sImage3, tree3.x, tree3.y);
    }
    ctx.fillText("Life: " + monstersCaught, 4, 4);

        switch (monstersCaught){
            case 0:
                if(healthReady){
                    ctx.fillText("Hit one more tree and you are a gonner!", 60, 4);
                    ctx.drawImage(noHealth,350,3);
                }
            break;
            case 1:
            case 2:
                if(healthReady){
                    ctx.drawImage(lowHealth,100,3);
                }
            break;

            case 3:
            case 4:
                ctx.fillText("Almost to Valhalla!", 60, 4);
                if(healthReady){
                    ctx.drawImage(healthy,200,3);
                }
            break;


        break;



        
            
        }
    }else if(monstersCaught==5){
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        if (bgReady) {
            ctx.drawImage(bgImage, 0, 0);
        }
        
        ctx.fillText("You win. You are forever awesome.", 45, 125);
    }
    else{
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        if (bgReady) {
            ctx.drawImage(bgImage, 0, 0);
        }
        ctx.fillText("Total Points: " + monstersCaught, 4, 4);
        ctx.drawImage(noHealth,110,6);

        ctx.fillText("You lose, please don't cry!", 20, 125);
    }
}

//Reset the game when the player catches a monster or game starts
var reset = function () {
    hero.x = canvas.width / 2;
    hero.y = canvas.height / 2;

    monster.x = 16 + (Math.random() * (canvas.width - 50));
    monster.y = 16 + (Math.random() * (canvas.height - 50));

    while((monster.x == 16 + tree1.x || monster.x == 16+ tree2.x || monster.x == 16+ tree3.x)|| (monster.y == 16 + tree1.y || monster.y == 16+ tree2.y|| monster.y == 16+ tree3.y)){

        monster.x = 16 + (Math.random() * (canvas.width - 50));
        monster.y = 16 + (Math.random() * (canvas.height - 50));
        console.log("i ran");
    }
};

var clear = function () {
    context.clearRect(0, 0, canvas.width, canvas.height);
};


// The main game loop
var main = function () {
    var now = Date.now();
    var delta = now - then;
    update(delta / 1000);
    render();

    then = now;
    //  Request to do this again ASAP
    requestAnimationFrame(main);
};


// Let's play this game!
var then = Date.now();
    reset();
    main(); 
    

    function sound(src) {
        this.sound = document.createElement("audio");
        this.sound.src = src;
        this.sound.setAttribute("preload", "auto");
        this.sound.setAttribute("controls", "none");
        this.sound.style.display = "none";
        document.body.appendChild(this.sound);
        this.play = function(){
          this.sound.play();
        }
        this.stop = function(){
          this.sound.pause();
        }
      }
