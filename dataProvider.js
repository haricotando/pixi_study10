export const dataProvider = {
    // 後から定義でも良いがコード保管のために undefined で定義だけする
    app: undefined,

    csvPath: 'https://docs.google.com/spreadsheets/d/e/2PACX-1vTG46XRL7bpMsWPWHyxBbXzDD17TkCtwicyOZVx03XywleKxopA4Sd1phRe-0oPfcV76NxEwhoJLpsb/pub?gid=0&single=true&output=csv',

    stageRect : {
        width             : undefined,
        height            : undefined,
        halfWidth         : undefined,
        halfHeight        : undefined,
        negativeWidth     : undefined,
        negativeHeight    : undefined,
        negativeHalfWidth : undefined,
        negativeHalfHeight: undefined,
    },

    assets: {},

    cardList : [],
    deckXXX: [],
    deck: [],

    textStyle: {},
    colorPalette: {},
};

export const dp = dataProvider;