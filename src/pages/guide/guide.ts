import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { Platform } from 'ionic-angular';
import { StagePage } from '../stage/stage';
import { BeaconService } from '../../services/beacon.service';

@Component({
  selector: 'page-guide',
  templateUrl: 'guide.html'
})
export class GuidePage {

  constructor(
    private navCtrl: NavController,
    private platform: Platform,
    private beaconService: BeaconService,
  ) {
    this.beaconService.listen();
  }

  isNotAndroid() {
		return !this.platform.is('android');
	};

  gotoStage = () => {
    this.navCtrl.setRoot(StagePage);
  }

}
