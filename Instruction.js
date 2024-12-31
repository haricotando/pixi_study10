import { dataProvider, dp } from "./dataProvider.js";
import GraphicsHelper from "./class/helper/GraphicsHelper.js";
import { CommonButton } from "./CommonButton.js";

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
        const startButton = this.addChild(new CommonButton('開始する'));
        startButton.x = dp.stageRect.halfWidth;
        startButton.y = dp.stageRect.height - 200;
        
        startButton.cursor    = 'pointer';
        startButton.eventMode = 'static';
        const onTap = (e) => {
            startButton.eventMode = 'none';
            gsap.timeline()
            // .to(startButton.scale, {x:0.8, y:0.8, duration:0.5, ease:'back.out(5)'});
            .to(this, {alpha:0})
            .call(()=>{
                this.parent.initGameContainer();
            });
        };

        startButton.on('pointertap', onTap);

    }
}