import { Injectable } from '@angular/core';
import { Platform, Events, AlertController } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { File } from '@ionic-native/file';
import { IBeacon } from '@ionic-native/ibeacon';
import { LocalNotifications } from '@ionic-native/local-notifications';
import { JsonService } from './json.service';
import { TranslateService } from '../services/translate.service';
import { StageService } from './stage.service';

export interface BeaconInfo {
	id: number,
  name: string,
  uuid: string,
  threshold: number,
  stage: number,
  threshold_apple: number,
  threshold_android: number,
}

@Injectable()
export class BeaconService {

  private beacons: BeaconInfo[];
  private isPause = false;
   
  constructor(
		private events: Events,
    private platform: Platform,
    private ibeacon: IBeacon,
    private storage: Storage,
    private alertCtrl: AlertController,
    private localNotifications: LocalNotifications,
		private file: File,
    private jsonService: JsonService,
    private stageService: StageService,
    private translateService: TranslateService,
  ) { }

  load(): Promise<void> {
    const url = this.file.dataDirectory + 'beacons.json';
    return this.jsonService.get(url)
    .then(data => {
      const isAndroid = this.platform.is('android');
      this.beacons = data as BeaconInfo[];
      this.beacons.map(info => {
        info.threshold = isAndroid ? info.threshold_android : info.threshold_apple;
      });

      this.ibeacon.requestAlwaysAuthorization();

      const delegate = this.ibeacon.Delegate();

      // Subscribe to some of the delegate's event handlers
      delegate.didRangeBeaconsInRegion()
        .subscribe(
          data => {
            if (data.beacons.length > 0) {
              const beacon = data.beacons[0];
              const arr = this.beacons.filter(info => beacon.uuid.toUpperCase()  == info.uuid && beacon.accuracy < info.threshold);
              if (arr.length > 0) {
                let beaconRegion = this.ibeacon.BeaconRegion(arr[0].name, arr[0].uuid);
                this.ibeacon.stopRangingBeaconsInRegion(beaconRegion);
                this.update(arr[0].stage);
              }
            }
          },
          error => console.error()
        );
      delegate.didEnterRegion()
        .subscribe(
          data => {
            const region = data.region;
            const arr = this.beacons.filter(info => region['uuid'].toUpperCase() == info.uuid);
            if (arr.length > 0) {
              let beaconRegion = this.ibeacon.BeaconRegion(arr[0].name, arr[0].uuid);
              this.ibeacon.stopMonitoringForRegion(beaconRegion);
              this.notify(arr[0].stage);
            }
          }
        );

      this.platform.pause.subscribe(() => {
        console.log('pause');
        this.isPause = true;
      });

      this.platform.resume.subscribe(() => {
        console.log('resume');
        this.isPause = false;
      }); 
 
    });
  }
  
  update(stageId: number) {
    var date = new Date();
    var dvisite = date.getDate() + '.' + (date.getMonth() + 1) + '.' + date.getFullYear();
    this.storage.set('datevisite', dvisite);
    if (!this.stageService.stageIsActive(stageId)) {
      this.stageService.setActive(stageId, true);
      this.stageService.refreshMenu();
      this.alertCtrl.create({
        title: this.stageService.get(stageId).title,
        subTitle: this.translateService.get('dialogs.point'),
        buttons: [{
          text: this.translateService.get('dialogs.add'),
          role: 'cancel',
        }, {
          text: this.translateService.get('dialogs.read'),
          handler: () => {
            this.events.publish('gotoStage', stageId);
          }
        }]
      }).present();
    }

  };

	notify(stageId: number) {
    if (this.isPause && !this.stageService.stageIsActive(stageId)) {
      this.stageService.setActive(stageId, true);
      this.stageService.refreshMenu();
      this.localNotifications.schedule({
        id: 1,
        title: this.stageService.get(stageId).title,
        text: this.translateService.get('dialogs.point'),
        data: { stageId },
        icon: 'notify_icon',
      });
    }
  };

  listen() {
    this.beacons.map(info => {
      let beaconRegion = this.ibeacon.BeaconRegion(info.name, info.uuid);
      this.ibeacon.startRangingBeaconsInRegion(beaconRegion);
      this.ibeacon.startMonitoringForRegion(beaconRegion);
    });
  }
  
  reset() {
    this.beacons.map(info => {
      let beaconRegion = this.ibeacon.BeaconRegion(info.name, info.uuid);
      this.ibeacon.stopMonitoringForRegion(beaconRegion);
      this.ibeacon.stopRangingBeaconsInRegion(beaconRegion);
    });
  }

}