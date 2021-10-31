import {AfterViewInit, Component, ElementRef, OnInit, ViewChild} from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit, AfterViewInit {

  /** Template reference to the canvas element */
  @ViewChild('canvasEl', {static: false}) canvasEl!: ElementRef<HTMLCanvasElement>;

  /** Canvas 2d context */
  private context!: CanvasRenderingContext2D;

  colsNum!: number;
  rowsNum!: number;
  resolution!: number;
  currentGridState!: number[][];

  constructor() {}

  /** Build grid */
  getInitialGrid(): number[][]  {
    this.canvasEl.nativeElement.width = 1600;
    this.canvasEl.nativeElement.height = 700;
    this.resolution = 10;
    this.colsNum = this.canvasEl.nativeElement.width / this.resolution;
    this.rowsNum = this.canvasEl.nativeElement.height / this.resolution;

    return new Array(this.colsNum).fill(0)
      .map(() => new Array(this.rowsNum).fill(0));
  }

  /** Randomize initial grid with 0 and 1 numbers */
  randomizeInitialGrid(initialGrid: number[][]): number[][] {
    return initialGrid.map(arr => arr.map(() => Math.floor(Math.random() * 2)));
  }

  /** Get next cells generation array */
 getNextGenCells(): number[][] {
    //const currentCellsGen = this.currentGridState.map(arr => arr.map(cell => cell.this.currentGridState));
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
  paintGridCells() {
    this.context = (this.canvasEl.nativeElement as HTMLCanvasElement).getContext('2d')!;

    for (let col = 0; col < this.currentGridState.length; col++) {
      for (let row = 0; row < this.currentGridState[col].length; row++) {
        const cell = this.currentGridState[col][row];

        this.context.beginPath();
        this.context.rect(col * this.resolution, row * this.resolution, this.resolution, this.resolution);
        this.context.fillStyle = cell ? 'gray' : 'white';
        this.context.fill();
        this.context.stroke();
      }
    }
  }

  /** Updates grid with new data */
  updateGrid() {
    this.currentGridState = this.getNextGenCells();
    this.paintGridCells();
    requestAnimationFrame(this.updateGrid.bind(this));
  }

  ngAfterViewInit() {
    const initialGrid = this.getInitialGrid();
    this.currentGridState = this.randomizeInitialGrid(initialGrid);
    requestAnimationFrame(this.updateGrid.bind(this));
  }

  ngOnInit() {

  }

}


