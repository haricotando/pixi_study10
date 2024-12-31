import { dataProvider, dp } from "./dataProvider.js";
import GraphicsHelper from "./class/helper/GraphicsHelper.js";
import Utils from "./class/util/Utils.js";

export class CommonButton extends PIXI.Container {
    
    constructor(label) {
        super();

        const button = this.addChild(new PIXI.Container());
        const background = GraphicsHelper.exDrawRoundedRect(0, 0, dp.stageRect.width - 400, 150, 30, {color:0xFFFFFF, width:4, alpha:0.5}, {color:0xFFFFFF, alpha:0.2});
        Utils.pivotCenter(background);
        button.addChild(background)

        const labelText = button.addChild(new PIXI.Text(label, {
            fontFamily: 'Kaisei Decol', 
            fontWeight: 700,
            fontSize: 80, fill: 0xEFEFEF,
            dropShadow: true,
            dropShadowColor: '#000000',
            dropShadowAlpha: 0.9,
            dropShadowBlur: 16,
            dropShadowAngle: 0,
            dropShadowDistance: 0,
            
        }));
        labelText.anchor.set(0.5, 0.5);
        // textName.position.set(dp.stageRect.halfWidth, 200);
    }
}