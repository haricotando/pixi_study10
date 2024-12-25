import { dataProvider, dp } from "./dataProvider.js";
import GraphicsHelper from "./class/helper/GraphicsHelper.js";
import Utils from "./class/util/Utils.js";
import { Card } from "/Card.js";

export class GameReady extends PIXI.Container {
    
    constructor(id) {
        super();

        let countX = 0;
        let countY = 0;
        const margin = 2;
        const gridX = Math.round((dp.stageRect.width - margin) / 4);

        Utils.shuffleArray(dp.deck);
        for(let i = 0; i<dp.deck.length; i++){
            let card = this.addChild(new Card(dp.deck[i]));
            card.alpha = 0;
            card.rotation = Utils.degreesToRadians(Math.random()*10-5);
            Utils.resizeImage(card, {width: gridX, height: gridX})
            card.position.set(countX * gridX + card.width / 2 + margin / 2, countY * card.height + card.height / 2);
            Utils.snapshotPos(card);
            const tl = gsap.timeline({delay:i/50})
                .set(card.scale, {x:1.2, y:1.2})
                .to(card.scale, {x:card.snapshot.scale.x, y:card.snapshot.scale.y, ease:'back.out(4)'})
                .to(card, {alpha:1, rotation: 0}, '<')
            
            // card.rotation = Utils.degreesToRadians(Math.random()*6-3);
            if(countX < 3){
                countX ++;
            }else{
                countX = 0;
                countY ++;
            }
        }
    }
}