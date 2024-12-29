import { dataProvider, dp } from "./dataProvider.js";
import GraphicsHelper from "./class/helper/GraphicsHelper.js";
import { Card } from "/Card.js";
import Utils from "/class/util/Utils.js";

export class IntroDeckAnimation extends PIXI.Container {
    
    constructor() {
        super();
        this.init();
    }

    init(){
        this.sortableChildren = true;
        this.initCardTable();
        // this.initSpreadImageCache();

        const card0 = this.addChild(new Card(0));
        card0.position.set(dp.stageRect.halfWidth, dp.stageRect.halfHeight);
        card0.scale.set(1.5);
        card0.alpha = 0;
        gsap.timeline({delay:0.1})
            .to(card0, {alpha:1, duration:0.5, ease:'none'})
            .to(card0.scale, {x:0.8, y:0.8, duration:0.3, ease:'expo.out'}, '<')
            .to(card0.scale, {x:0.79, y:0.79, duration:0.4, ease:'sine.inOut'})
            .to(card0, {y:0, duration:0.5, ease:'circ.in'}, '<0.3')
            .to(card0, {alpha:0, duration:0.3, ease:'none'}, '<0.3')
            .call(()=>{
                card0.visible = false;
            });
        gsap.delayedCall(0.9, ()=>{
            this.initOptionScreen();
        });
        card0.zIndex = 10;
    };


    initCardTable(){
        let countX = 0;
        let countY = 0;
        const margin = 2;
        const gridX = Math.round((dp.stageRect.width - margin) / 4);

        this.imageTable = this.addChild(new PIXI.Container());
        const coverBox = this.addChild(GraphicsHelper.exDrawRect(0, 0, dp.stageRect.width, dp.stageRect.height, false, {color: 0x000000, alpha:0.75}));

        Utils.shuffleArray(dp.deck);
        const maxDisp = dp.deck.length > 20 ? 20 : dp.deck.length;
        for(let i = 0; i < maxDisp; i++){
            let card = this.imageTable.addChild(new Card(dp.deck[i]));
            card.alpha = 0;
            Utils.resizeImage(card, {width: gridX, height: gridX})
            card.position.set(countX * gridX + card.width / 2 + margin / 2, countY * card.height + card.height / 2);
            Utils.snapshotPos(card);
            const tl = gsap.timeline({delay:i / 30 + 0.9})
                .to(card, {alpha:1, y: card.snapshot.y, duration: 0.5}, '<')
            card.y += 50;
            if(countX < 3){
                countX ++;
            }else{
                countX = 0;
                countY ++;
            }
        }
    }

    initOptionScreen(){
    //     const bg = this.addChild(GraphicsHelper.exDrawRect(0, 0, dp.stageRect.width, dp.stageRect.height, false, {color:0x000000}));
        const textSample = this.addChild(new PIXI.Text("GAME OPTION", {
            fontFamily: 'Inter', 
            fontWeight: 400,
            fontSize: 65, fill: 0xFEFEFE,
            letterSpacing: 15,
        }));
        textSample.anchor.set(0.5, 0);
        textSample.x = dp.stageRect.halfWidth;
        textSample.y = 100;

        const textSample2 = this.addChild(new PIXI.Text("ここでオプション選択が入る", {
            fontSize: 35, fill: 0xFEFEFE,
        }));
        textSample2.anchor.set(0.5, 0);
        textSample2.x = dp.stageRect.halfWidth;
        textSample2.y = 500;
        this.initButton();
    }

    initButton(){
        const button = this.addChild(new PIXI.Text("> START", {
            fontFamily: 'Inter', 
            fontWeight: 400,
            fontSize: 85, fill: 0xFEFEFE,
            // letterSpacing: 15,
        }));
        
        this.addChild(button)
        button.anchor.set(0.5, 0.5);
        button.x = dp.stageRect.halfWidth;
        button.y = dp.stageRect.height - 200;

        button.cursor    = 'pointer';
        button.eventMode = 'static';
        const onTap = (e) => {
            button.eventMode = 'none';
            gsap.timeline()
            .to(this, {alpha:0})
            .call(()=>{
                this.parent.standby();
                this.parent.removeChild((this));
                // this.parent.initGameContainer();
            });
        };
        button.on('pointertap', onTap);
    }
}