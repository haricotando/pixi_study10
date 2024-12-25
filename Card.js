import { dataProvider, dp } from "./dataProvider.js";
import GraphicsHelper from "./class/helper/GraphicsHelper.js";
import Utils from "./class/util/Utils.js";

export class Card extends PIXI.Container {
    
    constructor(id) {
        super();
        const myData = Utils.findObjectByKey(dp.assets.csv, 'id', id);
        const cardRect = {width: 63 * 4, height: 88*4};
        const cardImage = PIXI.Sprite.from(dataProvider.assets[myData.illust]);
        cardImage.width = cardRect.width;
        cardImage.height = cardRect.height;
        this.addChild(cardImage);
        //
        const textName = this.addChild(new PIXI.Text("", {
            // fontFamily: 'Noto Sans Japanese', 
            fontWeight: 800,
            fontSize: 36, fill: 0xEFEFEF,
        }));
        textName.anchor.set(0.5, 0);
        textName.text = myData.name;
        textName.x = cardRect.width * 0.5;
        textName.y = 50;

        const textDescription = this.addChild(new PIXI.Text("", {
            // fontFamily: 'Noto Sans Japanese', 
            fontWeight: 800,
            fontSize: 20, fill: 0xEFEFEF,
            align: 'center',
            breakWords: true,
            wordWrap: true,
            wordWrapWidth: cardImage.width - 30,
            lineHeight: 30
        }));
        textDescription.anchor.set(0.5, 0);
        textDescription.text = myData.description;
        textDescription.x = cardRect.width * 0.5;
        textDescription.y =textName.y + textName.height + 20;


        this.pivot.set(cardRect.width * 0.5, cardRect.height * 0.5);


    }
}