import { Injectable } from '@angular/core';
import { NativeAudio } from '@ionic-native/native-audio/ngx';
import { Platform } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class SmartAudioService {


  audioType: string = 'html5';
  sounds: any = [];

  constructor(
    public nativeAudio: NativeAudio,
    platform: Platform,
  ) {
    if (platform.is('cordova')) {
      this.audioType = 'native';
    }
  }

  assets = 'assets/file.mp3';

  preload(key) {

    if (this.audioType === 'html5') {

      let audio = {
        key: key,
        asset: this.assets,
        type: 'html5'
      };

      this.sounds.push(audio);

    } else {

      this.nativeAudio.preloadSimple(key, this.assets);

      let audio = {
        key: key,
        asset: key,
        type: 'native'
      };

      this.sounds.push(audio);
    }

  }

  play(key) {

    let audio = this.sounds.find((sound) => {
      return sound.key === key;
    });

    if (audio.type === 'html5') {

      let audioAsset = new Audio(audio.asset);
      audioAsset.play();

    } else {

      this.nativeAudio.play(audio.asset).then((res) => {
      }, (err) => {
      });

    }

  }
}
