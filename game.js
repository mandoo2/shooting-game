const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const player = {
  x: canvas.width / 2 - 25,
  y: canvas.height - 60,
  width: 50,
  height: 50,
  speed: 5,
  dx: 0
};

let bullets = [];
let enemies = [];
const bulletSpeed = 7;
const enemySpeed = 3;
const enemyInterval = 1000; // 1 second
let gameOver = false;

function drawPlayer() {
  ctx.fillStyle = 'white';
  ctx.fillRect(player.x, player.y, player.width, player.height);
}

function drawBullet(bullet) {
  ctx.fillStyle = 'red';
  ctx.fillRect(bullet.x, bullet.y, bullet.width, bullet.height);
}

function drawEnemy(enemy) {
  ctx.fillStyle = 'green';
  ctx.fillRect(enemy.x, enemy.y, enemy.width, enemy.height);
}

function drawGameOver() {
  ctx.fillStyle = 'red';
  ctx.font = '48px serif';
  ctx.fillText('Game Over', canvas.width / 2 - 130, canvas.height / 2);
}

function clear() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
}

function newPos() {
  player.x += player.dx;

  if (player.x < 0) player.x = 0;
  if (player.x + player.width > canvas.width) player.x = canvas.width - player.width;
}

function moveBullets() {
  bullets = bullets.filter(bullet => bullet.y > 0);
  bullets.forEach(bullet => {
    bullet.y -= bulletSpeed;
  });
}

function moveEnemies() {
  enemies = enemies.filter(enemy => enemy.y <= canvas.height);
  enemies.forEach(enemy => {
    enemy.y += enemySpeed;
  });
}

function spawnEnemy() {
  const enemy = {
    x: Math.random() * (canvas.width - 30),
    y: 0,
    width: 30,
    height: 30
  };
  enemies.push(enemy);
}

function detectCollisions() {
  for (let i = enemies.length - 1; i >= 0; i--) {
    for (let j = bullets.length - 1; j >= 0; j--) {
      if (
        bullets[j].x < enemies[i].x + enemies[i].width &&
        bullets[j].x + bullets[j].width > enemies[i].x &&
        bullets[j].y < enemies[i].y + enemies[i].height &&
        bullets[j].height + bullets[j].y > enemies[i].y
      ) {
        enemies.splice(i, 1);
        bullets.splice(j, 1);
        break;
      }
    }

    if (
      player.x < enemies[i].x + enemies[i].width &&
      player.x + player.width > enemies[i].x &&
      player.y < enemies[i].y + enemies[i].height &&
      player.height + player.y > enemies[i].y
    ) {
      gameOver = true;
      return;
    }
  }
}

function update() {
  clear();
  if (gameOver) {
    drawGameOver();
    return;
  }

  drawPlayer();
  bullets.forEach(drawBullet);
  enemies.forEach(drawEnemy);
  newPos();
  moveBullets();
  moveEnemies();
  detectCollisions();
  requestAnimationFrame(update);
}

function moveRight() {
  player.dx = player.speed;
}

function moveLeft() {
  player.dx = -player.speed;
}

function shoot() {
  const bullet = {
    x: player.x + player.width / 2 - 2.5,
    y: player.y,
    width: 5,
    height: 10
  };
  bullets.push(bullet);
}

function resetGame() {
  player.x = canvas.width / 2 - 25;
  player.y = canvas.height - 60;
  player.dx = 0;
  bullets = [];
  enemies = [];
  gameOver = false;
}

function keyDown(e) {
  if (gameOver && e.key === ' ') {
    resetGame();
    update();
  } else if (!gameOver) {
    if (e.key === 'ArrowRight' || e.key === 'Right') {
      moveRight();
    } else if (e.key === 'ArrowLeft' || e.key === 'Left') {
      moveLeft();
    } else if (e.key === ' ') {
      shoot();
    }
  }
}

function keyUp(e) {
  if (
    e.key === 'ArrowRight' || e.key === 'Right' ||
    e.key === 'ArrowLeft' || e.key === 'Left'
  ) {
    player.dx = 0;
  }
}

document.addEventListener('keydown', keyDown);
document.addEventListener('keyup', keyUp);

setInterval(spawnEnemy, enemyInterval);
update();
