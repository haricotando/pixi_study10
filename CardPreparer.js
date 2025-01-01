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
            // this.initTextAndButton();
            this.onExecuteFX();
        });


        this.initDebugger(delay);
    }

    initTextAndButton(){
        const textSample2 = this.textAndButton.addChild(new PIXI.Text("...", {
            fontFamily: 'Kaisei Decol', 
            fontWeight: 700,
            fontSize: 80, fill: 0xFEFEFE,
            align: 'center',
            breakWords: true,
            wordWrap: true,
            wordWrapWidth: 800,
        }));
        textSample2.anchor.set(0.5, 0);
        textSample2.x = dp.stageRect.halfWidth;
        textSample2.y = 500;

        const nextCardInfo = Utils.findObjectById(dp.assets.csv, dp.deck[dp.game.currentIndex]);
        if(nextCardInfo.effectTrigger == 'immediate'){
            textSample2.text = '現在のプレイヤーは\n手を止めて\nカードをめくる';
        }else{
            textSample2.text = '現在のプレイヤーは\n手番終了後に\nカードをめくる';
        }

        const btnFlipCard = this.textAndButton.addChild(new CommonButton('カードをめくる'));
        btnFlipCard.x = dp.stageRect.halfWidth;
        btnFlipCard.y = dp.stageRect.height - 200;
        
        btnFlipCard.cursor    = 'pointer';
        btnFlipCard.eventMode = 'static';
        const onTap = (e) => {
            btnFlipCard.eventMode = 'none';
            this.flipCard();
            this.textAndButton.visible = false;
            // PIXI.sound.play('start_catch1');
            PIXI.sound.play('1tick1');
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

        const startButton = this.addChild(new CommonButton('続ける'));
        startButton.x = dp.stageRect.halfWidth;
        startButton.y = dp.stageRect.height - 200;
        
        startButton.cursor    = 'pointer';
        startButton.eventMode = 'static';
        const onTap = (e) => {
            startButton.eventMode = 'none';
            this.parent.standby();
            this.parent.removeChild(this);
        };

        startButton.on('pointertap', onTap);
            
    }




    onExecuteFX(){
        
        const fxContainer = this.addChild(new PIXI.Container());
        const fxfx = this.initFX(fxContainer);
        fxfx.scale.set(0.4);
        const fxCircle = fxContainer.addChild(GraphicsHelper.exDrawCircle(0, 0, 200, {color:0xFFFFFF, width:4}, false));
        const fxCircle2 = fxContainer.addChild(GraphicsHelper.exDrawCircle(0, 0, 200, false, {color:0xFFFFFF}));
        const fxCircle3 = fxContainer.addChild(GraphicsHelper.exDrawCircle(0, 0, 200, {color:0xFFFFFF, width:10}, false));
        const fxCircle4 = fxContainer.addChild(GraphicsHelper.exDrawCircle(0, 0, 200, {color:0xFFFFFF, width:16}, false));
        const fxCircle5 = fxContainer.addChild(GraphicsHelper.exDrawCircle(0, 0, 50, false, {color:0xFFFFFF}));
        fxCircle2.scale.set(4);
        fxCircle3.visible = false;
        fxCircle4.visible = false;
        fxCircle5.scale.set(4);
        fxCircle5.visible = false;
        gsap.timeline()
            .to(fxCircle.scale, {x:5, y:5, duration: 0.5, ease:'expo.out'})
            .to(fxCircle2.scale, {x:0.01, y:0.01, duration: 0.4, ease:'expo.out', onComplete: () => {fxCircle2.visible = false;}}, '<')
            .to(fxfx.scale, {x:1.5, y:1.5, duration:0.4, ease:'expo.in'}, '<')
            .set(fxCircle3, {visible: true}, '<0.2')
            .to(fxCircle3.scale, {x:5, y:5, duration: 0.5, ease:'expo.out'}, '<')
            
            
            .set(fxCircle5, {visible: true}, '<0.1')
            .to(fxCircle5.scale, {x:5, y:5, duration: 0.7, ease:'expo.out'}, '<')
            .to(fxCircle5.scale, {x:20, y:20, duration: 0.3, ease:'expo.in'})
            .call(()=>{
                fxfx.visible = false;
                this.initTextAndButton();
            })
            .to(fxCircle5, {alpha:0, duration: 0.4, ease:'none'})
            
            .to(fxfx, {rotation:Utils.degreesToRadians(180), duration:0.4, ease:'expo.in'}, '<-0.4')
        fxContainer.x = dp.stageRect.halfWidth;
        fxContainer.y = dp.stageRect.halfHeight;

        
    }


    initFX(container){
        const fxfx = container.addChild(new PIXI.Container());
        for(let i=0; i<20; i++){
            const fx = fxfx.addChild(this.makeFx(true));
            const sec = Math.random()*10+5;
            fx.alpha = 0;
            gsap.timeline()
                .to(fx, {alpha:1, duration:0.5, ease:'none'})
                .to(fx, {rotation:Math.random()*1, duration:sec, ease:'none'}, '-=0.5')
                .to(fx.scale, {x:2, y:2, duration:sec, ease:'none'}, '-='+(0.2+sec))
                .to(fx, {alpha:0, duration:0.5, ease:'none'}, '-=1')
        }
        return fxfx;
    }

    makeFx(isBG){
        const container = new PIXI.Container();
        const num = Math.round(Math.random()*1*5+(isBG ? 5 : 0));
        for(let i=0; i<num; i++){
            container.addChild(this.drawLine(isBG));
        }
        return container;

    }

    drawLine(isBG){
        let line = new PIXI.Graphics();
        line.lineStyle(isBG ? Math.random()*20 : Math.random()*1+1, Math.random()>0.5 ? 0xFFFFFF : 0xFFFFFF);
        // line.lineStyle(Math.random()*(isBG ? 20 : 2), Math.random()>0.5 ? dataProvider.data.colorEmph1 : 0xFFFFFF);
        line.moveTo(0, 0);
        line.lineTo((500+Math.random()*100)*Math.random()*2, 0);
        line.rotation = Math.random()*6;
        line.alpha = Math.random()+0.1;

        return line;
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