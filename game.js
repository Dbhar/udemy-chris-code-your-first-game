var canvas;
var canvasContext;
const BALL_RADIUS = 10;
const AI_THRESHOLD = 40;
const COMPUTER_PADDLE_SPEED_Y = 10;
const MAX_SCORE = 3;
const PADDLE_WIDTH = 10;
const PADDLE_HEIGHT = 100;
const PADDLE_HIT_BALL_SPEED_Y_FACTOR = 0.2;

const PLAYER_PADDLE_X = 30;
var playerPaddleY = 100;

var computerPaddleX = 0;
var showWinScreen = false;
var winnningPlayer;

var playerScore = 0;
var computerScore = 0;

var computerPaddleY = 300;

var ballX = 40;
var ballY = 40;
var ballSpeedX = 10;
var ballSpeedY = 2;
window.addEventListener('load', () => {
    canvas = document.getElementById('gamecanvas');
    canvas.addEventListener('mousemove', (evt) => {
        var mousePos = calculateMousePos(evt);
        playerPaddleY = mousePos.y - PADDLE_HEIGHT / 2;
    });
    canvas.addEventListener('mousedown', () => {
        if(showWinScreen) {
            playerScore = 0;
            computerScore = 0;
            showWinScreen = false;
        }
    });
    computerPaddleX = canvas.width - 50;
    canvasContext = canvas.getContext('2d');
    canvasContext.font = '15px serif';
    canvasContext.textAlign = 'center';
    var fps = 30;
    setInterval(() => {
        draw();
        move();
    }, 1000 / fps);

})

function drawNet() {
    for(var i = 0; i < canvas.height; i += 40) {
        colorRect(canvas.width/2 - 1, i, 2, 20, 'white')
    }
}

function draw() {
    // World
    colorRect(0, 0, canvas.width, canvas.height, 'black');

    if (showWinScreen) {
        console.log('exec');
        winnningPlayer = playerScore > computerScore? 'player' : 'computer';
        colorText(winnningPlayer + " won, click to continue", canvas.width / 2, canvas.height / 2, 200, 'white');
        return
    }

    drawNet();

    //Player Paddle
    colorRect(PLAYER_PADDLE_X, playerPaddleY, PADDLE_WIDTH, PADDLE_HEIGHT, 'white');

    //computer Paddle
    colorRect(computerPaddleX, computerPaddleY, PADDLE_WIDTH, PADDLE_HEIGHT, 'white');

    //Ball
    colorCircle(ballX, ballY, BALL_RADIUS, 'white');

    //score
    colorText(playerScore, 10, 100, 200, 'white');
    colorText(computerScore, canvas.width - 10, 100, 200, 'white');
}

function colorRect(leftX, topY, width, height, color) {
    canvasContext.fillStyle = color;
    canvasContext.fillRect(leftX, topY, width, height);
}

function colorCircle(centerX, centerY, radius, color) {
    canvasContext.fillStyle = color;
    canvasContext.beginPath();
    canvasContext.arc(centerX, centerY, radius, 0, Math.PI * 2, true);
    canvasContext.fill();
}

function colorText(text, x, y, width, color) {
    canvasContext.fillStyle = color;
    canvasContext.fillText(text, x, y, width);
}

function calculateMousePos(evt) {
    var rect = canvas.getBoundingClientRect();
    var root = document.documentElement;

    var mouseX = evt.clientX - rect.left - root.scrollLeft;
    var mouseY = evt.clientY - rect.top - root.scrollTop;
    return {
        x: mouseX,
        y: mouseY
    };
}

function ballReset() {
    ballSpeedX = - ballSpeedX;
    ballX = canvas.width / 2;
    ballY = canvas.height / 2;
}

function move() {
    if (showWinScreen) {
        return;
    }
    moveBall();
    moveComputerPaddle();
}

function moveBall() {
    ballX += ballSpeedX;
    ballY += ballSpeedY;

    if ((ballX == PLAYER_PADDLE_X + PADDLE_WIDTH + BALL_RADIUS && ballY >= playerPaddleY - BALL_RADIUS && ballY <= playerPaddleY + PADDLE_HEIGHT + BALL_RADIUS) || (ballX == computerPaddleX - BALL_RADIUS && ballY >= computerPaddleY - BALL_RADIUS && ballY <= computerPaddleY + PADDLE_HEIGHT + BALL_RADIUS)) {
        ballSpeedX = - ballSpeedX;
        if (ballY <= playerPaddleY + PADDLE_HEIGHT && ballY >= playerPaddleY) {
            var deltaY = ballY - (playerPaddleY + PADDLE_HEIGHT / 2);
            ballSpeedY = deltaY * PADDLE_HIT_BALL_SPEED_Y_FACTOR;
        }else if (ballY <= computerPaddleY + PADDLE_HEIGHT && ballY >= computerPaddleY) {
            var deltaY = ballY - (computerPaddleY + PADDLE_HEIGHT / 2);
            ballSpeedY = deltaY * PADDLE_HIT_BALL_SPEED_Y_FACTOR;
        }

    } else if (ballX < 0 || ballX > canvas.width) {
        if (ballX < 0) {
            computerScore++;
        } else {
            playerScore++;
        }
        if (playerScore == MAX_SCORE || computerScore == MAX_SCORE) {
            showWinScreen = true;
        }
        ballReset();
    }

    if (ballY >= canvas.height - BALL_RADIUS) {
        ballSpeedY = - ballSpeedY;
    }
    if (ballY <= BALL_RADIUS) {
        ballSpeedY = - ballSpeedY;
    }
}

function moveComputerPaddle() {
    const computerPaddleCenterY = computerPaddleY + PADDLE_HEIGHT / 2
    if (computerPaddleY == 0) {
        computerPaddleY += COMPUTER_PADDLE_SPEED_Y;
    }

    if (computerPaddleY + PADDLE_HEIGHT == canvas.height) {
        computerPaddleY -= COMPUTER_PADDLE_SPEED_Y;
    }

    if (ballX >= canvas.width / 2 && ballSpeedX > 0) {
        if (ballY + AI_THRESHOLD < computerPaddleCenterY) {
            computerPaddleY -= COMPUTER_PADDLE_SPEED_Y;
        }

        if (ballY - AI_THRESHOLD > computerPaddleCenterY) {
            computerPaddleY += COMPUTER_PADDLE_SPEED_Y;
        }
    }
}

function sleep(delay) {
    var start = new Date().getTime();
    while (new Date().getTime() < start + delay);
}