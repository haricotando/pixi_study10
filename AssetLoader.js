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

        PIXI.Assets.add('animal1', '/assets/bit/animal1.png');
        PIXI.Assets.add('animal2', '/assets/bit/animal2.png');
        PIXI.Assets.add('burst1', '/assets/bit/burst1.png');
        PIXI.Assets.add('burst2', '/assets/bit/burst2.png');
        PIXI.Assets.add('cardpick1', '/assets/bit/cardpick1.png');
        PIXI.Assets.add('cardpick2', '/assets/bit/cardpick2.png');
        PIXI.Assets.add('cardtake1', '/assets/bit/cardtake1.png');
        PIXI.Assets.add('fallguy1', '/assets/bit/fallguy1.png');
        PIXI.Assets.add('fallguy2', '/assets/bit/fallguy2.png');
        PIXI.Assets.add('hand1', '/assets/bit/hand1.png');
        PIXI.Assets.add('hand2', '/assets/bit/hand2.png');
        PIXI.Assets.add('joker1', '/assets/bit/joker1.png');
        PIXI.Assets.add('joker2', '/assets/bit/joker2.png');
        PIXI.Assets.add('joker3', '/assets/bit/joker3.png');
        PIXI.Assets.add('lock1', '/assets/bit/lock1.png');
        PIXI.Assets.add('lock2', '/assets/bit/lock2.png');
        PIXI.Assets.add('offercard1', '/assets/bit/offercard1.png');
        PIXI.Assets.add('offercard2', '/assets/bit/offercard2.png');
        PIXI.Assets.add('peace1', '/assets/bit/peace1.png');
        PIXI.Assets.add('person_duo1', '/assets/bit/person_duo1.png');
        PIXI.Assets.add('person_trio1', '/assets/bit/person_trio1.png');
        PIXI.Assets.add('person_trio2', '/assets/bit/person_trio2.png');
        PIXI.Assets.add('revo1', '/assets/bit/revo1.png');
        PIXI.Assets.add('revo2', '/assets/bit/revo2.png');
        PIXI.Assets.add('spining1', '/assets/bit/spining1.png');
        PIXI.Assets.add('spot1', '/assets/bit/spot1.png');
        PIXI.Assets.add('spot2', '/assets/bit/spot2.png');
        
        PIXI.Assets.add('snd_success', 'https://pixijs.io/sound/examples/resources/success.mp3');
        PIXI.Assets.add('snd_car', 'https://pixijs.io/sound/examples/resources/car.mp3');
        
        this._assetsLoad = [

            'animal1',
            'animal2',
            'burst1',
            'burst2',
            'cardpick1',
            'cardpick2',
            'cardtake1',
            'fallguy1',
            'fallguy2',
            'hand1',
            'hand2',
            'joker1',
            'joker2',
            'joker3',
            'lock1',
            'lock2',
            'offercard1',
            'offercard2',
            'peace1',
            'person_duo1',
            'person_trio1',
            'person_trio2',
            'revo1',
            'revo2',
            'spining1',
            'spot1',
            'spot2',

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