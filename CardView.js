import { dataProvider, dp } from "./dataProvider.js";
import { Card } from "./Card.js";
import Utils from "./class/util/Utils.js";

export class CardView extends PIXI.Container {
    
    constructor() {
        super();
        this.cardId = 1;
        this.pastCard = undefined;
        this.init();
        this.addCard();
    }

    init(){
        this.cursor = 'pointer';
        this.eventMode = 'static';
        const onTap = (e) => {
            this.cardId ++;
            
            if(Utils.findObjectByKey(dp.assets.csv, 'id', this.cardId.toString())){
                this.addCard()
            }

        
        };
        this.on('pointertap', onTap);
    };

    addCard(){
        const card = this.addChild(new Card(this.cardId));
        card.position.set(dp.stageRect.halfWidth, dp.stageRect.halfHeight);
        card.alpha = 0;
        card.scale.set(0.8);
        PIXI.sound.play('pop1');
        gsap.timeline({delay:0.1})
            .to(card.scale, {x:1, y:1, duration: 0.2, ease:'elastic.out(2)'})
            .to(card, {alpha:1, duration:0.2, ease:'none'}, '<');

        if(this.pastCard){
            this.removeChild(this.pastCard);
        }
        this.pastCard = card;
    }
}