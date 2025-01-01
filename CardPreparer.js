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

        
        const hourglass = PIXI.Sprite.from(dataProvider.assets.game_in_progress);
        hourglass.anchor.set(0.5);
        Utils.layoutCenter(hourglass, dp.stageRect);
        hourglass.scale.set(0.8);
        
        const progressBar = this.addChild(GraphicsHelper.exDrawRect(0, 0, hourglass.width, 20, false, {color:0xFFFF00}));
        progressBar.x = dp.stageRect.halfWidth - hourglass.width / 2;
        progressBar.y = hourglass.y + hourglass.height /2;

        hourglass.scale.set(0.1);
        this.addChild(hourglass);
        gsap.timeline()
            .to(hourglass.scale, {x:0.8, y:0.8, duration:0.3, ease:'expo.out'})
            .to(hourglass.scale, {x:0.1, y:0.1, duration:0.3, ease:'expo.in', delay: delay / 1000 - 0.5})
            .call(()=>{
                hourglass.visible = false;
            });

        gsap.timeline()
            .to(progressBar, {width:1, duration: delay / 1000, ease:'none'})
            .call(()=>{
                progressBar.visible = false;
            });

        gsap.delayedCall(delay / 1000, ()=>{
            this.onExecuteFX();
        });


        // this.initDebugger(delay);
    }

    initTextAndButton(){
        const flipcard = PIXI.Sprite.from(dataProvider.assets.flip_card);
        flipcard.anchor.set(0.5);
        Utils.layoutCenter(flipcard, dp.stageRect);
        flipcard.scale.set(0.1);
        this.addChild(flipcard);
        gsap.timeline()
            .to(flipcard.scale, {x:0.8, y:0.8, duration:0.3, ease:'expo.out'})

        const message = this.addChild(new PIXI.Text("...", {
            fontFamily: 'Kaisei Decol', 
            fontWeight: 700,
            fontSize: 80, fill: 0xFEFEFE,
            align: 'center',
            breakWords: true,
            wordWrap: true,
            wordWrapWidth: 800,
        }));
        message.anchor.set(0.5, 0);
        message.x = dp.stageRect.halfWidth;
        message.y = 100;



        const nextCardInfo = Utils.findObjectById(dp.assets.csv, dp.deck[dp.game.currentIndex]);
        if(nextCardInfo.effectTrigger == 'immediate'){
            message.text = '手番のプレイヤーは\n手を止めて\nカードをめくる';
        }else{
            message.text = '手番のプレイヤーは\nアクション終了後\nカードをめくる';
        }

        const btnFlipCard = this.textAndButton.addChild(new CommonButton('カードをめくる'));
        btnFlipCard.x = dp.stageRect.halfWidth;
        btnFlipCard.y = dp.stageRect.height - (dp.stageRect.height / 10);
        btnFlipCard.alpha = 0;

        gsap.timeline({delay: 0.5})
        .to(btnFlipCard, {alpha:1, duration: 0.3, ease:'none'})
        .call(()=>{
            btnFlipCard.cursor    = 'pointer';
            btnFlipCard.eventMode = 'static';
        });
        
        const onTap = (e) => {
            gsap.timeline()
                .to(flipcard.scale, {x:0.3, y:0.3, duration:0.3, ease:'none'})
                .to(message, {alpha:0, duration:0.3, ease:'none'}, '<')
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
        card0.position.set(dp.stageRect.halfWidth, dp.stageRect.halfHeight - 120);
        card0.scale.set(1);
        card0.alpha = 0;
        gsap.timeline({delay:0.1})
            .to(card0, {alpha:1, duration:0.5, ease:'none'})
            .to(card0.scale, {x:0.8, y:0.8, duration:0.3, ease:'expo.out'}, '<')

        const startButton = this.addChild(new CommonButton('続ける'));
        startButton.x = dp.stageRect.halfWidth;
        startButton.y = dp.stageRect.height - (dp.stageRect.height / 10);
        startButton.alpha = 0;
        gsap.timeline({delay:0.5})
        .to(startButton, {alpha:1, duration:0.4, ease:'none'})
        .call(()=>{
            startButton.cursor    = 'pointer';
            startButton.eventMode = 'static';
        });
        
        const onTap = (e) => {
            PIXI.sound.play('1tick2');
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
            .to(fxCircle.scale, {x:6, y:6, duration: 0.5, ease:'expo.out'})
            .to(fxCircle2.scale, {x:0.01, y:0.01, duration: 0.4, ease:'expo.out', onComplete: () => {fxCircle2.visible = false;}}, '<')
            .to(fxfx.scale, {x:1.5, y:1.5, duration:0.4, ease:'expo.in'}, '<')
            .set(fxCircle3, {visible: true}, '<0.2')
            .to(fxCircle3.scale, {x:6, y:6, duration: 0.5, ease:'expo.out'}, '<')
            
            
            .set(fxCircle5, {visible: true}, '<0.1')
            .to(fxCircle5.scale, {x:6, y:6, duration: 0.7, ease:'expo.out'}, '<')
            .to(fxCircle5.scale, {x:22, y:22, duration: 0.3, ease:'expo.in'})
            .call(()=>{
                fxfx.visible = false;
                this.initTextAndButton();
            })
            .to(fxCircle5, {alpha:0, duration: 0.4, ease:'none'})
            .call(()=>{
                fxContainer.visible = false;
            })
            
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
        progressBar.x = dp.stageRect.halfWidth;
        progressBar.y = dp.stageRect.halfWidth;
        gsap.timeline()
            .to(progressBar, {width:1, duration: delay / 1000, ease:'none'})
            .call(()=>{
                progressBar.visible = false;
            });
    }
}