const canvas = document.querySelector("canvas")
const ctx = canvas.getContext("2d")

const maxSize = 700
let size = maxSize
canvas.width = size
canvas.height = size
let gridSize = 4

let cellSize = size / gridSize
const emptyCellValue = ""
let score = 0

const scoreValueDiv = document.querySelector("#score-value")
const resetGameDiv = document.querySelector("#reset-game")
const gridSizeDiv = document.querySelector("#grid-size")

let grid = []

const colors = {
  2: "#EEE4DA",
  4: "#EDE0C8",
  8: "#F2B179",
  16: "#F59563",
  32: "#F67C5F",
  64: "#F65E3B",
  128: "#EDCF72",
  256: "#EDCC61",
  512: "#EDC850",
  1024: "#EDC53F",
  2048: "#EDC22E",
  4096: "#3C3A32",
}

function generateEmptyGrid() {
  grid = [...new Array(gridSize)].map(() =>
    [...new Array(gridSize)].map(() => emptyCellValue)
  )
}

function adjustSize() {
  handleResize()
  cellSize = size / gridSize
}

function init() {
  score = 0
  updateScore()
  adjustSize()
  generateEmptyGrid()
  addRandomValueToGrid()
  addRandomValueToGrid()
  drawGrid()
}

init()

function getCellColor(value) {
  return colors[Object.keys(colors).sort((a, b) => b - a).find((cellValue) => value >= cellValue)] || "#CDC1B4"
}

function random(arr) {
  return arr[Math.floor(Math.random() * arr.length)]
}

function drawGrid() {
  ctx.clearRect(0, 0, size, size)
  for (var y = 0; y < gridSize; y++) {
    for (var x = 0; x < gridSize; x++) {
      ctx.fillStyle = getCellColor(grid[y][x])
      ctx.fillRect(x * cellSize, y * cellSize, cellSize, cellSize)
      ctx.fillStyle = "black"
      ctx.strokeRect(x * cellSize, y * cellSize, cellSize, cellSize)
      ctx.textAlign = "center";
      ctx.textBaseline = "middle"
      let fontSize = getGridCellFontSize()
      ctx.font = `${fontSize}px sans-serif`;
      ctx.fillText(grid[y][x], x * cellSize + cellSize / 2, y * cellSize + cellSize / 2, cellSize)
    }
  }
}

function getGridCellFontSize() {
  let fontSize = null


  if (gridSize <= 4) fontSize = 50
  else if (gridSize <= 8) fontSize = 40
  else if (gridSize <= 12) fontSize = 30
  else if (gridSize <= 16) fontSize = 23
  else if (gridSize <= 20) fontSize = 18
  else if (gridSize <= 24) fontSize = 15
  else fontSize = 12

  return fontSize
}

function addRandomValueToGrid() {
  const avaibleCoords = []
  for (var y = 0; y < gridSize; y++) {
    for (var x = 0; x < gridSize; x++) {
      if (grid[y][x] === emptyCellValue) avaibleCoords.push({ x, y })
    }
  }

  const rand = random(avaibleCoords)
  if (rand) grid[rand.y][rand.x] = random([2, 2, 2, 2, 2, 2, 2, 2, 2, 4])
}


function move(axis, value, customGrid = grid) {
  let isMoved = false;

  const handleLoop = (x, y) => {
    const cellValue = customGrid[y][x]
    if (cellValue !== emptyCellValue) {
      let newAxis = axis === "y" ? y : x

      while (axis === "y" ?
        customGrid[newAxis + value] && customGrid[newAxis + value][x] === emptyCellValue :
        customGrid[y][newAxis + value] === emptyCellValue) {
        newAxis += value
      }


      customGrid[y][x] = emptyCellValue

      if (axis === "y") {
        if (customGrid[newAxis + value] && customGrid[newAxis + value][x] === cellValue) {
          customGrid[newAxis + value][x] = cellValue * 2
          score += cellValue * 2
          isMoved = true
        }
        else {
          customGrid[newAxis][x] = cellValue
          if (newAxis !== y) isMoved = true
        }
      } else {
        if (customGrid[y][newAxis + value] === cellValue) {
          customGrid[y][newAxis + value] = cellValue * 2
          score += cellValue * 2
          isMoved = true
        }
        else {
          customGrid[y][newAxis] = cellValue
          if (newAxis !== x) isMoved = true
        }
      }
    }
  }

  if (axis === "y" && value < 0)
    for (var y = 1; y < gridSize; y++) {
      for (var x = 0; x < gridSize; x++) {
        handleLoop(x, y)
      }
    }
  else if (axis === "y" && value > 0)
    for (var y = gridSize - 1; y >= 0; y--) {
      for (var x = 0; x < gridSize; x++) {
        handleLoop(x, y)
      }
    }
  else if (axis === "x" && value < 0)
    for (var y = 0; y < gridSize; y++) {
      for (var x = 0; x < gridSize; x++) {
        handleLoop(y, x)
      }
    }
  else if (axis === "x" && value > 0)
    for (var y = 0; y < gridSize; y++) {
      for (var x = 0; x < gridSize; x++) {
        handleLoop(gridSize - 1 - y, x)
      }
    }

  return isMoved
}

function updateScore() {
  scoreValueDiv.innerHTML = score
}

function checkIsStuck() {
  const newGrid = structuredClone(grid)
  const isMovedUp = move("y", -1, newGrid)
  if (!isMovedUp) {
    const isMovedDown = move("y", 1, newGrid)
    if (!isMovedDown) {
      const isMovedRight = move("x", 1, newGrid)
      if (!isMovedRight) {
        const isMovedLeft = move("x", -1, newGrid)
        if (!isMovedLeft) return true
      }
    }
  }
  return false
}

function handleStuck() {
  const isStuck = checkIsStuck()
  if (isStuck) {
    setTimeout(() => {
      alert("I'm stuck stepbroo! help me")
      resetGameDiv.classList.remove("hidden")
    })
  }
}

function handleMove(axis, value) {
  const isMoved = move(axis, value)
  isMoved && addRandomValueToGrid()
  drawGrid()
  updateScore()
  handleStuck()
}

function handleResize() {
  size = Math.min(innerHeight, innerWidth, maxSize)
  canvas.width = size
  canvas.height = size
}

addEventListener("keydown", ({ key }) => {
  if (["w", "W", "ArrowUp"].includes(key)) {
    handleMove("y", -1)
  } else if (["s", "s", "ArrowDown"].includes(key)) {
    handleMove("y", 1)
  } else if (["a", "A", "ArrowLeft"].includes(key)) {
    handleMove("x", -1)
  } else if (["d", "D", "ArrowRight"].includes(key)) {
    handleMove("x", 1)
  }
})

resetGameDiv.addEventListener("click", function () {
  init()
  this.classList.add("hidden")
})

gridSizeDiv.addEventListener("input", function () {
  gridSize = +this.value || 4
  init()
})

addEventListener("resize", () => {
  adjustSize()
  drawGrid()
})