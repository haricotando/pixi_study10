import { dataProvider, dp } from "/dataProvider.js";

export class ExApplicationRoot extends PIXI.Container {
    
    constructor() {
        super();
    }

    /** ------------------------------------------------------------
        * アセットをまとめてロード
        * 公式の画像でテスト読み込み
     */
    loadAssets(){
        const assetsPromise = PIXI.Assets.load(this._assetsLoad);
        
        assetsPromise.then((items) => {
            dp.assets = items;
            this.init();
        });
    }
}