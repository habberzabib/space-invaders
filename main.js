let canvas = document.getElementById('spaceInvadersCanvas');
let ctx = canvas.getContext('2d');

// Spaceship properties
let spaceshipWidth = 40;
let spaceshipHeight = 20;
let spaceshipX = (canvas.width - spaceshipWidth) / 2;
let spaceshipSpeed = 5;

// Bullet properties
let bulletWidth = 3;
let bulletHeight = 10;
let bulletX;
let bulletY;
let bulletSpeed = 8;
let bulletFired = false;

// Alien properties
let alienRowCount = 3;
let alienColumnCount = 5;
let alienWidth = 30;
let alienHeight = 20;
let alienPadding = 10;
let alienOffsetTop = 30;
let alienOffsetLeft = 30;

// Game variables
let score = 0;
let level = 1;

// Initialize aliens
let aliens = initializeAliens();

function initializeAliens() {
  let initializedAliens = [];
  let c = 0;
  while (c < alienColumnCount) {
	initializedAliens[c] = [];
	initializeAliensRow(initializedAliens[c]);
	c++;
  }
  return initializedAliens;
}

function initializeAliensRow(row) {
  let r = 0;
  while (r < alienRowCount) {
	row[r] = createAlien();
	r++;
  }
}

function createAlien() {
  return { x: 0, y: 0, alive: true };
}

function drawSpaceship() {
  ctx.beginPath();
  ctx.rect(spaceshipX, canvas.height - spaceshipHeight, spaceshipWidth, spaceshipHeight);
  ctx.fillStyle = "white";
  ctx.fill();
  ctx.closePath();
}

function drawBullet() {
  if (bulletFired) {
	ctx.beginPath();
	ctx.rect(bulletX, bulletY, bulletWidth, bulletHeight);
	ctx.fillStyle = "white";
	ctx.fill();
	ctx.closePath();
  }
}

function drawAliens() {
  let c = 0;
  while (c < alienColumnCount) {
	let r = 0;
	while (r < alienRowCount) {
  	let alien = aliens[c][r];
  	if (alien.alive) {
    	drawAlien(alien);
  	}
  	r++;
	}
	c++;
  }
}

function drawAlien(alien) {
  let alienX = alien.x + alienOffsetLeft;
  let alienY = alien.y + alienOffsetTop;
  ctx.beginPath();
  ctx.rect(alienX, alienY, alienWidth, alienHeight);
  ctx.fillStyle = "white";
  ctx.fill();
  ctx.closePath();
}

function collisionDetection() {
  let c = 0;
  while (c < alienColumnCount) {
	let r = 0;
	while (r < alienRowCount) {
  	let alien = aliens[c][r];
  	if (alien.alive && isBulletCollision(bulletX, bulletY, alien)) {
    	handleCollision(alien);
  	}
  	r++;
	}
	c++;
  }
}

function isBulletCollision(bulletX, bulletY, alien) {
  return bulletX > alien.x && bulletX < alien.x + alienWidth && bulletY > alien.y && bulletY < alien.y + alienHeight;
}

function handleCollision(alien) {
  bulletFired = false;
  alien.alive = false;
  score++;
  if (score === alienRowCount * alienColumnCount * level) {
	level++;
	aliens = initializeAliens();
  }
}

function drawScore() {
  ctx.font = '16px Arial';
  ctx.fillStyle = "white";
  ctx.fillText('Score: ' + score, 8, 20);
}

function drawLevel() {
  ctx.font = '16px Arial';
  ctx.fillStyle = "white";
  ctx.fillText('Level: ' + level, canvas.width - 70, 20);
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawSpaceship();
  drawBullet();
  drawAliens();
  collisionDetection();
  drawScore();
  drawLevel();

  // Move spaceship
  if (spaceshipX + spaceshipWidth + spaceshipSpeed < canvas.width && spaceshipX + spaceshipSpeed > 0) {
	spaceshipX += spaceshipSpeed;
  }

  // Move bullet
  if (bulletFired) {
	bulletY -= bulletSpeed;
	if (bulletY < 0) {
  	bulletFired = false;
	}
  }

  requestAnimationFrame(draw);
}

function keyDownHandler(e) {
  if (e.key === 'ArrowLeft') {
	spaceshipX -= spaceshipSpeed;
  } else if (e.key === 'ArrowRight') {
	spaceshipX += spaceshipSpeed;
  } else if (e.key === ' ' && !bulletFired) {
	bulletFired = true;
	bulletX = spaceshipX + spaceshipWidth / 2 - bulletWidth / 2;
	bulletY = canvas.height - spaceshipHeight;
  }
}

document.addEventListener('keydown', keyDownHandler);

// Initialize the game
initializeAliens();
draw();

