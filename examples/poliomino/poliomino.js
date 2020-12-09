const ROWS = 20;
const COLS = 30;
const LENGTH = 20;
var board;
var ex = 2, yi = 2;
var pepe,pepu;
function setup() {
  let word = createCanvas(COLS * LENGTH, ROWS * LENGTH);
  board = createBoard(ROWS, COLS);
  let div = document.getElementById("canvas");
 word.parent(div);
 createPoliomino(5,'🥰').then(value =>{
  pepu = value;
  createPoliomino(7,'👾').then(value=>{
    pepe = value
  })
}) 
}

function draw() {
  background('#060621');
  drawBoard(board, LENGTH);
  if(pepe){
  drawQuadrille(pepe,ex+5,yi,LENGTH,2,"green");}
  if(pepu){
  drawQuadrille(pepu,ex,yi+5,LENGTH,2,"green");}
}

function keyPressed() {
  if (keyCode === LEFT_ARROW) {
    pepu.reflect();
  } else if (keyCode === RIGHT_ARROW) {
    pepe.rotate();
  }
  if (key === 'a') {
    ex--;
  }
  if (key === 'd') {
    ex++;
  }
  if (key === 's') {
    yi++;
  }
  if (key === 'w') {
    yi--;
  }
  if (key === 'g') {
    glue(pepe, yi, ex+5, false);
  }
  if (key === 'v') {
    glue(pepu, yi+5, ex);
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