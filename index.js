"use strict";
//variables
let canvas;
let ctx;
let ballX = 50;
let ballY = 50;
let ballXSpeed = 10;
let ballYSpeed = 4;
let paddle1Y = 250;
let paddle2Y = 250;
let player1Score = 0;
let player2Score = 0;
let winScreen = false;
const paddle_height = 100;
const paddle_thickness = 10;
const winScore = 10;

function mousePosition(event) {
  // for positioning
  let rect = canvas.getBoundingClientRect();
  let main = document.documentElement;
  let mouseX = event.clientX - rect.left - main.scrollLeft;
  let mouseY = event.clientY - rect.top - main.scrollTop;
  return {
    x: mouseX,
    y: mouseY,
  };
}
function handleMouseClick(event) {
  // on click reset
  if (winScreen) {
    player1Score = 0;
    player2Score = 0;
    winScreen = false;
  }
}
window.onload = function () {
  canvas = document.getElementById("gameCanvas");
  ctx = canvas.getContext("2d");
  ctx.font = "50px verdana";
  let fps = 60; // For motion
  setInterval(function () {
    move();
    draw();
  }, 1000 / fps);
  canvas.addEventListener("mousedown", handleMouseClick);
  canvas.addEventListener("mousemove", function (event) {
    let MousePosition = mousePosition(event);
    paddle1Y = MousePosition.y - paddle_height / 2;
  });
};
function ballReset() {
  //resets the game
  if (player1Score >= winScore || player2Score >= winScore) {
    winScreen = true;
  }
  ballX = canvas.width / 2;
  ballY = canvas.height / 2;
  ballXSpeed = -ballXSpeed;
}
function compMove() {
  // computer movement right paddle follows the ball closely
  let paddle2YCenter = paddle2Y + paddle_height / 2;
  if (paddle2YCenter < ballY - 35) {
    paddle2Y += 6;
  } else if (paddle2YCenter > ballY + 35) {
    paddle2Y -= 6;
  }
}
function move() {
  // Movements
  if (winScreen) {
    return 0;
  }
  compMove();
  ballX += ballXSpeed;
  ballY -= ballYSpeed;
  if (ballX < 0) {
    if (ballY > paddle1Y && ballY < paddle1Y + paddle_height) {
      ballXSpeed = -ballXSpeed;
      let delayY = ballY - (paddle1Y + paddle_height / 2);
      ballYSpeed = delayY * 0.15;
    } else {
      player2Score++;
      ballReset();
    }
  }
  if (ballX > canvas.width) {
    if (ballY > paddle2Y && ballY < paddle2Y + paddle_height) {
      ballXSpeed = -ballXSpeed;
      let delayY = ballY - (paddle2Y + paddle_height / 2);
      ballYSpeed = delayY * 0.15;
    } else {
      player1Score++;
      ballReset();
    }
  }
  if (ballY < 0) {
    ballYSpeed = -ballYSpeed;
  }
  if (ballY > canvas.height) {
    ballYSpeed = -ballYSpeed;
  }
}
function net() {
  // table middle line
  for (let i = 0; i < canvas.height; i += 40) {
    colorRect(canvas.width / 2 - 1, i, 2, 20, "white");
  }
}
function draw() {
  colorRect(0, 0, canvas.width, canvas.height, "black");
  if (winScreen) {
    ctx.font = "30px verdana";
    ctx.fillStyle = "white";
    if (player1Score >= winScore) {
      ctx.fillText("You win!🎉", 300, 200);
    } else if (player2Score >= winScore) {
      ctx.fillText("You lose!☹", 300, 200);
    }
    ctx.fillText("click anywhere to play again", 200, 400);
    return 0;
  }
  net();
  //left paddle
  colorRect(0, paddle1Y, paddle_thickness, paddle_height, "green");
  //right paddle(computer)
  colorRect(
    canvas.width - paddle_thickness,
    paddle2Y,
    paddle_thickness,
    paddle_height,
    "red"
  );
  colorCircle(ballX, ballY, 10, "white"); //ball
  ctx.fillText(player1Score, 100, 100);
  ctx.fillText(player2Score, canvas.width - 100, 100);
}
// for the rectangles
function colorRect(leftX, topY, width, height, drawColor) {
  ctx.fillStyle = drawColor;
  ctx.fillRect(leftX, topY, width, height);
}
//for the circle(ball)
function colorCircle(centerX, centerY, radius, drawColor) {
  ctx.fillStyle = drawColor; //ball
  ctx.beginPath();
  ctx.arc(centerX, centerY, radius, 0, Math.PI * 2, true);
  ctx.fill();
}
