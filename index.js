//1. Create the canvas
var canvas = document.createElement("canvas");
var ctx = canvas.getContext("2d");
canvas.width = 512; //pixels
canvas.height = 480; //pixels
document.body.appendChild(canvas);

//2. Load images
// Background image
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


// Game objects
var hero = {
    speed: 256, // movement in pixels per second
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

var monstersCaught = 0;



// Handle keyboard controls
var keysDown = {}; //object were we properties when keys go down
                // and then delete them when the key goes up
// so the object tells us if any key is down when that keycode
// is down.  In our game loop, we will move the hero image if when
// we go thru render, a key is down

addEventListener("keydown", function (e) {
    //console.log(e.key + " down")
    keysDown[e.keyCode] = true;
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
            hero.x <= (monster.x + 32)
            && monster.x <= (hero.x + 32)
            && hero.y <= (monster.y + 32)
            && monster.y <= (hero.y + 32)
        ) {
            ++monstersCaught;       // keep track of our “score”
            reset();       // start a new cycle
        }

    for(let i = 0; i < scenoryArrayForCollision.length; i++) {
        if (hero.x <= (scenoryArrayForCollision[i].x + 16) && scenoryArrayForCollision[i].x <= (hero.x + 16) &&
        hero.y <= (scenoryArrayForCollision[i].y + 16) && scenoryArrayForCollision[i].y <= (hero.y + 16)) {
            console.log("collision!");
        }
    }
};

//=============================================================

var render = function () {
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


    ctx.fillStyle = "rgb(250, 250, 250)";
    ctx.font = "16px Helvetica";
    ctx.textAlign = "left";
    ctx.textBaseline = "top";
    ctx.fillText("Goblins caught: " + monstersCaught, 4, 4);
}

//Reset the game when the player catches a monster or game starts
var reset = function () {
    hero.x = canvas.width / 2;
    hero.y = canvas.height / 2;

//Place the monster somewhere on the screen randomly
// but not in the hedges, Article in wrong, the 64 needs to be 
// hedge 32 + hedge 32 + char 32 = 96
    monster.x = 32 + (Math.random() * (canvas.width - 96));
    monster.y = 32 + (Math.random() * (canvas.height - 96));
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
main();  // call the main game loop.