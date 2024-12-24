import { dataProvider, dp } from "./dataProvider.js";

export class viewQRcode extends PIXI.Container {
    
    constructor() {
        super();

        const qr = qrcode(0, 'M');
        qr.addData(window.location.href);
        qr.make();
        const qrDataURL = qr.createDataURL(10, 0);
        const texture = PIXI.Texture.from(qrDataURL);
        const qrContainer = new PIXI.Sprite(texture);
        
        qrContainer.x = dp.app.screen.width * 0.5 - 125;
        qrContainer.y = dp.app.screen.height * 0.5 - 125;

        this.addChild(qrContainer);
    }
}