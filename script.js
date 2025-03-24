const gameBoard = document.getElementById('game-board');
const gridSize = 30;
let snake = [{ x: 15, y: 15 }, { x: 14, y: 15 }, { x: 13, y: 15 }, {x: 12, y: 15}];
let food = generateFood();
let enemies = generateEnemies();
let direction = { x: 0, y: 0 };
let gameSpeed = 10;
let lastRenderTime = 0;

function main(currentTime) {
  window.requestAnimationFrame(main);
  const secondsSinceLastRender = (currentTime - lastRenderTime) / 1000;
  if (secondsSinceLastRender < 1 / gameSpeed) return;

  lastRenderTime = currentTime;

  update();
  draw();
}

window.requestAnimationFrame(main);

function update() {
  updateSnake();
  updateFood();
  updateEnemies();
  checkDeath();
}

function draw() {
  gameBoard.innerHTML = '';
  drawSnake(gameBoard);
  drawFood(gameBoard);
  drawEnemies(gameBoard);
}

function updateSnake() {
  const inputDirection = direction;

  const newHead = {
    x: snake[0].x + inputDirection.x,
    y: snake[0].y + inputDirection.y,
  };

  snake.unshift(newHead);
  snake.pop();
}

function drawSnake(board) {
  snake.forEach((segment) => {
    const snakeElement = document.createElement('div');
    snakeElement.style.gridRowStart = segment.y;
    snakeElement.style.gridColumnStart = segment.x;
    snakeElement.classList.add('snake');
    board.appendChild(snakeElement);
  });
}

function drawFood(board) {
  const foodElement = document.createElement('div');
  foodElement.style.gridRowStart = food.y;
  foodElement.style.gridColumnStart = food.x;
  foodElement.classList.add('food');
  if (food.class) {
    foodElement.classList.add(food.class);
  }
  board.appendChild(foodElement);
}

function updateFood() {
  if (onSnake(food)) {
    window.location.href = food.url;
    snake.push({ ...snake[snake.length - 1] });
    food = generateFood();
  }
}

function generateFood() {
  const foodTypes = [
    { class: 'homepage', url: 'https://www.blanktheory.com.au' },
    { class: 'services', url: 'https://www.blanktheory.com.au/digital-marketing/' },
    { class: 'blog', url: 'https://www.blanktheory.com.au/insights/' },
  ];

  const foodType = foodTypes[Math.floor(Math.random() * foodTypes.length)];

  let newFoodPosition;
  while (newFoodPosition == null || onSnake(newFoodPosition)) {
    newFoodPosition = randomGridPosition();
  }

  newFoodPosition.class = foodType.class;
  newFoodPosition.url = foodType.url;
  return newFoodPosition;
}

function randomGridPosition() {
  return {
    x: Math.floor(Math.random() * gridSize) + 1,
    y: Math.floor(Math.random() * gridSize) + 1,
  };
}

function onSnake(position, { ignoreHead = false } = {}) {
  return snake.some((segment, index) => {
    if (ignoreHead && index === 0) return false;
    return equalPositions(segment, position);
  });
}

function equalPositions(pos1, pos2) {
  return pos1.x === pos2.x && pos1.y === pos2.y;
}

function generateEnemies() {
  const numberOfEnemies = 3;
  const enemies = [];
  for (let i = 0; i < numberOfEnemies; i++) {
    let newEnemyPosition;
    while (newEnemyPosition == null || onSnake(newEnemyPosition)) {
      newEnemyPosition = randomGridPosition();
    }
    enemies.push(newEnemyPosition);
  }
  return enemies;
}

function drawEnemies(board) {
  enemies.forEach((enemy) => {
    const enemyElement = document.createElement('div');
    enemyElement.style.gridRowStart = enemy.y;
    enemyElement.style.gridColumnStart = enemy.x;
    enemyElement.classList.add('food');
    enemyElement.classList.add('enemy');
    board.appendChild(enemyElement);
  });
}

function updateEnemies() {
  // Enemies don't move for now
}

function checkDeath() {
  if (direction.x === 0 && direction.y === 0) return;
  if (outsideGrid() || snakeIntersection() || enemyCollision()) {
    alert('Game over!');
    snake = [{ x: 10, y: 10 }, { x: 9, y: 10 }, { x: 8, y: 10 }];
    direction = { x: 0, y: 0 };
    food = generateFood();
    enemies = generateEnemies();
  }
}

function enemyCollision() {
  return enemies.some(enemy => equalPositions(snake[0], enemy));
}

function outsideGrid() {
  return (
    snake[0].x < 1 ||
    snake[0].x > gridSize ||
    snake[0].y < 1 ||
    snake[0].y > gridSize
  );
}

function snakeIntersection() {
  return onSnake(snake[0], { ignoreHead: true });
}

window.addEventListener('keydown', (e) => {
  switch (e.key) {
    case 'ArrowUp':
      if (direction.y !== 0) break;
      direction = { x: 0, y: -1 };
      break;
    case 'ArrowDown':
      if (direction.y !== 0) break;
      direction = { x: 0, y: 1 };
      break;
    case 'ArrowLeft':
      if (direction.x !== 0) break;
      direction = { x: -1, y: 0 };
      break;
    case 'ArrowRight':
      if (direction.x !== 0) break;
      direction = { x: 1, y: 0 };
      break;
  }
});
