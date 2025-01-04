import { dataProvider, dp } from "./dataProvider.js";
import GraphicsHelper from "./class/helper/GraphicsHelper.js";
import { Card } from "./Card.js";
import Utils from "./class/util/Utils.js";
import { CommonButton } from "./CommonButton.js";

export class IntroDeckAnimation extends PIXI.Container {
    
    constructor() {
        super();
        this.init();
    }

    init(){
        this.sortableChildren = true;
        this.initCardTable();

        const card0 = this.addChild(new Card(0));
        card0.position.set(dp.stageRect.halfWidth, dp.stageRect.halfHeight);
        card0.scale.set(1.5);
        card0.rotation = Utils.degreesToRadians(-7);
        card0.alpha = 0;
        gsap.timeline({delay:0.1})
            .to(card0, {alpha:1, duration:0.5, ease:'none'})
            .to(card0.scale, {x:0.8, y:0.8, duration:1.1, ease:'expo.out'}, '<')
            .to(card0, {rotation:Utils.degreesToRadians(0), duration:0.5, ease:'sine.out'}, '<')
            .to(card0.scale, {x:0.78, y:0.78, duration:0.5, ease:'sine.inOut', delay: 0.4})
            .to(card0, {y:0, duration:0.5, ease:'circ.in'}, '<0.1')
            .to(card0, {alpha:0, duration:0.3, ease:'none'}, '<0.2')
            .call(()=>{
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
        this.coverBox = this.addChild(GraphicsHelper.exDrawRect(0, 0, dp.stageRect.width, dp.stageRect.height, false, {color: 0x000000}));
        this.coverBox.alpha = 0;
        gsap.timeline({delay:2.3})
            .to(this.coverBox, {alpha:0.7, duration:0.5, ease:'none'})

        Utils.shuffleArray(dp.introDeck);
        const maxDisp = dp.introDeck.length > 20 ? 20 : dp.introDeck.length;
        for(let i = 0; i < maxDisp; i++){
            let card = this.imageTable.addChild(new Card(dp.introDeck[i]));
            card.alpha = 0;
            Utils.resizeImage(card, {width: gridX, height: gridX})
            card.position.set(countX * gridX + card.width / 2 + margin / 2, countY * card.height + card.height / 2);
            Utils.snapshotPos(card);
            const tl = gsap.timeline({delay:i / 30 + 1.8})
                .to(card, {alpha:1, y: card.snapshot.y, duration: 0.5}, '<')
            card.y += 100;
            if(countX < 3){
                countX ++;
            }else{
                countX = 0;
                countY ++;
            }
        }
    }

    initOptionScreen(){
        this.textDescripton = this.addChild(new PIXI.Text(
`ゲームが進行中にランダムで
以下のイベントが発生する

＜即時介入＞
手番のプレイヤーは
手を止めてイベントを見る
            
＜手番終了後＞
手番のプレイヤーは
カードを出した後にイベントを見る
            
＜発生頻度の設定＞`, 
        {
            fontFamily: 'Kaisei Decol', 
            fontWeight: 700,
            fontSize: 50, fill: 0xFEFEFE,
            align: 'center',
            breakWords: true,
            wordWrap: true,
            wordWrapWidth: 800,
            lineHeight: 80,
        }));
        this.textDescripton.anchor.set(0.5, 0);
        this.textDescripton.x = dp.stageRect.halfWidth;
        this.textDescripton.y = 50;
        
        this.minVal = 1;
        const uiSlider = this.addChild(Utils.addUISlider(dp.app, dp.stageRect.width - 200, this, 'minVal', 1, 300, this.minVal));
        uiSlider.position.set(dp.stageRect.halfWidth - uiSlider.width / 2, this.textDescripton.y + this.textDescripton.height + 80);
        // uiSlider.x = 50;
        
        //　opt 追加イベントの設定
        uiSlider.on('customEvent', (data) => {
            
            this.minVal = Math.round(data.value);
            this.minInterval.text = `最小インターバル: ${this.minVal}秒`;
        });

        this.minInterval = this.addChild(new PIXI.Text(`最小インターバル: ${this.minVal}秒`, {
            fontFamily: 'Kaisei Decol', 
            fontWeight: 700,
            fontSize: 30, fill: 0xFEFEFE,
        }));
        this.minInterval.anchor.set(0.5, 0.5);
        this.minInterval.x = dp.stageRect.halfWidth;
        this.minInterval.y = uiSlider.y - 20;




        this.randomVal = 1;
        const randomSlider = this.addChild(Utils.addUISlider(dp.app, dp.stageRect.width - 200, this, 'minVal', 1, 300, this.randomVal));
        randomSlider.position.set(dp.stageRect.halfWidth - randomSlider.width / 2, uiSlider.y + 170);

        randomSlider.on('customEvent', (data) => {
            
            this.randomVal = Math.round(data.value);
            this.randomInterval.text = `最小インターバル: ${this.randomVal}秒`;
        });
        this.randomInterval = this.addChild(new PIXI.Text(`追加ランダムインターバル: ${this.minVal}秒`, {
            fontFamily: 'Kaisei Decol', 
            fontWeight: 700,
            fontSize: 30, fill: 0xFEFEFE,
        }));
        this.randomInterval.anchor.set(0.5, 0.5);
        this.randomInterval.x = dp.stageRect.halfWidth;
        this.randomInterval.y = randomSlider.y - 20;
        

        const btnFlipCard = this.addChild(new CommonButton('ゲームを開始'));
        btnFlipCard.x = dp.stageRect.halfWidth;
        btnFlipCard.y = dp.stageRect.height - (dp.stageRect.height / 10);
        
        btnFlipCard.cursor    = 'pointer';
        btnFlipCard.eventMode = 'static';
        const onTap = (e) => {

            dp.game.minInterval = this.minVal;
            dp.game.randomInterval = this.randomVal;

            PIXI.sound.play('1tick3');
            btnFlipCard.eventMode = 'none';
            btnFlipCard.activate();
            gsap.timeline()
            .to(this.coverBox, {alpha:1, duration:0.4, ease:'none'})
            .to(this.textDescripton, {alpha:0, duration:0.4, ease:'none'}, '<')
            .call(()=>{
                this.parent.standby();
                this.parent.initEndButton();
                this.parent.removeChild((this));
            });
        };

        btnFlipCard.on('pointertap', onTap);

    }
}