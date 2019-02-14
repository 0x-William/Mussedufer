import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { Events } from 'ionic-angular';
import { TranslateService } from '../../services/translate.service';
import { StageService } from '../../services/stage.service';
import { GuidePage } from '../guide/guide';

@Component({
  selector: 'page-language',
  templateUrl: 'language.html'
})
export class LanguagePage {

  constructor(
    private navCtrl: NavController,
    private events: Events,
    private translateService: TranslateService,
    private stageService: StageService,
  ) { }

  selectLang(lang: string) {
    Promise.all([
      this.translateService.load(lang),
      this.stageService.load(lang),
    ]).then(() => {
      this.stageService.checkTags()
      .then(() => {
        this.stageService.refreshMenu();
      })
      this.events.publish('refreshLeftMenu');
      this.navCtrl.setRoot(GuidePage);
    });    
  }

}
