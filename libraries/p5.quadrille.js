/**
 * In geometry, the square-tiling, square-tessellation or square-grid is a
 * regular tiling of the Euclidean plane.
 *
 * John Horton Conway called it a quadrille.
 *
 * The internal angle of the square is 90 degrees so four squares at a point
 * make a full 360 degrees. It is one of three regular tilings of the plane.
 * The other two are the triangular-tiling and the hexagonal-tiling.
 *
 * Refer to the [wikipedia square tiling](https://en.wikipedia.org/wiki/Square_tiling)
 * article for details.
 */
class Quadrille {
  /**
   * Constructs either an empty or a filled quadrille:
   * 1. Pass width and heigth to construct and empty quadrille (filled with 0's).
   * 2. Pass a 2D array of p5 colors, chars, emojis and zeros (for empty cells)
   * to construct a filled quadrille. 
   */
  constructor() {
    if (arguments.length === 1 && Array.isArray(arguments[0])) {
      this._memory2D = arguments[0];
    }
    if (arguments.length === 2 && typeof arguments[0] === 'number' && typeof arguments[1] === 'number') {
      this._memory2D = Array(arguments[0]).fill().map(() => Array(arguments[1]).fill(0));
    }
  }

  set memory2D(memory) {
    this._memory2D = memory;
  }

  get memory2D() {
    return this._memory2D;
  }

  get width() {
    return this._memory2D[0] ? this._memory2D[0].length : 0;
  }

  get height() {
    return this._memory2D.length;
  }

  /**
   * Sets all quadrille memory entries to 0.
   */
  clear() {
    this._memory2D = this._memory2D.map(x => x.map( y => y = 0));
  }

  /**
   * Horizontal reflection
   */
  reflect() {
    this._memory2D.reverse();
  }

  /**
   * π/2 clockwise rotation
   */
  rotate() {
    // credit goes to Nitin Jadhav: https://github.com/nitinja
    // who wrote about it here: https://stackoverflow.com/questions/15170942/how-to-rotate-a-matrix-in-an-array-in-javascript/58668351#58668351
    this._memory2D = this._memory2D[0].map((v, index) => this._memory2D.map(row => row[index]).reverse());
  }

  /**
   * Returns a deep copy of this quadrille. May be used in conjunction with
   * {@link reflect} and {@link rotate} to create different quadrille instances.
   */
  clone() {
    return new Quadrille(this._memory2D.map(array => { return array.slice(); }));
  }

  /**
   * Adds given quadrille to this quadrille at (x,y) and returns the resulted 
   * quadrille together with the number of memory collisions encountered.
   * 
   * This quadrille is not altered by a call to this method.
   * 
   * @param {Quadrille} quadrille buffer[rows][cols]
   * @param {number} x memory2D row index
   * @param {number} y memory2D column index
   * @throws 'To far down' and 'To far right' memory2D reading exceptions
   * @returns { Quadrille, number } { quadrille, memoryHitCounter } object literal
   */
  add(quadrille, x, y) {
    let memoryHitCounter = 0;
    // i. clone this quadrille
    let result = this.clone();
    // ii. fill cloned quadrille with passed quadrille
    for (let i = 0; i < quadrille.memory2D.length; i++) {
      // (e1) Check if current quadrille cell is too far down
      if (result.memory2D[x + i] === undefined) {
        throw new Error(`Too far down`);
      }
      for (let j = 0; j < quadrille.memory2D[i].length; j++) {
        // (e2) Check if current passed quadrille cell is too far right
        if (result.memory2D[x + i][y + j] === undefined) {
          throw new Error(`Too far right`);
        }
        // write only cloned quadrille cells covering (i,j)
        if (quadrille.memory2D[i][j]) {
          // update memory collisions counter if needed
          if (result.memory2D[x + i][y + j] !== 0) {
            memoryHitCounter++;
          }
          result.memory2D[x + i][y + j] = quadrille.memory2D[i][j];
        }
      }
    }
    // iii. return resulted quadrille and memory hit counter
    return { quadrille: result, memoryHitCounter };
  }
  changeNode(coords,newob){//can pass an array of coordinates or one coordinate and change it with the newvalue
    if(coords[0] instanceof Array)
    coords.forEach((coord2)=>{this._memory2D[coord2[1]][coord2[0]] = newob;})
    else
        this._memory2D[coords[0]][coords[1]] = newob;
  }
}
// Details here:
// https://github.com/processing/p5.js/blob/main/contributor_docs/creating_libraries.md
(function () {
  p5.prototype.createQuadrille = function(shape) {
    return new Quadrille(shape);
  };

  p5.prototype.createBoard = function(width, height) {
    return new Quadrille(width, height);
  };
  p5.prototype.createPoliomino = async(n,object)=>{//create a quadrille with a n-mino, filled with filler
    if(!(n>0 && typeof n === "number" && Math.floor(n)==n)){ throw new Error(`n-minos doesn't exist`);
   }else{
/*    poliominoGenerator(n,object).then(value =>{
     let poliquadrille = value;
    console.log("tried", poliquadrille);
    total = undefined;
    return poliquadrille;
   }); */
   let poliquadrille = await poliominoGenerator(n,object);
   return poliquadrille;
  }
  }
  p5.prototype.drawBoard = function(quadrille, LENGTH = 10, outlineWeight = 1, outline = this.color('#FBBC04'), fill = this.color('#859900')) {
    this.drawQuadrille(quadrille, 0, 0, LENGTH, outlineWeight, outline, fill);
  }

  p5.prototype.drawQuadrille = function(quadrille, row = 0, col = 0, LENGTH = 10, outlineWeight = 2, outline = 'magenta', fill = 'noColor') {
    this.push();
    this.translate(row * LENGTH, col * LENGTH);
    this.stroke(outline);
    this.strokeWeight(outlineWeight);
    for (let i = 0; i < quadrille.memory2D.length; i++) {
      for (let j = 0; j < quadrille.memory2D[i].length; j++) {
        // handles both zero and empty (undefined) entries as well
        this.push();
        if (quadrille.memory2D[i][j]) {
          if (quadrille.memory2D[i][j] instanceof p5.Color) {
            this.fill(quadrille.memory2D[i][j]);
            this.rect(j * LENGTH, i * LENGTH, LENGTH, LENGTH);
          }
          else if (typeof quadrille.memory2D[i][j] === 'string') {
            this.textSize(LENGTH);
            this.text(quadrille.memory2D[i][j], j * LENGTH, i * LENGTH, LENGTH, LENGTH);
            this.noFill();
            this.rect(j * LENGTH, i * LENGTH, LENGTH, LENGTH);
          }
        }
        else if (fill !== 'noColor') {
          this.fill(fill);
          this.rect(j * LENGTH, i * LENGTH, LENGTH, LENGTH);
        }
        this.pop();
      }
    }
    this.pop();
  }
  p5.prototype.changeNode = function(quadrille,coords,newob){//can pass an array of coordinates or one coordinate and change it with the newvalue
    quadrille.changeNode(coords,newob);
    return quadrille._memory2D;}
})();
var grid;
var halt;
var total, poliprocess;//the polyomino made quadrille, verify polyomino in process
var idinterval1, idinterval2;
var net;
var dirs = [[0,1],[1,0],[0,-1],[-1,0]];
var nets;
var adder;
var children = {};
var stime,dtime,ldtime ;//start time, total time of generating poliominos,verification of the end
//extra functions for polyomino generations
const poliominoGenerator = async(n,object)=>{
  var i,fn;
  console.log("generating ",n,"-minos");
 dtime=0,ldtime = 0,poliprocess = true;
  grid = {
   x: 2*n-3,
   y: 2*n-1,}
  halt = false;
  stime = new Date().getTime();//initial time
  net = [[(grid.x-1)/2,(grid.y-1)/2]];//,[(grid.x-1)/2 ,(grid.y-1)/2 + 1]];
  nets = [];//array with all pieces
  fn = function () {return ;};
  for (i=n-1; i>0; i--) {
   fn = makeAdder(i,fn);
  }
  adder = fn; 
  picture(); 
  let poliomino = await asynchonic(n,object);
  return poliomino
}
function asynchonic(n,filler){
  console.log("lol");
  idinterval2= setInterval(picture,1);
  return new Promise((resolve)=>{
    idinterval1 = setInterval(()=>{ 
    if(ldtime == dtime){
    let ln=nets[nets.length-1];
    console.log(n,"poliomino took ",dtime, "seconds");
    clearInterval(idinterval1);
    clearInterval(idinterval2);
    if(nets.length >=2){
      let tried = ln[Math.floor(Math.random()* ln.length)];
       let ready = matricialize(tried,filler);
       resolve(ready);
    }
  }else
    ldtime = dtime},20);
  }) 
}
function matricialize(tried,filler){
  let maxx=0,maxy =0,miny=0;
  tried.forEach((point) => {
    if(point[1]>maxy) maxy = point[1];
    if(point[1]<miny) miny = point[1];
    if(point[0]>maxx) maxx = point[0];
  });
  tried.forEach((point) => {
    if(point[1]>maxy) maxy = point[1];
    if(point[1]<miny) miny = point[1];
    if(point[0]>maxx) maxx = point[0];
  });
  let total = createQuadrille(Array.from({length: (maxy-miny+1)},()=>Array.from({length: maxx+1},()=>0)));
  tried.forEach((point)=>{
    point[1]=point[1]-miny;});
    if(filler)
    total.changeNode(tried,filler);
    else total.changeNode(tried,color('cyan'));
    console.table(total);
    return total;
}
function matricial(){
  if(ldtime == dtime){
    let filler = arguments["0"]["1"],n = arguments["0"]["0"];
    let maxx=0,maxy =0,miny=0,ln=nets[nets.length-1];
    console.log(n,"poliomino took ",dtime, "seconds");
    clearInterval(idinterval1);
    clearInterval(idinterval2);
    if(nets.length >=2){
      let tried = ln[Math.floor(Math.random()* ln.length)];
      tried.forEach((point) => {
        if(point[1]>maxy) maxy = point[1];
        if(point[1]<miny) miny = point[1];
        if(point[0]>maxx) maxx = point[0];
      });
		let total = createQuadrille(Array.from({length: (maxy-miny+1)},()=>Array.from({length: maxx+1},()=>0)));
		tried.forEach((point)=>{
      point[1]=point[1]-miny;});
      if(filler)
      total.changeNode(tried,filler);
      else total.changeNode(tried,color('cyan'));
      resolve(total);
      console.table(total);
      return total;
    }
  }else
    ldtime = dtime  }
  function checkNet(n,ns) {
    var i,j,k,l,nl,nn,nnn,equal;
    nl = n.length;
    if (!ns[nl])
    return false;
    nn = normaliseNet(n);
    for (j=0;j<2;j++) {
for (i=0;i<nn.length;i++) {
  nn[i] = [nn[i][1],nn[i][0]];
}
for (k=0;k<4;k++) {
    for (i=0;i<nn.length;i++) {
      nn[i] = [-nn[i][1],nn[i][0]];
    }
    nnn = normaliseNet(nn);
    for (l=0;l<ns[nl].length;l++) {
      equal = true;
      for (i=0; i< nnn.length; i++) {
        if (nnn[i][0] != ns[nl][l][i][0]) {
          equal = false;
          break;
        }
        if (nnn[i][1] != ns[nl][l][i][1]) {
          equal = false;
          break;
        }
      }
      if (equal) {
      return ns[nl][l];
    }
  }
}
}
return false;
}
function normaliseNet(n) {
  var nn,i;
  nn = [];
  for (i=0;i<n.length;i++) {
    nn[i] = [n[i][0],n[i][1]];
  }
  nn.sort(blockSort);
  for (i=1;i<nn.length;i++) {
nn[i][0] -= nn[0][0];
nn[i][1] -= nn[0][1];
  }
  nn[0] = [0,0];
  return nn;
}
function picture(){
  var pnet,rnet;
  if (halt) {
return;
  }
   adder(true);
  rnet = checkNet(net,nets);
  if (rnet) {
pnet = rnet;
  } else {
if (!nets[net.length])
    nets[net.length] = [];
pnet = normaliseNet(net);
nets[net.length].push(pnet);
  }
  dtime = ((new Date().getTime() - stime)/1000).toFixed(3);
;}

function makeAdder (lvl,fn) {
  var sq = 0;
  var nsq = -1;
  return function (stop) {
var newsq,isnew,i,added,rnet,pnet;
if (net.length < lvl) {
    return false;
}
if (fn()) {
    return true;
}
if (net.length == lvl) {
    sq = 0;
    nsq = - 1;
}
net.length = lvl;
added = false;
while (!added) {
    nsq++;
    if (nsq == 4) {
  nsq = 0;
  sq++;
    }
    if (sq >= lvl) {
  if (stop) {
      halt = true;
  }
  break;
    }
    newsq = [net[sq][0]+dirs[nsq][0],net[sq][1]+dirs[nsq][1]];
    isnew = true;
    for (i=0;i<lvl;i++) {
  if (net[i][0] == newsq[0] && net[i][1] == newsq[1]) {
      isnew = false;
      break;
  }
    }
    if (isnew) {
  pnet = normaliseNet(net);
  net.push(newsq);
  rnet = checkNet(net,nets);
  if (rnet) {
      if (!children[JSON.stringify(rnet)])
    children[JSON.stringify(rnet)] = {};
      children[JSON.stringify(rnet)][JSON.stringify(pnet)] = true;
      net.pop();
      added = false;
  } else {
      added = true;
  }
    }
}
return added;
  }
}
function blockSort(p,q) {
  if (p[0] < q[0]) {
return -1;
  }
  if (p[0] > q[0]) {
return 1;
  }
  if (p[1] < q[1]) {
return 1;
  }
  if (p[1] > q[1]) {
return -1;
  }
  return 0;
}