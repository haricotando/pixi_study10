import { dataProvider, dp } from "./dataProvider.js";
import GraphicsHelper from "./class/helper/GraphicsHelper.js";
import { CommonButton } from "./CommonButton.js";
import Utils from "./class/util/Utils.js";

export class Instruction extends PIXI.Container {
    
    constructor() {
        super();
        this.init();
    }

    init(){
        const bg = this.addChild(GraphicsHelper.exDrawRect(0, 0, dp.stageRect.width, dp.stageRect.height, false, {color:0x000000}));
        const textTitle = this.addChild(new PIXI.Text("INSTRUCTION", {
            fontFamily: 'Inter', 
            fontWeight: 400,
            fontSize: 65, fill: 0xFEFEFE,
            letterSpacing: 15,
        }));
        textTitle.anchor.set(0.5, 0);
        textTitle.x = dp.stageRect.halfWidth;
        textTitle.y = 100;

        const textDescripton = this.addChild(new PIXI.Text("そのうちここに\n使い方を入れる", {
            fontFamily: 'Kaisei Decol', 
            fontWeight: 700,
            fontSize: 50, fill: 0xFEFEFE,
            align: 'center',
            breakWords: true,
            wordWrap: true,
            wordWrapWidth: 800,
        }));
        textDescripton.anchor.set(0.5, 0);
        textDescripton.x = dp.stageRect.halfWidth;
        textDescripton.y = 500;

        this.initButton();
    }
    
    initButton(){
        const startButton = this.addChild(new CommonButton('進む'));
        startButton.x = dp.stageRect.halfWidth;
        startButton.y = dp.stageRect.height - (dp.stageRect.height / 10);
        
        startButton.cursor    = 'pointer';
        startButton.eventMode = 'static';
        const onTap = (e) => {
            startButton.eventMode = 'none';
            this.parent.initGameContainer();
        };

        startButton.on('pointertap', onTap);

    }
}