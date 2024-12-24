import { dataProvider, dp } from "/dataProvider.js";
import { ExApplicationRoot } from "/class/display/ExApplicationRoot.js";
import GraphicsHelper from "/class/helper/GraphicsHelper.js";
import Utils from "/class/util/Utils.js";

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

        const ssURL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vTG46XRL7bpMsWPWHyxBbXzDD17TkCtwicyOZVx03XywleKxopA4Sd1phRe-0oPfcV76NxEwhoJLpsb/pub?gid=0&single=true&output=csv';

        //     function fetchSpreadsheetDataX() {
        //     try {
        //       const response = await fetch(ssURL);
        //       const text = await response.text();
        //       const rows = text.split('\n').map(row => row.split(','));
        //       console.log('Spreadsheet Data:', rows);
        //     } catch (error) {
        //       console.error('Error fetching spreadsheet data:', error);
        //     }
        //   }
          
            // async function fetchSpreadsheetDataT() {
        //     try {
        //       const response = await fetch(ssURL);
        //       const text = await response.text();
          
        //       // TSVデータを行ごとに分割
        //       const rows = text.split('\n');
          
        //       // 最初の行をキーとして使用（タブ区切り）
        //       const keys = rows[0].split('\t').map(key => key.trim());
          
        //       // データ部分を処理
        //       const result = [];
        //       let currentRow = [];
        //       let isInsideField = false;
          
        //       for (let i = 1; i < rows.length; i++) {
        //         let row = rows[i];
          
        //         // 行が空の場合はスキップ
        //         if (!row.trim()) continue;
          
        //         // 改行を含むフィールドを結合
        //         if (row.includes('\t') || !isInsideField) {
        //           currentRow.push(row);
        //           if (row.split('\t').length === keys.length) {
        //             const combinedRow = currentRow.join('\n');
        //             currentRow = [];
          
        //             // フィールドをタブ区切りで分割
        //             const values = combinedRow.split('\t');
          
        //             // 各行をオブジェクトに変換
        //             const entry = {};
        //             keys.forEach((key, index) => {
        //               const value = values[index]?.trim() || '';
        //               entry[key] = key === 'quantity' ? Number(value) : value;
        //             });
          
        //             result.push(entry);
        //           }
        //         } else {
        //           currentRow.push(row);
        //         }
        //       }
          
        //       console.log('Formatted Data:', result);
        //       alert(result[2].description);
              
        //       return result;
        //     } catch (error) {
        //       console.error('Error fetching spreadsheet data:', error);
        //     }
        //   }
          
          
            //   async function fetchSpreadsheetDataX() {
        //     try {
        //       const response = await fetch(ssURL);
        //       const text = await response.text();
          
        //       // CSVデータを行ごとに分割（改行で分割）
        //       const rows = text.split('\n');
          
        //       // 最初の行をキーとして使用
        //       const keys = rows[0].split(',').map(key => key.trim());
          
        //       // データ部分を処理
        //       const result = [];
        //       let currentRow = [];
        //       let currentRowLength = 0;
          
        //       for (let i = 1; i < rows.length; i++) {
        //         const row = rows[i].trim();
          
        //         if (!row) continue; // 空行を無視
          
        //         // フィールドをカンマで分割
        //         const values = row.split(',');
          
        //         // 現在の行に追加
        //         currentRow.push(...values);
        //         currentRowLength += values.length;
          
        //         // 行が完成（キーの数と一致）
        //         if (currentRowLength >= keys.length) {
        //           const entry = {};
        //           keys.forEach((key, index) => {
        //             entry[key] = key === 'quantity'
        //               ? Number(currentRow[index]?.trim() || 0)
        //               : (currentRow[index]?.trim() || '');
        //           });
        //           result.push(entry);
          
        //           // 状態をリセット
        //           currentRow = [];
        //           currentRowLength = 0;
        //         }
        //       }
          
        //       console.log('Formatted Data:', result);
        //       return result;
        //     } catch (error) {
        //       console.error('Error fetching spreadsheet data:', error);
        //     }
        //   }

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
              console.log(text);
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
          
              console.log('Formatted Data:', result);
              console.log(result[2].description);
              
              return result;
            } catch (error) {
              console.error('Error fetching spreadsheet data:', error);
            }
          }

   






        fetchSpreadsheetData();

        const bg = this.addChild(GraphicsHelper.exDrawRect(0, 0, dp.stageRect.width, dp.stageRect.height, {color:0xFF00FF, width:2}, {color:0xEFEFEF}));
        
        /**
         * 画像のテスト
        */
        const imageSample = PIXI.Sprite.from(dataProvider.assets.flowerTop);
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
            // letterSpacing: 15,
        }));
        textSample.anchor.set(0.5, 0);
        textSample.x = dp.stageRect.halfWidth;
        textSample.y = 100;

    }
    
    initAssetLoader(){
        PIXI.Assets.add('flowerTop', 'https://pixijs.com/assets/flowerTop.png');
        this._assetsLoad = [
            'flowerTop',
        ];
        this.loadAssets();
    }

    parseCSV(data) {
        console.log('called');
        
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

}