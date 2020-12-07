const ROWS = 20;
const COLS = 10;
const LENGTH = 20;
var quadrille;
var board;
var ex = 2, yi = 2;
var pepe,pepa;
function preload() {
createPoliomino(6,'🙈').then(value =>{
  pepe = value;
})
createPoliomino(6,'👾').then(value =>{
    pepa = value;
  })
}
function setup() {
  createCanvas(COLS * LENGTH, ROWS * LENGTH);
  board = createBoard(ROWS, COLS);
}

function draw() {
  background('#060621');
  drawBoard(board, LENGTH);
  if(pepa){drawQuadrille(pepa, ex, yi, LENGTH, 2, 'green');}
  if(pepe){
  drawQuadrille(pepe,ex,yi+5,LENGTH,2,"green");}
}

function keyPressed() {
  if (keyCode === LEFT_ARROW) {
    pepa.reflect();
  } else if (keyCode === RIGHT_ARROW) {
    pepe.rotate();
  }
  if (key === 'a') {
    ex--;
  }
  if (key === 'd') {
    ex++;
  }
  if (key === 'w') {
    yi++;
  }
  if (key === 's') {
    yi--;
  }
  if (key === 'g') {
    glue(pepe, yi, ex, false);
  }
  if (key === 'v') {
    glue(pepa, yi, ex);
  }
}

function glue(quadrille, row, col, validate = true) {
  if (validate) {
    try {
      let update = board.add(quadrille, row, col);
      if (update.memoryHitCounter === 0) {
        board = update.quadrille;
      }
    } catch (out_of_bounds) {
      console.log(out_of_bounds);
    }
  }
  else {
    board = board.add(quadrille, row, col).quadrille;
  }
}