import { Pipe, PipeTransform } from '@angular/core';
import { TranslateService } from '../services/translate.service';
import { MediaService } from '../services/media.service';

/* translate pipe */

@Pipe({
  name: 'trans',
})
export class TranslatePipe implements PipeTransform {
  constructor( private translateService: TranslateService ) {}

  transform(tag: string): string {
    return this.translateService.get(tag);
  }
}

/* downloaded pipe */

@Pipe({
  name: 'downloadAsset',
})
export class DownloadAssetPipe implements PipeTransform {
  constructor( private mediaService: MediaService ) {}

  transform(path: string): string {
    return this.mediaService.downloadAsset(path);
  }
}


