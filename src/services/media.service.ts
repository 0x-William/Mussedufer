import { Injectable } from '@angular/core';
import { Events } from 'ionic-angular';
import { File } from '@ionic-native/file';
import { FileTransfer, FileTransferObject } from '@ionic-native/file-transfer';

interface DownLoadInfo {
  url: string,
  path: string,
}

function getAllData(lang) {
  const audioNames = ['02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12', '13', '14'];
  return [ 
    { url: `https://museedufer.ch/mobile_app/video/animation_MFCF_${lang}.mp4`, path: `video/animation_MFCF_${lang}.mp4` },
    ...audioNames.map(name => {
      return { url: `https://museedufer.ch/mobile_app/audio/${lang}/${name}.mp3`, path: `audio/${lang}/${name}.mp3` }
    })
  ]
}

@Injectable()
export class MediaService {

  private fileTransfer: FileTransferObject = this.transfer.create();

  constructor(
    private events: Events,
    private file: File,
    private transfer: FileTransfer,
  ) {}

  downloadAsset(path: string): string {
    return this.file.dataDirectory + path;
  }

  download(info: DownLoadInfo): Promise<void> {
    return this.file.checkFile(this.file.dataDirectory, info.path)
    .catch(error => this.fileTransfer.download(
      info.url,
      this.downloadAsset(info.path),
      true,
      {}
    ));
  };

  downloadAll(): Promise<void> {
    const data = [
      { url: 'https://museedufer.ch/mobile_app/video/MFCF_fer-a-cheval.mp4', path: 'video/MFCF_fer-a-cheval.mp4' },
      { url: 'https://museedufer.ch/mobile_app/video/MFCF_limes.mp4', path: 'video/MFCF_limes.mp4' },
      { url: 'https://museedufer.ch/mobile_app/audio/cloche.mp3', path: 'audio/cloche.mp3' },
      ...getAllData('FR'),
      ...getAllData('EN'),
      ...getAllData('DE'),
    ];

    return new Promise<void>((resolve, reject) => {
      const download = index => {
        if (index < data.length) {
          this.download(data[index])
          .then(
            () => {
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
  };

}
