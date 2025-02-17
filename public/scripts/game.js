var canvas = document.getElementById('gameCanvas');
var ctx = canvas.getContext('2d');
var scoreElement = document.getElementById('score');
var rectangleCountElement = document.getElementById('rectangleCount');
var playButton = document.getElementById('playButton');

canvas.width = canvas.offsetWidth;
canvas.height = canvas.offsetHeight;

var score = 6000;
var rectangles = [];
var clickedRectangles = 0;
var totalRectangles = 100;
var displayedRectangles = 3;
var gameRunning = false;

function createRectangle() {
    var width = 50;
    var height = 50;
    var x, y;
    var collides;

    do {
        collides = false;
        x = Math.random() * (canvas.width - width);
        y = Math.random() * (canvas.height - height);

        for (var i = 0; i < rectangles.length; i++) {
            var rect = rectangles[i];
            if (isColliding({ x: x, y: y, width: width, height: height }, rect)) {
                collides = true;
                break;
            }
        }
    } while (collides);

    var color = "#232225";  // Fixed color for all rectangles

    return { x: x, y: y, width: width, height: height, color: color };
}

function isColliding(rect1, rect2) {
    return rect1.x < rect2.x + rect2.width &&
        rect1.x + rect1.width > rect2.x &&
        rect1.y < rect2.y + rect2.height &&
        rect1.y + rect1.height > rect2.y;
}

function drawRectangle(rect) {
    ctx.fillStyle = rect.color;
    ctx.fillRect(rect.x, rect.y, rect.width, rect.height);

    // Add a slightly lighter border for better visibility
    ctx.strokeStyle = "#3A393C";
    ctx.strokeRect(rect.x, rect.y, rect.width, rect.height);
}

function init() {
    rectangles = [];
    for (var i = 0; i < displayedRectangles; i++) {
        rectangles.push(createRectangle());
    }
}

function update() {
    if (!gameRunning) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (var i = 0; i < rectangles.length; i++) {
        drawRectangle(rectangles[i]);
    }

    score--;
    scoreElement.textContent = "Score: " + score;
    rectangleCountElement.textContent = "Rectangles cliqués: " + clickedRectangles + " / " + totalRectangles;

    if (score > 0 && clickedRectangles < totalRectangles) {
        requestAnimationFrame(update);
    } else {
        endGame();
    }
}

function endGame() {
    gameRunning = false;
    if (score <= 0) {
        alert("Game Over! Le temps est écoulé.");
    } else {
        alert("Jeu terminé! Votre score final: " + score);
    }
    playButton.disabled = false;
}

function startGame() {
    score = 6000;
    clickedRectangles = 0;
    init();
    gameRunning = true;
    playButton.disabled = true;
    update();
}

canvas.addEventListener('click', function(event) {
    if (!gameRunning) return;

    var rect = canvas.getBoundingClientRect();
    var clickX = event.clientX - rect.left;
    var clickY = event.clientY - rect.top;

    for (var i = 0; i < rectangles.length; i++) {
        var rectangle = rectangles[i];
        if (clickX >= rectangle.x && clickX <= rectangle.x + rectangle.width &&
            clickY >= rectangle.y && clickY <= rectangle.y + rectangle.height) {
            rectangles[i] = createRectangle();
            clickedRectangles++;
            if (clickedRectangles >= totalRectangles) {
                endGame();
            }
            break;
        }
    }
});

playButton.addEventListener('click', startGame);

init();  // Initialize rectangles but don't start the game yet