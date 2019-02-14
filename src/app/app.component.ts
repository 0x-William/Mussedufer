import { Component, ViewChild } from '@angular/core';
import { Nav, Platform } from 'ionic-angular';
import { Events } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { LocalNotifications } from '@ionic-native/local-notifications';

import { LoadingPage } from '../pages/loading/loading';
import { GuidePage } from '../pages/guide/guide';
import { MapPage } from '../pages/map/map';
import { ImpressumPage } from '../pages/impressum/impressum';
import { SettingsPage } from '../pages/settings/settings';
import { StagePage } from '../pages/stage/stage';

import { TranslateService } from '../services/translate.service';
import { StageService } from '../services/stage.service';

const MENUITEMS = [
  { title: 'home.title', icon: 'ion-compass', component: GuidePage },
  { title: 'Plan', icon: 'ion-map', component: MapPage },
  { title: 'Impressum', icon: 'ion-help', component: ImpressumPage },
  { title: 'settings.title', icon: 'ion-gear-a', component: SettingsPage }
];

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;

  rootPage: any;

  leftMenuTitle: string = '';
  leftMenuItems: Array<{title: string, icon: string, component: any}> = [];
  rightMenuTitle: string = '';
  rightMenuItems: Array<{title: string, id: number}> = [];

  constructor(
    private platform: Platform,
    private statusBar: StatusBar,
    private splashScreen: SplashScreen,
    public events: Events,
    private stageService: StageService,
    private translateService: TranslateService,
    private localNotifications: LocalNotifications,
  ) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.rootPage = LoadingPage;

      this.localNotifications.hasPermission()
      .then(granted => {
        if (!granted) {
          this.localNotifications.registerPermission();
        }
      });
      
      this.statusBar.styleDefault();
      this.splashScreen.hide();    
      this.events.subscribe('refreshLeftMenu', () => {
        this.leftMenuTitle = 'menu.title';
        this.leftMenuItems = MENUITEMS;
      }); 
      
      this.events.subscribe('refreshRightMenu', stageItems => {
        this.rightMenuTitle = 'menu.stage';
        this.rightMenuItems = stageItems;
      });

      this.events.subscribe('gotoStage', stageId => {
        this.openStage(stageId);
      });

      this.localNotifications.on('click', (notification, state) => {
        let data = JSON.parse(notification.data);
        this.openStage(data.stageId);
      });
    });
  }

  openPage(page) {
    this.nav.setRoot(page);
  }

  openStage(stageId) {
    this.nav.setRoot(StagePage, { stageId });
  }

}
