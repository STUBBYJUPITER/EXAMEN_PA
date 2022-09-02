// iniciar canvas
let maze = document.querySelector(".maze");
let ctx = maze.getContext("2d");
let generationComplete = false;
let skin= new Image();
let current;
let goal;


//clase para construir el laberinto
class Maze {
  constructor(size, rows, columns) {
    this.size = size;
    this.columns = columns;
    this.rows = rows;
    this.grid = [];
    this.stack = [];
  }

  // asignar a la cuadricula la cantidad de filas y columans en la variable this.grid
  setup() {
    for (let r = 0; r < this.rows; r++) {
      let row = [];
      for (let c = 0; c < this.columns; c++) {
        // Cree una nueva instancia de la clase Cell para cada elemento en la matriz 2D y empujar a la matriz de cuadrícula del laberinto
        let cell = new Cell(r, c, this.grid, this.size);
        row.push(cell);
      }
      this.grid.push(row);
    }
    // establecer el grid
    current = this.grid[0][0];
    this.grid[this.rows - 1][this.columns - 1].goal = true;
  }

  // funcion draw para dibujar las celdas de la configuracion en el array de canvas
  draw() {
    maze.width = this.size;
    maze.height = this.size;
    maze.style.background = "black";
    // establecer la primera celda como visitada
    current.visited = true;
    // Recorre la matriz de la cuadricula y se llama al metodo show para cada instancia de celda
    for (let r = 0; r < this.rows; r++) {
      for (let c = 0; c < this.columns; c++) {
        let grid = this.grid;
        grid[r][c].show(this.size, this.rows, this.columns);
      }
    }
    // Esta función asignará la variable 'next' a la celda aleatoria de las celdas actuales disponibles en las celdas vecinas
    let next = current.checkNeighbours();
    //Si hay una celda vecina no visitada
    if (next) {
      next.visited = true;
      // se agraga la celda actual a la pila para retroceder
      this.stack.push(current);
      // esta función resaltará la celda actual en la cuadrícula. Las columnas de parámetros se pasan
      // para establecer el tamaño de la celda
      current.highlight(this.columns);
      // Esta función compara la celda actual con la celda siguiente y elimina las paredes relevantes para cada celda
      current.removeWalls(current, next);
      // Establecer la siguiente celda en la celda actual
      current = next;

      // De lo contrario, si no hay vecinos disponibles, se comienza a retroceder usando la pila
    } else if (this.stack.length > 0) {
      let cell = this.stack.pop();
      current = cell;
      current.highlight(this.columns);
    }
    // si no hay mas items en el stack entonces todas las celdas han sido visitdas
    if (this.stack.length === 0) {
      generationComplete = true;
      return;
    }

    // recursividad hasta que la pila este vacia
    window.requestAnimationFrame(() => {
      this.draw();
    });

  }
}

class Cell {
  // el constructor toma las variables rowNum y colNum que se utilizan para coordenadas para dibujar en canvas.
  constructor(rowNum, colNum, parentGrid, parentSize) {
    this.rowNum = rowNum;
    this.colNum = colNum;
    this.visited = false;
    this.walls = {
      topWall: true,
      rightWall: true,
      bottomWall: true,
      leftWall: true,
    };
    this.goal = false;
    // parentGrid se pasa para habilitar el método checkneighbours
    // parentSize se pasa para establecer el tamaño de cada celda en la cuadrícula
    this.parentGrid = parentGrid;
    this.parentSize = parentSize;
  }

  checkNeighbours() {
    let grid = this.parentGrid;
    let row = this.rowNum;
    let col = this.colNum;
    let neighbours = [];
    // se devuelve indefinido donde el índice está fuera de los límites
    let top = row !== 0 ? grid[row - 1][col] : undefined;
    let right = col !== grid.length - 1 ? grid[row][col + 1] : undefined;
    let bottom = row !== grid.length - 1 ? grid[row + 1][col] : undefined;
    let left = col !== 0 ? grid[row][col - 1] : undefined;

    // si los siguientes moviemientos  no son indefinidos, se agregan al array neighbours
    if (top && !top.visited) neighbours.push(top);
    if (right && !right.visited) neighbours.push(right);
    if (bottom && !bottom.visited) neighbours.push(bottom);
    if (left && !left.visited) neighbours.push(left);

    // la variable neighbours se elije aleatoriamente y luego retona el valor random
    if (neighbours.length !== 0) {
      let random = Math.floor(Math.random() * neighbours.length);
      return neighbours[random];
    } else {
      return undefined;
    }
  }

  // Funciones de dibujo  para cada celd, si el muro relevante se establece en verdadero en el constructor de celdas
  drawTopWall(x, y, size, columns, rows) {
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x + size / columns, y);
    ctx.stroke();
  }

  drawRightWall(x, y, size, columns, rows) {
    ctx.beginPath();
    ctx.moveTo(x + size / columns, y);
    ctx.lineTo(x + size / columns, y + size / rows);
    ctx.stroke();
  }

  drawBottomWall(x, y, size, columns, rows) {
    ctx.beginPath();
    ctx.moveTo(x, y + size / rows);
    ctx.lineTo(x + size / columns, y + size / rows);
    ctx.stroke();
  }

  drawLeftWall(x, y, size, columns, rows) {
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x, y + size / rows);
    ctx.stroke();
  }

  // Resalta la celda actual en la cuadrícula. Las columnas se pasan una vez más para establecer el tamaño de la cuadrícula.
  highlight(columns) {
    // Sumas y restas agregadas para que la celda resaltada cubra las paredes
    let x = (this.colNum * this.parentSize) / columns + 1;
    let y = (this.rowNum * this.parentSize) / columns + 1;
    //skin del jugador
    skin.src="p1.png";
    ctx.fillStyle = "purple";
    ctx.fillRect(
      x,
      y,
      this.parentSize / columns - 3,
      this.parentSize / columns - 3
    );
  }

  removeWalls(cell1, cell2) {
    // se compara con dos celdas en el eje x
    let x = cell1.colNum - cell2.colNum;
    // Elimina las paredes relevantes si hay una diferente en el eje x
    if (x === 1) {
      cell1.walls.leftWall = false;
      cell2.walls.rightWall = false;
    } else if (x === -1) {
      cell1.walls.rightWall = false;
      cell2.walls.leftWall = false;
    }
    // se compara con dos celdas en el eje x
    let y = cell1.rowNum - cell2.rowNum;
    // Elimina las paredes relevantes si hay una diferente en el eje x
    if (y === 1) {
      cell1.walls.topWall = false;
      cell2.walls.bottomWall = false;
    } else if (y === -1) {
      cell1.walls.bottomWall = false;
      cell2.walls.topWall = false;
    }
  }

  // Dibuja cada una de las celdas en el lienzo del laberinto.
  show(size, rows, columns) {
    let x = (this.colNum * size) / columns;
    let y = (this.rowNum * size) / rows;
    ctx.strokeStyle = "#ffffff";
    ctx.fillStyle = "black";
    ctx.lineWidth = 2;
    if (this.walls.topWall) this.drawTopWall(x, y, size, columns, rows);
    if (this.walls.rightWall) this.drawRightWall(x, y, size, columns, rows);
    if (this.walls.bottomWall) this.drawBottomWall(x, y, size, columns, rows);
    if (this.walls.leftWall) this.drawLeftWall(x, y, size, columns, rows);
    if (this.visited) {
      ctx.fillRect(x + 1, y + 1, size / columns - 2, size / rows - 2);
    }
    if (this.goal) {
      ctx.fillStyle = random_rgba();
      ctx.fillRect(x + 1, y + 1, size / columns - 2, size / rows - 2);
    }
  }

}
function random_rgba() {
    var o = Math.round, r = Math.random, s = 255;
    return 'rgba(' + o(r()*s) + ',' + o(r()*s) + ',' + o(r()*s) + ',' + r().toFixed(1) + ')';
}
