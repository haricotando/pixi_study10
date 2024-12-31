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
            PIXI.sound.play('1tick1');
            // PIXI.sound.play('start_catch1');
        }, 0);

        let noSleep = new NoSleep();
        noSleep.enable();
    }
    
    standby(){
        const nextCardInfo = Utils.findObjectById(dp.assets.csv, dp.deck[dp.game.currentIndex]);
        console.log(nextCardInfo.effectTrigger);
        
        
        const waitingDuration = this.diceNextInterval();
        
        setTimeout(() => {
            if(nextCardInfo.effectTrigger == 'immediate'){
                // PIXI.sound.play('1tick1');
                PIXI.sound.play('start_catch1');
            }else{
                // PIXI.sound.play('1tick2');
                PIXI.sound.play('start_catch1');
            }
        }, waitingDuration);
        this.addChild(new CardPreparer(waitingDuration, dp.deck[dp.game.currentIndex]));
        dp.game.currentIndex ++;
    }

    diceNextInterval(){
        const secRange = 1;
        const minSec = 0;
        const randomSec = Math.round(Math.random() * secRange);
        const finalSec = (minSec + randomSec) * 1000;
        return finalSec;
    }
}