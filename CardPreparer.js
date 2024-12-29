import { dataProvider, dp } from "./dataProvider.js";
import GraphicsHelper from "./class/helper/GraphicsHelper.js";
import { Card } from "/Card.js";
import Utils from "/class/util/Utils.js";

export class CardPreparer extends PIXI.Container {
    
    constructor(delay, cardId) {
        super();
        this.sortableChildren = true;
        this.cardId = cardId;

        const bg = this.addChild(GraphicsHelper.exDrawRect(0, 0, dp.stageRect.width, dp.stageRect.height, false, {color:0x000000}));

        this.textAndButton = this.addChild(new PIXI.Container());
        const textSample = this.textAndButton.addChild(new PIXI.Text("standby...", {
            fontFamily: 'Inter', 
            fontWeight: 400,
            fontSize: 65, fill: 0xFEFEFE,
            letterSpacing: 15,
        }));
        textSample.anchor.set(0.5, 0);
        textSample.x = dp.stageRect.halfWidth;
        textSample.y = 100;

        gsap.delayedCall(delay / 1000, ()=>{
            this.initTextAndButton()
        });


        this.initDebugger(delay);
    }

    initTextAndButton(){
        const textSample2 = this.textAndButton.addChild(new PIXI.Text("条件が表示される\n即時介入：\n現在のプレイヤーは手を止めてカードをめくる\n手番終了後：\nこの手番終了後にカードをめくる", {
            fontSize: 35, fill: 0xFEFEFE,
            align: 'center',
            breakWords: true,
            wordWrap: true,
            wordWrapWidth: 800,
        }));
        textSample2.anchor.set(0.5, 0);
        textSample2.x = dp.stageRect.halfWidth;
        textSample2.y = 500;

        const button = this.textAndButton.addChild(new PIXI.Text("カードをめくる", {
            fontFamily: 'Inter', 
            fontWeight: 400,
            fontSize: 85, fill: 0xFEFEFE,
            // letterSpacing: 15,
        }));
        
        button.anchor.set(0.5, 0.5);
        button.x = dp.stageRect.halfWidth;
        button.y = dp.stageRect.height - 200;

        button.cursor    = 'pointer';
        button.eventMode = 'static';
        const onTap = (e) => {
            button.eventMode = 'none';
            this.flipCard();
            this.textAndButton.visible = false;
            PIXI.sound.play('snd_start_catch1');
        };
        button.on('pointertap', onTap);
    }

    flipCard(){
        const card0 = this.addChild(new Card(this.cardId));
        card0.position.set(dp.stageRect.halfWidth, dp.stageRect.halfHeight);
        card0.scale.set(1);
        card0.alpha = 0;
        gsap.timeline({delay:0.1})
            .to(card0, {alpha:1, duration:0.5, ease:'none'})
            .to(card0.scale, {x:0.8, y:0.8, duration:0.3, ease:'expo.out'}, '<')

        const button = this.addChild(new PIXI.Text("続ける", {
            fontFamily: 'Inter', 
            fontWeight: 400,
            fontSize: 85, fill: 0xFEFEFE,
            // letterSpacing: 15,
        }));
        
        button.anchor.set(0.5, 0.5);
        button.x = dp.stageRect.halfWidth;
        button.y = dp.stageRect.height - 100;

        button.cursor    = 'pointer';
        button.eventMode = 'static';
        const onTap = (e) => {
            button.eventMode = 'none';
            console.log('aaaaaaaaaa');
            this.parent.standby();
            this.parent.removeChild(this);
            
        };
        button.on('pointertap', onTap);
            
    }




    initDebugger(delay){
        const progressBar = this.addChild(GraphicsHelper.exDrawRect(0, 0, 400, 20, false, {color:0xFFFF00}));
        Utils.pivotCenter(progressBar);
        progressBar.x = dp.stageRect.halfWidth;
        progressBar.y = dp.stageRect.halfWidth;
        gsap.timeline()
            .to(progressBar, {width:1, duration: delay / 1000, ease:'none'})
            .call(()=>{
                progressBar.visible = false;
            });

    }
}