import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { Events } from 'ionic-angular';
import { MediaService } from '../../services/media.service';
import { JsonService } from '../../services/json.service';
import { BeaconService } from '../../services/beacon.service';
import { LanguagePage } from '../language/language';

@Component({
  selector: 'page-loading',
  templateUrl: 'loading.html'
})
export class LoadingPage {

  percent: number = 0;
  label: string;

  constructor(
    private navCtrl: NavController,
    private events: Events,
    private mediaService: MediaService,
    private jsonService: JsonService,
    private beaconService: BeaconService,
  ) { }

  ngOnInit() {
    this.events.subscribe('progress', (index, total) => {
      this.percent = Math.min(Math.floor(index / total * 100), 100);
    });
    this.mediaDownload();
  }

  mediaDownload() {
    this.label = 'Téléchargement des médias.';
    this.mediaService.downloadAll()
    .then(() => this.jsonDownload())
    .catch(error => {
      console.log(error);
      this.label = 'Une erreur est survenue: ' + (error.message ? error.message : 'No internet connexion');
    });
  }

  jsonDownload() {
    this.label = 'Téléchargement des traductions';
    this.jsonService.downloadAll()
    .then(() => this.beaconDownload())
    .catch(error => {
      console.log(error);
      this.label = 'Une erreur est survenue: ' + (error.message ? error.message : 'No internet connexion');
    });
  }

  beaconDownload() {
    this.beaconService.load()
    .then(() => this.navCtrl.setRoot(LanguagePage));
  }
}
