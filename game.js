const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
canvas.width = 800;
canvas.height = 600;

// Spielvariablen
const playerSize = 30;
const bulletSize = { width: 5, height: 10 };
const enemySize = 30;
const playerSpeed = 5;
const bulletSpeed = 10;
const enemySpeed = 3;
let player = { x: canvas.width / 2, y: canvas.height / 2, alive: true };
let bullets = [];
let enemies = [];
let safeZone = { x: canvas.width / 2, y: canvas.height / 2, radius: Math.min(canvas.width, canvas.height) / 2 };

// Hilfsfunktionen
function drawPlayer() {
    ctx.fillStyle = 'white';
    ctx.fillRect(player.x - playerSize / 2, player.y - playerSize / 2, playerSize, playerSize);
}

function drawBullet(bullet) {
    ctx.fillStyle = 'blue';
    ctx.fillRect(bullet.x - bulletSize.width / 2, bullet.y - bulletSize.height / 2, bulletSize.width, bulletSize.height);
}

function drawEnemy(enemy) {
    ctx.fillStyle = 'red';
    ctx.fillRect(enemy.x - enemySize / 2, enemy.y - enemySize / 2, enemySize, enemySize);
}

function drawSafeZone() {
    ctx.strokeStyle = 'green';
    ctx.beginPath();
    ctx.arc(safeZone.x, safeZone.y, safeZone.radius, 0, Math.PI * 2);
    ctx.stroke();
}

function isInsideSafeZone(x, y) {
    const dist = Math.hypot(x - safeZone.x, y - safeZone.y);
    return dist < safeZone.radius;
}

function updateBullets() {
    bullets = bullets.filter(bullet => {
        bullet.y -= bulletSpeed;
        return bullet.y > 0;
    });
}

function updateEnemies() {
    enemies.forEach(enemy => {
        const dx = player.x - enemy.x;
        const dy = player.y - enemy.y;
        const angle = Math.atan2(dy, dx);
        enemy.x += Math.cos(angle) * enemySpeed;
        enemy.y += Math.sin(angle) * enemySpeed;
    });
}

function detectCollisions() {
    bullets.forEach((bullet, index) => {
        enemies.forEach((enemy, enemyIndex) => {
            if (
                bullet.x < enemy.x + enemySize &&
                bullet.x + bulletSize.width > enemy.x &&
                bullet.y < enemy.y + enemySize &&
                bullet.y + bulletSize.height > enemy.y
            ) {
                bullets.splice(index, 1);
                enemies.splice(enemyIndex, 1);
            }
        });
    });

    if (!isInsideSafeZone(player.x, player.y)) {
        player.alive = false;
    }

    enemies.forEach(enemy => {
        if (
            player.x < enemy.x + enemySize &&
            player.x + playerSize > enemy.x &&
            player.y < enemy.y + enemySize &&
            player.y + playerSize > enemy.y
        ) {
            player.alive = false;
        }
    });
}

// Event-Handler
document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft' && player.x - playerSize / 2 > 0) {
        player.x -= playerSpeed;
    }
    if (e.key === 'ArrowRight' && player.x + playerSize / 2 < canvas.width) {
        player.x += playerSpeed;
    }
    if (e.key === 'ArrowUp' && player.y - playerSize / 2 > 0) {
        player.y -= playerSpeed;
    }
    if (e.key === 'ArrowDown' && player.y + playerSize / 2 < canvas.height) {
        player.y += playerSpeed;
    }
    if (e.key === ' ') {
        bullets.push({ x: player.x, y: player.y - playerSize / 2 });
    }
});

// Spiel-Schleife
function gameLoop() {
    if (!player.alive) {
        ctx.fillStyle = 'red';
        ctx.font = '48px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('Game Over', canvas.width / 2, canvas.height / 2);
        return;
    }

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawSafeZone();
    updateBullets();
    updateEnemies();
    detectCollisions();

    drawPlayer();
    bullets.forEach(drawBullet);
    enemies.forEach(drawEnemy);

    requestAnimationFrame(gameLoop);
}

// Gegner erstellen
for (let i = 0; i < 10; i++) {
    enemies.push({ x: Math.random() * canvas.width, y: Math.random() * canvas.height });
}

gameLoop();
