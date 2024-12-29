import { dataProvider, dp } from "./dataProvider.js";
import GraphicsHelper from "./class/helper/GraphicsHelper.js";
import Utils from "./class/util/Utils.js";
import { IntroDeckAnimation } from "/IntroDeckAnimation.js";
import { CardPreparer } from "/CardPreparer.js";

export class GameContainer extends PIXI.Container {
    
    constructor() {
        super();
        this.init();
        // this.standby();
    }

    init(){
        const bg = this.addChild(GraphicsHelper.exDrawRect(0, 0, dp.stageRect.width, dp.stageRect.height, false, {color:0x000000}));
        this.addChild(new IntroDeckAnimation());
        setTimeout(() => {
            PIXI.sound.play('snd_start_catch1');
        }, 0);

        let noSleep = new NoSleep();
        noSleep.enable();
    }
    
    standby(){
        const waitingDuration = this.diceNextInterval();
        console.log(waitingDuration);
        
        setTimeout(() => {
            PIXI.sound.play('snd_1tick');
            // PIXI.sound.play('snd_start_catch2');
        }, waitingDuration);
        this.addChild(new CardPreparer(waitingDuration, dp.deck[dp.game.currentIndex]));
        dp.game.currentIndex ++;
    }

    diceNextInterval(){
        const secRange = 1;
        const minSec = 1;
        const randomSec = Math.round(Math.random() * secRange);
        const finalSec = (minSec + randomSec) * 1000;
        return finalSec;
    }
}