import { Injectable } from '@angular/core';
import { Events } from 'ionic-angular';
import { Http } from '@angular/http';
import { File } from '@ionic-native/file';
import 'rxjs/add/operator/toPromise';

interface DownLoadInfo {
  name: string,
  source: string,
  web: string,
}

@Injectable()
export class JsonService {

  constructor(
    private events: Events,
    private http: Http,
    private file: File,
  ) { }
  
  get(url: string): Promise<object> {
    return this.http.get(url)
    .toPromise()
    .then(response => response.json());
  }

  download(info: DownLoadInfo): Promise<void> {
    const sourceDir = this.file.applicationDirectory + info.source;
    const destDir = this.file.dataDirectory;
    return this.file.checkFile(destDir, info.name)
      .then(success => this.file.removeFile(destDir, info.name), () => {})
      .then(() => {
        return this.get(info.web)
        .then(data => this.file.writeFile(destDir, info.name, JSON.stringify(data), {replace: true}))
        .catch(error => this.file.copyFile(sourceDir, info.name, destDir, info.name));
      });
  };

  downloadAll(): Promise<void> {
    const data = [
      {name: 'beacons.json', source: 'www/assets/data/', web: 'https://museedufer.ch/fr/mobile/beacons'},
      {name: 'fr.json', source: 'www/assets/data/', web: 'https://museedufer.ch/fr/mobile/data/fr'},
      {name: 'en.json', source: 'www/assets/data/', web: 'https://museedufer.ch/fr/mobile/data/en'},
      {name: 'de.json', source: 'www/assets/data/', web: 'https://museedufer.ch/fr/mobile/data/de'},
    ];

    return new Promise<void>((resolve, reject) => {
      const download = index => {
        if (index < data.length) {
          this.download(data[index])
          .then(
            success => {
              index++;
              this.events.publish('progress', index, data.length);
              download(index);
            },
            reject,
          );
        } else {
          resolve();
        }
      }
      download(0);
    })
  }

}
