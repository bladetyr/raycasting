let player = {
    fov: 60,
    x: 2,
    y: 2,
    angle: 90
}

const screenWidth = 640; //these are pixels
const screenHeight = 480;
const renderDelay = 30; //these are milliseconds
const raycastPrecision = 64; //how many rays are looking at the 'walls'
const raycastIncrementAngle = player.fov/screenWidth;

const defaultMap = [
    [1,1,1,1,1,1,1,1,1,1],
    [1,0,0,0,0,0,0,0,0,1],
    [1,0,0,0,0,0,0,0,0,1],
    [1,0,0,1,1,0,1,0,0,1],
    [1,0,0,1,0,0,1,0,0,1],
    [1,0,0,1,0,0,1,0,0,1],
    [1,0,0,1,0,1,1,0,0,1],
    [1,0,0,0,0,0,0,0,0,1],
    [1,0,0,0,0,0,0,0,0,1],
    [1,1,1,1,1,1,1,1,1,1],
];

// Create Canvas stuff
const screen = document.createElement('canvas');
screen.width = screenWidth;
screen.height = screenHeight;
screen.style.border = "1px solid black";
document.body.append(screen);

// Canvas context
const screenContext = screen.getContext("2d");

// Canvas utils
function clearScreen() {
    screenContext.clearRect(0, 0, screenWidth, screenHeight);
}

// Ugly annoying math
function degreeToRadians(degree){
    return degree * Math.PI / 180;
}

// Canvas Drawing
function drawLine(x1, y1, x2, y2, cssColor) {
    screenContext.strokeStyle = cssColor;
    screenContext.beginPath();
    screenContext.moveTo(x1, y1);
    screenContext.lineTo(x2, y2);
    screenContext.stroke();
}

// == MAIN LOOP ==
function raycast(){
    let rayAngle = player.angle - player.fov/2;
    for(let numRays = 0; numRays < screenWidth; numRays++){
        let rayX = player.x;
        let rayY = player.y;
        let rayCos = Math.cos(degreeToRadians(rayAngle)) / raycastPrecision;
        let raySin = Math.sin(degreeToRadians(rayAngle)) / raycastPrecision;

        // Wall distance checking
        let wall = 0;
        while(wall == 0) {
            rayX += rayCos;
            rayY += raySin;
            wall = defaultMap[Math.floor(rayY)][Math.floor(rayX)];
        }
        // Pythag Theorem to figure out how big to draw the wall
        // Formula is a^2 + b^2 = c^2, aka distanceX^2 + distanceY^2 = distance^2
        // distanceX = player.x - rayX (where the player is vs where the ray found the wall) to get the distance between player and wall
        let trueDistance = Math.sqrt(Math.pow(player.x - rayX, 2) + Math.pow(player.y - rayY, 2));
        let wallHeight = Math.floor((screenHeight/2) / trueDistance);

        // draw sky
        drawLine(numRays, 0, numRays, (screenHeight / 2) - wallHeight, "cyan");
        // draw walls
        drawLine(numRays, (screenHeight / 2) - wallHeight, numRays, (screenHeight / 2) + wallHeight, "red");
        // draw floor
        drawLine(numRays, (screenHeight / 2) + wallHeight, numRays, screenHeight, "green");

        rayAngle += raycastIncrementAngle;
    }
}

function main(){
    //thread creation interval
    setInterval(function() {
        clearScreen();
        raycast();
    }, renderDelay);
}

main();
console.log("hello world");