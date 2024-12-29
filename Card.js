import { dataProvider, dp } from "./dataProvider.js";
import GraphicsHelper from "./class/helper/GraphicsHelper.js";
import Utils from "./class/util/Utils.js";

export class Card extends PIXI.Container {
    
    constructor(id) {
        super();
        id = id.toString();
        const myData = Utils.findObjectByKey(dp.assets.csv, 'id', id);

        const rimMargin = 30;

        /**
         * container
         */
        const cardContainer = this.addChild(new PIXI.Container());
        // const cardBG = cardContainer.addChild(GraphicsHelper.exDrawRoundedRect(0, 0, dp.stageRect.width, dp.stageRect.height, 50, false, {color: 0xEEE0D3}));
        const cardBG = cardContainer.addChild(GraphicsHelper.exDrawRoundedRect(0, 0, dp.stageRect.width, 1668, 50, false, {color: 0xEEE0D3}));
        
        Utils.pivotCenter(cardContainer);
        
        /**
         * image mask
        */
    //    const imageMask = cardContainer.addChild(GraphicsHelper.exDrawRoundedRect(0, 0, dp.stageRect.width - rimMargin * 2, dp.stageRect.height - rimMargin * 2, 30, false, {color: 0xFF0000, alpha:0.5}));
       const imageMask = cardContainer.addChild(GraphicsHelper.exDrawRoundedRect(0, 0, dp.stageRect.width - rimMargin * 2, 1668 - rimMargin * 2, 30, false, {color: 0xFF0000, alpha:0.5}));
        imageMask.position.set(rimMargin, rimMargin);

        /**
         * image
         */
        const cardImage = PIXI.Sprite.from(dataProvider.assets[myData.imageID]);
        cardContainer.addChild(cardImage);
        cardImage.position.set(rimMargin, rimMargin);
        Utils.resizeImage(cardImage, imageMask, 'contain');
        cardImage.mask = imageMask;
        
        /**
         * descriptionの背景画像
         */
        const descriptionBG = PIXI.Sprite.from(dataProvider.assets.description_bg);
        cardContainer.addChild(descriptionBG);
        descriptionBG.x = imageMask.x;
        descriptionBG.y = imageMask.y + cardImage.height;
        descriptionBG.width = imageMask.width;
        descriptionBG.height = cardBG.height - cardImage.height - rimMargin * 2;

        /**
         * inner frame
         */        
        // const innerFrame = cardContainer.addChild(GraphicsHelper.exDrawRoundedRect(0, 0, dp.stageRect.width - rimMargin * 2, dp.stageRect.height - rimMargin * 2, 30, {color: 0x333333, width:20}, false));
        const innerFrame = cardContainer.addChild(GraphicsHelper.exDrawRoundedRect(0, 0, dp.stageRect.width - rimMargin * 2, 1668 - rimMargin * 2, 30, {color: 0x333333, width:20}, false));
        innerFrame.position.set(rimMargin, rimMargin);




        const textName = cardContainer.addChild(new PIXI.Text("...", {
            fontFamily: 'Kaisei Decol', 
            fontWeight: 700,
            fontSize: 200, fill: 0xEFEFEF,
            breakWords: true,
            wordWrap: true,
            wordWrapWidth: cardImage.width - 30,
            dropShadow: true,
            dropShadowColor: '#000000',
            dropShadowAlpha: 0.9,
            dropShadowBlur: 16,
            dropShadowAngle: 0,
            dropShadowDistance: 0,
            
        }));
        textName.anchor.set(0.5, 0);
        textName.text = myData.name;
        textName.position.set(dp.stageRect.halfWidth, 200);



        const textDescription = cardContainer.addChild(new PIXI.Text("...", {
            fontFamily: 'Kaisei Decol', 
            fontWeight: 300,
            fontSize: 60, fill: 0xEFEFEF,
            align: 'center',
            breakWords: true,
            wordWrap: true,
            wordWrapWidth: cardImage.width - 100,
            // lineHeight: 30,
            
            dropShadow: true,
            dropShadowColor: '#000000',
            dropShadowAlpha: 0.5,
            dropShadowBlur: 8,
            dropShadowAngle: 0,
            dropShadowDistance: 0,
        }));
        textDescription.anchor.set(0.5, 0);
        textDescription.text = myData.description;
        textDescription.position.set(dp.stageRect.halfWidth, descriptionBG.y + 50);



        // gsap.to(cardContainer.scale, {x:0.9, y:0.9, duration:3, ease:'sine.inOut'})

    }

    init(){
        const myData = Utils.findObjectByKey(dp.assets.csv, 'id', id);

        /**
         * 画像セット
         */
        const cardImage = PIXI.Sprite.from(dataProvider.assets[myData.imageID]);
        const cardRect = {width: cardImage.width, height: cardImage.height};
        // this.addChild(cardImage);
        
        /**
         * テキストラベル
         */

        const textContainer = this.addChild(new PIXI.Container());
        const textName = this.addChild(new PIXI.Text("", {
            fontFamily: 'Kaisei Decol', 
            fontWeight: 700,
            fontSize: 290, fill: 0xEFEFEF,
            breakWords: true,
            wordWrap: true,
            wordWrapWidth: cardImage.width - 30,
            dropShadow: true,
            dropShadowColor: '#000000',
            dropShadowAlpha: 0.5,
            dropShadowBlur: 16,
            dropShadowAngle: 0,
            dropShadowDistance: 0,
            
        }));
        textName.anchor.set(0.5, 0);
        textName.text = myData.name;
        textName.x = cardRect.width * 0.5;
        textName.y = 100;
        // textName.scale.set(10)
        
        const textDescription = this.addChild(new PIXI.Text("", {
            fontFamily: 'Kaisei Decol', 
            fontWeight: 300,
            fontSize: 60, fill: 0xEFEFEF,
            align: 'center',
            breakWords: true,
            wordWrap: true,
            wordWrapWidth: cardImage.width - 100,
            // lineHeight: 30,
            
            dropShadow: true,
            dropShadowColor: '#000000',
            dropShadowAlpha: 0.5,
            dropShadowBlur: 8,
            dropShadowAngle: 0,
            dropShadowDistance: 0,
        }));
        textDescription.anchor.set(0.5, 0);
        textDescription.text = myData.description;
        textDescription.x = cardRect.width * 0.5;
        textDescription.y = cardImage.height - (textDescription.height + 200);
        // textDescription.y =textName.y + textName.height + 20;


        this.pivot.set(cardRect.width * 0.5, cardRect.height * 0.5);

        // gsap.to(this.scale, {x:0.8, y:0.8, duration:3, ease:'sine.inOut'})

    }
}