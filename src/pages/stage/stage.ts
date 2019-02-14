import { Component, ViewChild, ChangeDetectorRef } from '@angular/core';
import { NavParams } from 'ionic-angular';
import { StageService, Stage } from '../../services/stage.service';
import { AudioPlayer } from './audio-player';

@Component({
  selector: 'page-stage',
  templateUrl: 'stage.html'
})
export class StagePage {

  private stage: Stage;
  private hasClocheAudio: boolean;
  private isReadmore: boolean;

  @ViewChild('audioPlayer') audioPlayer: AudioPlayer;
  @ViewChild('clocheAudioPlayer') clocheAudioPlayer: AudioPlayer;

  constructor(
    private navParam: NavParams,
    private stageService: StageService,
    private ref:ChangeDetectorRef
  ) {    
    let stageId = this.navParam.get('stageId') || 1;
    this.stage = this.stageService.get(stageId);    
    this.stageService.lastStageId = stageId;

    if (!this.stage.tag.isActive) {
      this.stageService.setActive(this.stage.id, true);
      this.stageService.refreshMenu();
    }

    this.isReadmore = this.stage.read_more;
    this.hasClocheAudio = stageId == 13;
  }

  ionViewWillLeave() {
    if (this.audioPlayer) {
      this.audioPlayer.stop();
    }
    if (this.clocheAudioPlayer) {
      this.clocheAudioPlayer.stop();
    }
  }

  clickReadMore() {
    this.isReadmore = !this.isReadmore;
    this.ref.detectChanges();
  }

}
