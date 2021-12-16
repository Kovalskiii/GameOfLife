import {AfterViewInit, Component, ElementRef, HostListener, OnInit, ViewChild} from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements AfterViewInit {

  /** Template reference to the canvas element */
  @ViewChild('canvasEl', {static: false}) canvasEl!: ElementRef;

  /** Canvas 2d context */
  private context!: CanvasRenderingContext2D;

  colsNum!:          number;
  rowsNum!:          number;
  resolution!:       number;
  currentGridState!: number[][];
  animReqId!:        number;
  gameStarted:       boolean = false;
  gameStopped:       boolean = false;
  gridIsFilled:      boolean = false;

  constructor() {}

  /** Build grid */
  getInitialGrid(): number[][]  {
    this.canvasEl.nativeElement.width = this.canvasEl.nativeElement.offsetWidth; //1400
    this.canvasEl.nativeElement.height = this.canvasEl.nativeElement.offsetHeight; //700
    // this.canvasEl.nativeElement.width = 850; //1400
    // this.canvasEl.nativeElement.height = 650; //700
    console.log(this.canvasEl.nativeElement.width);
    console.log(this.canvasEl.nativeElement.height);
    this.resolution = 12;
    this.colsNum = Math.round(this.canvasEl.nativeElement.width / this.resolution);
    this.rowsNum = Math.round(this.canvasEl.nativeElement.height / this.resolution);

    return new Array(this.colsNum).fill(0)
      .map(() => new Array(this.rowsNum).fill(0));
  }

  /** Randomize initial grid with 0 and 1 numbers */
  randomizeInitialGrid(initialGrid: number[][]): number[][] {
    return initialGrid.map(arr => arr.map(() => Math.floor(Math.random() * 2)));
  }

  /** Fill initial grid with the custom data from the screen (by click on cells) */
  fillInitialGrid(event: MouseEvent) {
    if (!this.gameStarted) {
      const rect = this.canvasEl.nativeElement.getBoundingClientRect()
      const xCoord = event.clientX - rect.left;
      const yCoord = event.clientY - rect.top;

      const colNumber = Math.floor(xCoord / this.resolution);
      const rowNumber = Math.floor( yCoord / this.resolution);

      console.log("x: " + xCoord + " y: " + yCoord);
      console.log("xCol: " + colNumber + " yRow: " + rowNumber);

      if (this.currentGridState[colNumber][rowNumber] == 0) {
        this.currentGridState[colNumber][rowNumber] = 1;
      }
      else {
        this.currentGridState[colNumber][rowNumber] = 0;
      }

      this.paintGridCells(this.currentGridState);
      this.gridIsFilled = true;
    }
  }

  /** Get next cells generation array */
  getNextGenCells(): number[][] {
    const currentCellsGen = this.currentGridState.map(arr => arr.slice());

    for (let col = 0; col < this.currentGridState.length; col++) {
      for (let row = 0; row < this.currentGridState[col].length; row++) {

        const cell = this.currentGridState[col][row];
        let neighboursNum = 0;

        for (let i = -1; i < 2; i++) {
          for (let j = -1; j < 2; j++) {
            if (i === 0 && j === 0) {
              continue;
            }

            const xCell = col + i;
            const yCell = row + j;

            if (xCell >= 0 && yCell >= 0 && xCell < this.colsNum && yCell < this.rowsNum) {
              const currentNeighbour = this.currentGridState[col + i][row + j];
              neighboursNum += currentNeighbour;
            }
          }
        }

        /* Game rules */
        if ((cell === 1 && neighboursNum < 2) || (cell === 1 && neighboursNum > 3)) {
          currentCellsGen[col][row] = 0;
        } else if (cell === 0 && neighboursNum === 3) {
          currentCellsGen[col][row] = 1;
        }
      }
    }
    return currentCellsGen;
  }

  /** Draw(paint) cells on the grid ( 1 = live cell, 0 = dead cell) */
  paintGridCells(grid: number[][]) {
    this.context = (this.canvasEl.nativeElement as HTMLCanvasElement).getContext('2d')!;

    for (let col = 0; col < grid.length; col++) {
      for (let row = 0; row < grid[col].length; row++) {
        const cell = grid[col][row];

        this.context.beginPath();
        this.context.rect(col * this.resolution, row * this.resolution, this.resolution, this.resolution);
        this.context.fillStyle = cell ? 'gray' : 'white';
        this.context.fill();
        this.context.strokeStyle = 'lightgray';
        this.context.stroke();

      }
    }
  }

  /** Updates grid with new data */
  updateGrid() {
    if (!this.gameStopped) {
      this.currentGridState = this.getNextGenCells();
      this.paintGridCells(this.currentGridState);
      this.animReqId = requestAnimationFrame(this.updateGrid.bind(this));
    }
  }

  /** Starts game (cells animation) / Resume game */
  startGame() {
    this.animReqId = requestAnimationFrame(this.updateGrid.bind(this));
    this.gameStarted = true;
    this.gameStopped = false;
  }

  /** Stops game (cells animation) / Pause game */
  stopGame() {
    if (this.animReqId) {
      cancelAnimationFrame(this.animReqId);
      this.gameStarted = false;
      this.gameStopped = true;
    }
  }

  /** Clear grid cells */
  clearGrid() {
    this.stopGame();
    this.currentGridState = this.getInitialGrid();
    this.paintGridCells(this.currentGridState);
    this.gameStopped = false;
    this.gridIsFilled = false;
  }

  /** Fill grid with random values */
  randomizeGrid() {
    const initialGrid = this.getInitialGrid();
    this.currentGridState = this.randomizeInitialGrid(initialGrid);
    this.paintGridCells(this.currentGridState);
    this.gridIsFilled = true;
  }

  ngAfterViewInit() {
    const initialGrid = this.getInitialGrid();
    this.paintGridCells(initialGrid);
    this.currentGridState = initialGrid;
  }

  @HostListener('window:resize', ['$event'])
  sizeChange(event: any) {
    window.location.reload();
  }
}


