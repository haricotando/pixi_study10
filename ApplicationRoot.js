import { dataProvider, dp } from "/dataProvider.js";
import { ExApplicationRoot } from "/class/display/ExApplicationRoot.js";
import GraphicsHelper from "/class/helper/GraphicsHelper.js";
import Utils from "/class/util/Utils.js";
import { UIKitButton } from "/class/ui/UIKitButton.js";

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
        const ssURL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vTG46XRL7bpMsWPWHyxBbXzDD17TkCtwicyOZVx03XywleKxopA4Sd1phRe-0oPfcV76NxEwhoJLpsb/pub?gid=0&single=true&output=csv';
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
            _this.appStandBy();
            } catch (error) {
                console.error('Error fetching spreadsheet data:', error);
            }
        }
        fetchSpreadsheetData();
    }

    appStandBy(){
        const bg = this.addChild(GraphicsHelper.exDrawRect(0, 0, dp.stageRect.width, dp.stageRect.height, {color:0xFF00FF, width:2}, {color:0xEFEFEF}));
        this.startApp();
    }

    startApp(){
        /**
         * 画像のテスト
        */
        const imageSample = PIXI.Sprite.from(dp.assets.flowerTop);
        this.addChild(imageSample);
        Utils.layoutCenter(imageSample, dp.stageRect)
        Utils.pivotCenter(imageSample);
        
        /**
        * フォントのテスト
       */
        const textSample = this.addChild(new PIXI.Text("APP ROOT", {
            fontFamily: 'Inter', 
            fontWeight: 700,
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
        PIXI.Assets.add('flowerTop', 'https://pixijs.com/assets/flowerTop.png');
        this._assetsLoad = [
            'flowerTop',
        ];
        this.loadAssets();
    }
}