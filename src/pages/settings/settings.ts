import { Component } from '@angular/core';
import { NavController, AlertController } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { TranslateService } from '../../services/translate.service';
import { BeaconService } from '../../services/beacon.service';
import { StageService } from '../../services/stage.service';
import { LanguagePage } from '../../pages/language/language';

@Component({
  selector: 'page-settings',
  templateUrl: 'settings.html'
})
export class SettingsPage {

  datevisite: string;

  constructor(
    private navCtrl: NavController,
    private alertCtrl: AlertController,
    private storage: Storage,
    private translateService: TranslateService,
    private beaconService: BeaconService,
    private stageService: StageService,
  ) { }

  ngOnInit() {
    this.storage.get('datevisite')
    .then(datevisite => {
      this.datevisite = datevisite || '';
    });    
  }

  goToLanguage() {
    this.navCtrl.setRoot(LanguagePage);
  }

  activeAllStage() {
    this.stageService.activeAllStage();    
    this.alertCtrl.create({
      title: this.translateService.get('dialogs.d1.title'),
      subTitle: this.translateService.get('dialogs.d1.content'),
      buttons: [this.translateService.get('dialogs.ok')]
    }).present();
  }

  resetApp() {
    this.storage.set('datevisite', '');
    this.beaconService.reset();
    this.stageService.deactiveAllStage();  
    this.alertCtrl.create({
      title: this.translateService.get('dialogs.d2.title'),
      subTitle: this.translateService.get('dialogs.d2.content'),
      buttons: [this.translateService.get('dialogs.ok')]
    }).present();
  }

}
