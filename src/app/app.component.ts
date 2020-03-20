import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  @ViewChild('field', { static: true }) field: ElementRef;

  public difficulty: 'easy' | 'medium' | 'hard' | 'custom' = 'medium';

  public configs = {
    easy: {
      width: 10,
      height: 10,
      bombs: 10
    }, 
    medium: {
      width: 12,
      height: 12,
      bombs: 4
    }  
  } 




  public regions: any[][];

  public numberOfXRegions = 10;

  public numberOfYRegions = 10;

  public numberOfMines = 99;

  public flagsCount = 0;;

  public isGameOver: boolean;

  public isMouseDown: boolean;


  public mousedown() {
    this.isMouseDown = true;
  }
  public mouseup() {
    this.isMouseDown = false;
  }


  public shake() {
    this.field.nativeElement.classList.add('shake');

    setTimeout(() => {
      this.field.nativeElement.classList.remove('shake');
    }, 350);
  }

  public gameover() {
    this.isGameOver = true;

    const explosion = new Audio();

    explosion.src = 'assets/sounds/bomb_explosion (short).mp3';
    explosion.load();
    explosion.play();
  }

  public reveal(x: number, y: number): void {
    try {
      const region = this.regions[x][y];
      if (region.revealed) {
        return;
      }
      if (typeof region !== 'undefined' && region !== null) {
        region.revealed = true;
        if (region.state) {
          this.gameover();
        } else {
          region.value = this.surroundings(x, y);
          if (region.value === 0) {
            this.shake();
            if (x >= 0 && x <= this.numberOfXRegions) {
              this.reveal(x - 1, y);
              this.reveal(x + 1, y);
              if (y >= 0 && y <= this.numberOfYRegions) {
                this.reveal(x - 1, y - 1);
                this.reveal(x - 1, y + 1);
                this.reveal(x, y - 1);
                this.reveal(x, y + 1);
                this.reveal(x + 1, y - 1);
                this.reveal(x + 1, y + 1);
              }
            }
          }
        }
        this.regions[x][y] = region;
      }
    } catch (e) { }
  }

  public flag() {

  }

  public onRegionRightClick(x: number, y: number) {
    const region = this.regions[x][y];
    if (!region.revealed) {
      region.marked = !region.marked;

      this.flagsCount += region.marked ? 1 : -1;

      this.regions[x][y] = region;
    }
    return false;
  }

  public onRegionLeftClick(x: number, y: number) {
    const region = this.regions[x][y];
    if (region.marked) {
      return;
    } else {
      if (!region.revealed) {
        this.reveal(x, y);
      }
    }
  }

  public surroundings(x: number, y: number): number {
    let count = 0;

    const hasBomb = ((x: number, y: number): number => {
      try {
        return this.regions[x][y].state;
      } catch (e) { return 0; }
    });

    count += hasBomb(x - 1, y - 1) ? 1 : 0;
    count += hasBomb(x - 1, y) ? 1 : 0;
    count += hasBomb(x - 1, y + 1) ? 1 : 0;
    count += hasBomb(x, y - 1) ? 1 : 0;
    count += hasBomb(x, y + 1) ? 1 : 0;
    count += hasBomb(x + 1, y - 1) ? 1 : 0;
    count += hasBomb(x + 1, y) ? 1 : 0;
    count += hasBomb(x + 1, y + 1) ? 1 : 0;

    return count;
  }

  public putTheMines(howMany: number, area: number): number[] {
    let mines: number[] = [];
    let minesLeft = howMany;
    while (minesLeft > 0) {
      let location = 0;
      do {
        location = Math.floor(Math.random() * area);
      } while (mines.includes(location));
      mines.push(location);
      minesLeft--;
    }  
    return mines;
  }

  public ngOnInit() {
    const difficulty = this.difficulty; 

    this.regions = [[]];
    this.isGameOver = false;

    this.flagsCount = 0;

    const WIDTH = this.configs[difficulty].width;
    const HEIGHT = this.configs[difficulty].height;
    const BOMBS = this.configs[difficulty].bombs;

    const size = WIDTH * HEIGHT;
    const minePositions: any[] = this.putTheMines(BOMBS, size);

    let xs = new Array<any>();
    for (let x = 0; x < HEIGHT; x++) {
      let ys = new Array<any>();
      for (let y = 0; y < WIDTH; y++) {
        if (minePositions.includes((x + 1) * (y + 1))) {
          ys.push({ value: 0, state: true, marked: false, revealed: false });
        } else {
          ys.push({ value: 0, state: false, marked: false, revealed: false });
        }
      }
      xs.push(ys);
    }

    this.regions = xs;
  }

  flagsLeft(): number {
    return this.configs[this.difficulty].bombs - this.flagsCount;
  }

}
