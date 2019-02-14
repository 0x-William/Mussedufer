import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import { Events } from 'ionic-angular';
import { File } from '@ionic-native/file';
import { JsonService } from './json.service';

export interface Tags {
	hasAudio: boolean,
	hasVideo: boolean,
	hasImage: boolean,
	hasMedia: boolean,
	isActive: boolean,
}

export interface Stage {
	id: number,
	title: string,
	audio: string,
	video: string[],
	videocover: string,
	images: Array<{src: string, full: string, caption: string}>,
	paragraphs: string,
	tag: Tags,
	lang: string,
	read_more: boolean,
	number: number,
}

@Injectable()
export class StageService {

	private stageMap: object;
	lastStageId: number;
  
  constructor(
		private events: Events,
    private storage: Storage,
		private jsonService: JsonService,
		private file: File,
  ) { }

  load(lang): Promise<void> {
		const url = this.file.dataDirectory + `${lang}.json`;
    return this.jsonService.get(url)
    .then(data => {
			this.stageMap = {};
			data['stages'].map(stage => {
				this.stageMap[stage.id] = stage;
			});
    });
	}

  checkTags() {
		const promises = [];
		for (const id in this.stageMap) {
			const stage: Stage = this.stageMap[id];
			if (stage.audio == "undefined") stage.audio = ""
			stage.tag.hasVideo = stage.video.length > 0;
			stage.tag.hasImage = stage.images.length > 0;
			stage.tag.hasAudio = stage.audio != "";
			stage.tag.hasMedia = stage.tag.hasVideo || stage.tag.hasImage;

			if (stage.videocover == "" || !stage.tag.hasAudio) {
				stage.videocover = 'images/thumb_default.jpg';
			}

			promises.push(this.storage.get(`stage${id}`).then(active => {
        stage.tag.isActive = active;
      }));
		}
		return Promise.all(promises);
	}
	
	get(stageId: number): Stage {
		return this.stageMap[stageId];
	};

	stageIsActive(stageId: number): boolean {
		const stage: Stage = this.stageMap[stageId];
		return stage.tag.isActive;
	}

	setActive(stageId: number, active: boolean) {
		const stage: Stage = this.stageMap[stageId];
		stage.tag.isActive = active;
		this.storage.set(`stage${stageId}`, active);
	}

	deactiveAllStage() {
		for (const id in this.stageMap) {
			this.setActive(parseInt(id), false);
		}
		this.refreshMenu();
	}
	
	activeAllStage() {
		for (const id in this.stageMap) {
			this.setActive(parseInt(id), true);
		}
		this.refreshMenu();
	}

	refreshMenu() {
		const menuItems = [];
		for (const id in this.stageMap) {
			const stage: Stage = this.stageMap[id];
      if (stage.tag.isActive) {
        menuItems.push({ id, title: stage.title });
			}
		}
		this.events.publish('refreshRightMenu', menuItems);
	}

}