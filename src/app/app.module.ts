import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { IonicStorageModule } from '@ionic/storage';
import { File } from '@ionic-native/file';
import { FileTransfer } from '@ionic-native/file-transfer';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { Media } from '@ionic-native/media';
import { IBeacon } from '@ionic-native/ibeacon';
import { LocalNotifications } from '@ionic-native/local-notifications';

import { IonicImageViewerModule } from 'ionic-img-viewer';

import { MyApp } from './app.component';
import { LoadingPage } from '../pages/loading/loading';
import { LanguagePage } from '../pages/language/language';
import { GuidePage } from '../pages/guide/guide';
import { MapPage } from '../pages/map/map';
import { ImpressumPage } from '../pages/impressum/impressum';
import { SettingsPage } from '../pages/settings/settings';
import { StagePage } from '../pages/stage/stage';
import { AudioPlayer } from '../pages/stage/audio-player';

import { MediaService } from '../services/media.service';
import { JsonService } from '../services/json.service';
import { TranslateService } from '../services/translate.service';
import { StageService } from '../services/stage.service';
import { BeaconService } from '../services/beacon.service';
import { TranslatePipe, DownloadAssetPipe } from '../pipes/assets.pipe';


@NgModule({
  declarations: [
    MyApp,
    LoadingPage,
    LanguagePage,
    GuidePage,
    MapPage,
    ImpressumPage,
    SettingsPage,
    StagePage,
    AudioPlayer,
    
    TranslatePipe,
    DownloadAssetPipe
  ],
  imports: [
    BrowserModule,
    HttpModule,
    IonicImageViewerModule,
    IonicModule.forRoot(MyApp),
    IonicStorageModule.forRoot(),
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    LoadingPage,
    LanguagePage,
    GuidePage,
    MapPage,
    ImpressumPage,
    SettingsPage,
    StagePage,
    AudioPlayer,
  ],
  providers: [
    StatusBar,
    SplashScreen,
    File,
    FileTransfer,
    Media,
    IBeacon,
    LocalNotifications,

    MediaService,
    JsonService,
    TranslateService,
    StageService,
    BeaconService,

    {provide: ErrorHandler, useClass: IonicErrorHandler}
  ]
})
export class AppModule {}
