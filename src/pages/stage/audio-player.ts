import { Component, Input } from '@angular/core';
import { Platform } from 'ionic-angular';
import { Media, MediaObject } from '@ionic-native/media';

@Component({
  selector: 'audio-player',
  templateUrl: 'audio-player.html'
})
export class AudioPlayer {
  @Input() src: string;
  @Input() label: string;

  audio: MediaObject;
  toggle: boolean;

  constructor(
    private platform: Platform,
    private media: Media,
  ) { }

  ngOnInit() {
    const isAndroid = this.platform.is('android');
    const currentPlatformVersion = this.platform.version.toString();
    if (isAndroid && currentPlatformVersion == '4.4') {
      this.audio = this.media.create(this.src);
    }
  }

  play() {
    if (this.audio) {
      this.toggle = !this.toggle;
      if (this.toggle) {
        this.audio.play();
      } else {
        this.audio.pause();
      }
    }
  }

  stop() {
    if (this.audio) {
      this.audio.stop();
      if (this.toggle) {
        this.toggle = false;
      }
    }
  }

  getPlayText() {
    return this.toggle ? 'Pause' : 'Play';
  }

  getPlayIcon() {
    return this.toggle ? 'ion-pause' : 'ion-play';
  }

}
