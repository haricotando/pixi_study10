import Utils from "./class/util/Utils.js";
import { dataProvider, dp } from "./dataProvider.js";

export class AssetLoader extends PIXI.Container {
    
    constructor() {
        super();

        this._valLoaded = 0;
        this._loaded = 0;
        this.isAssetLoaded = false;

        this.label = this.addChild(new PIXI.Text("...", {
            fontFamily: 'Inter', 
            fontWeight: 700,
            fontSize: 65, fill: 0x545550,
        }));
        this.label.anchor.set(0.5);
        
        this.addAssets();
    }
    
    /**
     * アセット登録
     */
    addAssets(){
        PIXI.Assets.add('cardCommon', '/assets/card_common.png');
        PIXI.Assets.add('cardA', '/assets/card_a.png');
        PIXI.Assets.add('cardB', '/assets/card_b.png');
        PIXI.Assets.add('cardC', '/assets/card_c.png');
        PIXI.Assets.add('cardD', '/assets/card_d.png');
        PIXI.Assets.add('cardE', '/assets/card_e.png');
        PIXI.Assets.add('cardF', '/assets/card_f.png');
        PIXI.Assets.add('snd_success', 'https://pixijs.io/sound/examples/resources/success.mp3');
        PIXI.Assets.add('snd_car', 'https://pixijs.io/sound/examples/resources/car.mp3');
        
        this._assetsLoad = [
            'cardCommon',
            'cardA',
            'cardB',
            'cardC',
            'cardD',
            'cardE',
            'cardF',
            'snd_success',
            'snd_car'
        ];

        const onProgress = (e) => {
            this.label.text = `${Math.round(e * 100)}%`;
        }

        const assetsPromise = PIXI.Assets.load(this._assetsLoad, onProgress);
        
        assetsPromise.then((items) => {
            dp.assets = items;
            this.isAssetLoaded = true;
            this.loadCSV();
            // this.emit("onComplete", { 
            //     isAssetLoaded : true,
            //     message: "アセット読み込み完了"
            // });
        });
    }

    /**
     * 固有追加
     */
    loadCSV(){
        const _this = this;
        const ssURL = Utils.addCacheBuster(dp.csvPath);
        
        const parseCSV = (data) => {
            const rows = [];
            let currentRow = [];
            let insideQuote = false;
            let field = '';
            for (let i = 0; i < data.length; i++) {
                const char = data[i];
                const nextChar = data[i + 1];
                if (char === '"' && nextChar === '"') {
                // ダブルクォートのエスケープ処理
                    field += '"';
                    i++;
                } else if (char === '"') {
                    // フィールド内外の切り替え
                    insideQuote = !insideQuote;
                } else if (char === ',' && !insideQuote) {
                    // フィールドの終了
                    currentRow.push(field);
                    field = '';
                } else if (char === '\n' && !insideQuote) {
                    // 行の終了
                    currentRow.push(field);
                    rows.push(currentRow);
                    currentRow = [];
                    field = '';
                } else {
                    // フィールドに文字を追加
                    field += char;
                }
            }
            // 最後の行を追加
            if (field || currentRow.length > 0) {
                currentRow.push(field);
                rows.push(currentRow);
            }
            return rows;
        }

        async function fetchSpreadsheetData() {
            try {
                const response = await fetch(ssURL);
                const text = await response.text();
                // 行を分割しつつ、改行を含むフィールドを結合
                const rows = parseCSV(text);
                // 最初の行をキーとして使用
                const keys = rows[0];
                // データ部分を構造体に変換
                const result = rows.slice(1).map(row => {
                const entry = {};
                keys.forEach((key, index) => {
                    entry[key.trim()] = key === 'quantity'
                    ? Number(row[index]?.trim() || 0)
                    : (row[index]?.trim() || '');
                });
                return entry;
            });
            dp.assets.csv = result;
            _this.initDeck();
            } catch (error) {
                console.error(error);
            }
        }
        fetchSpreadsheetData();
    }

    initDeck(){
        for(let i = 0; i<dp.assets.csv.length; i++){
            for(let ii = 0; ii<dp.assets.csv[i].quantity; ii++){
                dp.deck.push(dp.assets.csv[i].id);
            }
        }
        this.emit("onComplete", { 
            isAssetLoaded : true,
            message: "アセット読み込み完了"
        });
    }
}