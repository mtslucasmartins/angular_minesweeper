import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  public regions: any[][];

  public numberOfXRegions = 16;

  public numberOfYRegions = 30;

  public numberOfMines = 99;

  public gameover() {
    alert('Game Over');
  }

  public reveal(x: number, y: number): void {
    try {
      // gets the reference.
      const region = this.regions[x][y];

      if (region.revealed) {
        return;
      }

      if (typeof region !== 'undefined' && region !== null) {
        // marks the region as revealed.
        region.revealed = true;

        // too bad mate.
        if (region.state) {

        } else {
          // gets the number of bombs surrounding.
          region.value = this.surroundings(x, y);

          // if there are 0 bombs nerby, reveals neighboring regions.
          if (region.value === 0) {
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

        // updates the regionon the array.
        this.regions[x][y] = region;
      }
    } catch (e) {
      console.log(e);
    }
  }

  public flag() {

  }

  public onRegionRightClick(x: number, y: number) {
    // gets the reference.
    const region = this.regions[x][y];

    region.marked = !region.marked;

    this.regions[x][y] = region;

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


  public ngOnInit() {
    const size = this.numberOfXRegions * this.numberOfYRegions;
    const minePositions: any[] = [];

    let minesCount = 0;
    while (minesCount < this.numberOfMines) {
      minesCount++;
      let minePosition = 0;
      do {
        minePosition = Math.floor(Math.random() * size);
      } while (minePositions.includes(minePosition));
      minePositions.push(minePosition);
    }
    let xs = new Array<any>();
    for (let x = 0; x < this.numberOfXRegions; x++) {
      let ys = new Array<any>();
      for (let y = 0; y < this.numberOfYRegions; y++) {
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

}
