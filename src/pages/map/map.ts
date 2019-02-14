import { Component } from '@angular/core';
import { StageService } from '../../services/stage.service';

interface FloorInfo {
  img: string;
  points: number[];
}

@Component({
  selector: 'page-map',
  templateUrl: 'map.html'
})
export class MapPage {

  floors: FloorInfo[] = [
    {img: './assets/images/plans/00.png', points: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]},
    {img: './assets/images/plans/01.png', points: []},
    {img: './assets/images/plans/02.png', points: [11, 12]},
    {img: './assets/images/plans/03.png', points: [13]},
  ];

  current: number = 0;
  
  constructor(
    private stageService: StageService,
  ) {
    for (let i=0; i<this.floors.length; i++) {
      this.floors[i].points.map(p => {
        if (p+1 == stageService.lastStageId) {
          this.current = i;
        }
      })
    }
  }

  stageIsActive(stageId: number): boolean {
    return this.stageService.stageIsActive(stageId);
  }

  up() {
    this.current++;
	}

	down() {
    this.current--;
  } 

}
