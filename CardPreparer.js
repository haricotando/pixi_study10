import { dataProvider, dp } from "./dataProvider.js";
import GraphicsHelper from "./class/helper/GraphicsHelper.js";
import { Card } from "/Card.js";
import Utils from "/class/util/Utils.js";
import { CommonButton } from "./CommonButton.js";

export class CardPreparer extends PIXI.Container {
    
    constructor(delay, cardId) {
        super();
        this.sortableChildren = true;
        this.cardId = cardId;

        const bg = this.addChild(GraphicsHelper.exDrawRect(0, 0, dp.stageRect.width, dp.stageRect.height, false, {color:0x000000}));

        this.textAndButton = this.addChild(new PIXI.Container());
        const textSample = this.textAndButton.addChild(new PIXI.Text("..", {
            fontFamily: 'Inter', 
            fontWeight: 400,
            fontSize: 65, fill: 0xFEFEFE,
            letterSpacing: 15,
        }));
        textSample.anchor.set(0.5, 0);
        textSample.x = dp.stageRect.halfWidth;
        textSample.y = 100;

        gsap.delayedCall(delay / 1000, ()=>{
            this.initTextAndButton();
            this.onExecuteFX();
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

        const btnFlipCard = this.textAndButton.addChild(new CommonButton('カードをめくる'));
        btnFlipCard.x = dp.stageRect.halfWidth;
        btnFlipCard.y = dp.stageRect.height - 200;
        
        btnFlipCard.cursor    = 'pointer';
        btnFlipCard.eventMode = 'static';
        const onTap = (e) => {
            btnFlipCard.eventMode = 'none';
            this.flipCard();
            this.textAndButton.visible = false;
            PIXI.sound.play('start_catch1');
        };

        btnFlipCard.on('pointertap', onTap);






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




    onExecuteFX(){
        const fxContainer = this.addChild(new PIXI.Container());
        const fxCircle = fxContainer.addChild(GraphicsHelper.exDrawCircle(0, 0, 200, {color:0xFFFFFF, width:4}, false));
        const fxCircleBlack = fxContainer.addChild(GraphicsHelper.exDrawCircle(0, 0, 200, false, {color:0xFFFFFF}));
        // fxCircle.mask = fxCircleBlack;
        fxCircleBlack.scale.set(4);
        gsap.timeline()
            .to(fxCircle.scale, {x:5, y:5, duration: 0.5, ease:'expo.out'})
            .to(fxCircleBlack.scale, {x:0.1, y:0.1, duration: 0.4, ease:'expo.out'}, '<')
        // const fxCircle = fxContainer.addChild(GraphicsHelper.exDrawCircle(0, 0, 200, {color: 0xFFFFFF, width: 4}, false));
        fxContainer.x = dp.stageRect.halfWidth;
        fxContainer.y = dp.stageRect.halfHeight;
        
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