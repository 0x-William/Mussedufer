import { Injectable } from '@angular/core';
import { JsonService } from './json.service';

@Injectable()
export class TranslateService {

  private translations: object;

  constructor(
    private jsonService: JsonService,
  ) { }

  private getTrans(tag: string, translations: object): string {
    if (!translations) {
      return tag;
    }

    const arrTag = tag.split(".");
    const tag0 = arrTag.shift();
    const trans = translations[tag0];
    if (arrTag.length == 0) {
      return trans || tag;
    }
    return this.getTrans(arrTag.join('.'), trans);
  }

  get(tag: string): string {
    return this.getTrans(tag, this.translations);
  }

  load(lang: string): Promise<void> {
    return this.jsonService.get(`./assets/lang/${lang}.json`)
    .then(data => {
      this.translations = data;
    });
  }
  
}