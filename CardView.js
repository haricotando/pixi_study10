import { dataProvider, dp } from "./dataProvider.js";
import { Card } from "./Card.js";
import Utils from "./class/util/Utils.js";

export class CardView extends PIXI.Container {
    
    constructor() {
        super();
        this.cardId = 1;
        this.init();
        this.addCard()
    }

    init(){
        this.cursor = 'pointer';
        this.eventMode = 'static';
        const onTap = (e) => {
            this.cardId ++;
            this.addCard()
        
        };
        this.on('pointertap', onTap);
    };

    addCard(){
        const card = this.addChild(new Card(this.cardId));
        card.position.set(dp.stageRect.halfWidth, dp.stageRect.halfHeight);
    }
}