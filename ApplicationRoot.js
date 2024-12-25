import { dataProvider, dp } from "/dataProvider.js";
import { ExApplicationRoot } from "/class/display/ExApplicationRoot.js";
import GraphicsHelper from "/class/helper/GraphicsHelper.js";
import Utils from "/class/util/Utils.js";
import { UIKitButton } from "/class/ui/UIKitButton.js";
import { GameReady } from "/GameReady.js";

export class ApplicationRoot extends ExApplicationRoot {
    
    constructor() {
        super();
        this.initAssetLoader();
        // this.init();
    }

    /** ------------------------------------------------------------
     * アセット読み込み時は initAssetLoader -> init
    */
    init(){
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
        this.addChild(new GameReady());
    }

    startApp(){
        /**
        * フォントのテスト
       */
        const textSample = this.addChild(new PIXI.Text("APP ROOT", {
            fontFamily: 'Dela+Gothic+One', 
            fontWeight: 400,
            fontSize: 35, fill: 0x545550,
            align: 'center'
            // letterSpacing: 15,
        }));
        textSample.anchor.set(0.5, 0);
        textSample.x = dp.stageRect.halfWidth;
        textSample.y = 100;

        textSample.text = dp.assets.csv[2].description
    }
    
    initAssetLoader(){
        PIXI.Assets.add('cardCommon', '/assets/card_common.png');
        PIXI.Assets.add('cardA', '/assets/card_a.png');
        PIXI.Assets.add('cardB', '/assets/card_b.png');
        PIXI.Assets.add('cardC', '/assets/card_c.png');
        PIXI.Assets.add('cardD', '/assets/card_d.png');
        PIXI.Assets.add('cardE', '/assets/card_e.png');
        PIXI.Assets.add('cardF', '/assets/card_f.png');
        this._assetsLoad = [
            'cardCommon',
            'cardA',
            'cardB',
            'cardC',
            'cardD',
            'cardE',
            'cardF',
        ];
        this.loadAssets();
    }
}