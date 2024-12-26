import { dataProvider, dp } from "./dataProvider.js";
import GraphicsHelper from "./class/helper/GraphicsHelper.js";
import Utils from "./class/util/Utils.js";
import { Card } from "/Card.js";

export class GameReady extends PIXI.Container {
    
    constructor(id) {
        super();

        let countX = 0;
        let countY = 0;
        const margin = 2;
        const gridX = Math.round((dp.stageRect.width - margin) / 4);

        Utils.shuffleArray(dp.deck);
        for(let i = 0; i<dp.deck.length; i++){
            let card = this.addChild(new Card(dp.deck[i]));
            card.alpha = 0;
            card.rotation = Utils.degreesToRadians(Math.random()*10-5);
            Utils.resizeImage(card, {width: gridX, height: gridX})
            card.position.set(countX * gridX + card.width / 2 + margin / 2, countY * card.height + card.height / 2);
            Utils.snapshotPos(card);
            const tl = gsap.timeline({delay:i/50})
                .set(card.scale, {x:1.4, y:1.4})
                .to(card.scale, {x:card.snapshot.scale.x, y:card.snapshot.scale.y, ease:'back.out(4)'})
                .to(card, {alpha:1, rotation: 0}, '<')
            
                if(countX < 3){
                countX ++;
            }else{
                countX = 0;
                countY ++;
            }
        }

        gsap.delayedCall(0.5, ()=>{
            this.initStartBtn();
        });
        dp.noSleep = new NoSleep();
    }

    initStartBtn(){
        // overlay
        const overlay = this.addChild(GraphicsHelper.exDrawRect(0, 0, dp.stageRect.width, dp.stageRect.height, false, {color: 0x000000}));
        overlay.alpha = 0;
        gsap.to(overlay, {alpha:0.5})
        // nosleep, soundPlay＋（oneshot、delay）をユーザーアクションに紐づける
        const button = this.addChild(new PIXI.Container());
        button.cursor    = 'pointer';
        button.eventMode = 'static';

        // ボタン背景
        const btnBackground = GraphicsHelper.exDrawCircle(0, 0, 200, false, {color:0xFFFFFF});
        button.addChild(btnBackground);
        Utils.layoutCenter(button, dp.stageRect)
        btnBackground.scale.set(1.5);

        gsap.timeline()
            .to(btnBackground.scale, {x:1, y:1});

        const onTap = (e) => {
            button.cursor    = 'default';
            button.eventMode = 'none';
            dp.noSleep.enable();
            PIXI.sound.play('snd_car');

            setTimeout(() => {
                PIXI.sound.play('snd_success');
            }, 3000);

            // this.emit("customEvent", { 
            //     target : background,
            //     message: "イベントが発火されました！"
            // });
        }
        button.on('pointertap', onTap);
        
    }
}