import { dataProvider, dp } from "./dataProvider.js";
import GraphicsHelper from "./class/helper/GraphicsHelper.js";

export class Instruction extends PIXI.Container {
    
    constructor() {
        super();
        this.init();
    }

    init(){
        const bg = this.addChild(GraphicsHelper.exDrawRect(0, 0, dp.stageRect.width, dp.stageRect.height, false, {color:0x000000}));
        const textSample = this.addChild(new PIXI.Text("INSTRUCTION", {
            fontFamily: 'Inter', 
            fontWeight: 400,
            fontSize: 65, fill: 0xFEFEFE,
            letterSpacing: 15,
        }));
        textSample.anchor.set(0.5, 0);
        textSample.x = dp.stageRect.halfWidth;
        textSample.y = 100;

        const textSample2 = this.addChild(new PIXI.Text("ここに使い方が入る", {
            fontSize: 35, fill: 0xFEFEFE,
        }));
        textSample2.anchor.set(0.5, 0);
        textSample2.x = dp.stageRect.halfWidth;
        textSample2.y = 500;
        
        this.initButton();
    }
    
    initButton(){
        const button = this.addChild(new PIXI.Text("↓", {
            fontFamily: 'Inter', 
            fontWeight: 400,
            fontSize: 85, fill: 0xFEFEFE,
            letterSpacing: 15,
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
                this.parent.initGameContainer();
            });
        };
        button.on('pointertap', onTap);
    }
}