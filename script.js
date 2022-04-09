const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');

let speed = 135.0;
let score = 0;
const box = 32;

let food;
const foodImg = new Image();
foodImg.src = "img/food.svg";

document.addEventListener('keydown', direction);
let dir;
function direction(event) {
    if (event.code == 'KeyW' && dir != 'down')
        dir = 'up'
    else if (event.code == 'KeyS' && dir != 'up')
        dir = 'down';
    else if (event.code == 'KeyA' && dir != 'right')
        dir = 'left'
    else if (event.code == 'KeyD' && dir != 'left')
        dir = 'right';
}

let snake = [];
let maxTails;

// Creating snake and food for the first time
defaultSnake();
setFood();

function gameLoop() {
    ctx.drawImage(foodImg, food.x, food.y);

    clearSnake();
    
    for (i = 0; i < snake.length; i++) {
        // Move
        if (i === 0) {
            if (dir == 'up')
                snake.unshift( {x: snake[i].x, y: snake[i].y - box} )
            else if (dir == 'down')
                snake.unshift( {x: snake[i].x, y: snake[i].y + box} )
            else if (dir == 'left')
                snake.unshift( {x: snake[i].x - box, y: snake[i].y} )
            else if (dir == 'right')
                snake.unshift( {x: snake[i].x + box, y: snake[i].y} );
        }
        if (snake.length > maxTails) snake.pop();

        eating();

        // Collision
        if (typeof(snake[i]) && i != 0 && snake[i].x == snake[0].x && snake[i].y == snake[0].y) {
            alert('GAME OVER');
            defaultSnake();
        }
        
        // If snake going out of border
        if (snake[i].x < 0) snake[i].x += box * 19;
        if (snake[i].x == box * 19) snake[i].x -= box * 19;
        if (snake[i].y < 0) snake[i].y += box * 19;
        if (snake[i].y == box * 19) snake[i].y -= box * 19;

        // Drawing snake
        if (i === 0) 
            ctx.fillStyle = "#B6B6B6"
        else
            ctx.fillStyle = "#929292";

        ctx.fillRect(snake[i].x, snake[i].y, box, box);
    }
}

// Start game looping
var looper = setInterval(gameLoop, speed);
function eating() {
    let tx = 0;
    let ty = 0;
    if (snake[0].x == food.x && snake[0].y == food.y) {
        maxTails++;
        score++;

        if (dir == 'up') ty -= box
        else if (dir == 'down') ty += box
        else if (dir == 'left') tx -= box
        else if (dir == 'right') tx += box;

        snake.unshift( {x: snake[0].x + tx, y: snake[0].y + ty} );

        setFood();

        document.getElementById('score').innerHTML = 'SCORE: ' + score;
    }
}

function setFood() {
    food = {
        x: getRandomFloor(19, 1) * box,
        y: getRandomFloor(19, 1) * box
    }
}

function clearSnake() {
    for (let i = 0; i < snake.length; i++) {
        ctx.clearRect(snake[i].x, snake[i].y, box, box);
    }
}

function defaultSnake() {
    clearSnake();

    dir = null;
    score = 0;
    document.getElementById('score').innerHTML = 'SCORE: ' + score;
    maxTails = 3;

    snake[0] = {
        x: 9 * box,
        y: 9 * box
    };
    snake[1] = {
        x: 9 * box,
        y: 10 * box
    };
    snake[2] = {
        x: 9 * box,
        y: 11 * box
    };
}

function getRandomFloor(max, min) {
    return Math.floor(Math.random() * (max - min) + min);
}

function changeSpeed(sp, id) {
    let kind = 'changeSpeed-active';
    document.getElementsByClassName(kind)[0].classList.toggle(kind);
    document.getElementsByClassName('changeSpeed')[id].classList.toggle(kind);
    
    speed = 135 / sp;
    clearInterval(looper);
    looper = setInterval(gameLoop, speed);
    
    console.log(speed);
}