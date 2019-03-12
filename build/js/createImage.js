"use strict";
/*************************************
 * 一番くじランキング
 *************************************/
Object.defineProperty(exports, "__esModule", { value: true });
const logger_1 = require("./logger");
const Canvas = require("canvas");
const fs = require("fs");
const path = require("path");
// const beforedata: RankList = require('../../test/before.json');
// const afterdata: RankList = require('../../test/after.json');
/**
 * ランキングの画像を生成
 * @param rankList ランキング情報
 * @returns 生成した画像ファイルのフルパス
 */
exports.createRankingImage = async (beforeRankList, rankList) => {
    /** 背景画像 */
    const backgroundImagePath = './static/images/background.png';
    const canvas = Canvas.createCanvas(1280, 720, 'png');
    const ctx = canvas.getContext('2d');
    if (!ctx)
        return ''; // typesafe
    Canvas.registerFont('./static/font/DF-ReiGaSou-W7.ttc', { family: 'reigasou' });
    /** 見出し部分のフォント */
    const FONT_FAMILY_TITLE = 'reigasou';
    /** 見出し以外全般のフォント */
    const FONT_FAMILY_TEXT = 'reigasou';
    // 背景画像セット
    await Canvas.loadImage(backgroundImagePath).then(image => {
        ctx.drawImage(image, 0, 0, 1280, 720);
    });
    // イベント名
    ctx.textAlign = 'left';
    ctx.fillStyle = 'deeppink';
    ctx.font = `50px ${FONT_FAMILY_TITLE}`;
    ctx.fillText('一番くじ アイカツ！総選挙 ランキング', 50, 70);
    // カテゴリ
    ctx.textAlign = 'left';
    ctx.fillStyle = 'blue';
    ctx.font = `40px ${FONT_FAMILY_TITLE}`;
    ctx.fillText('個人ランキング', 130, 140);
    ctx.fillStyle = 'darkorange';
    ctx.fillText('タイプ別トップ', 800, 140);
    // 更新時刻
    ctx.textAlign = 'right';
    ctx.fillStyle = 'black';
    ctx.font = `25px ${FONT_FAMILY_TEXT}`;
    ctx.fillText('Update Time', 1240, 40);
    ctx.font = `30px ${FONT_FAMILY_TEXT}`;
    ctx.fillText(rankList.date, 1240, 80);
    // TOP8出力
    ctx.textAlign = 'left';
    ctx.fillStyle = 'black';
    ctx.font = `40px ${FONT_FAMILY_TEXT}`;
    const top10BaseGridX = 100;
    const rankBaseGridY = 200;
    const allRank = rankList.all.sort(compareRank);
    for (let i = 0; i < 10; i++) {
        const rank = allRank[i];
        // 順位
        ctx.fillText(`${rank.rank}位`, top10BaseGridX, rankBaseGridY + i * 55);
        // 名前
        ctx.fillText(rank.name.slice(2), top10BaseGridX + 150, rankBaseGridY + i * 55);
        // アイコン
        const iconpath = idolIconPath(rank.name);
        await Canvas.loadImage(iconpath).then(image => {
            ctx.drawImage(image, top10BaseGridX + 400, rankBaseGridY + i * 55 - 35, 50, 50);
        });
        // 前回からの変動
        const lastRank = beforeRankList.all.filter(idol => idol.name === rank.name);
        if (lastRank.length > 0) {
            let changeIconPath;
            if (rank.rank > lastRank[0].rank) {
                changeIconPath = './static/images/up.png';
            }
            else if (rank.rank < lastRank[0].rank) {
                changeIconPath = './static/images/down.png';
            }
            else {
                changeIconPath = './static/images/same.png';
            }
            await Canvas.loadImage(changeIconPath).then(image => {
                ctx.drawImage(image, top10BaseGridX + 90, rankBaseGridY + i * 55 - 35, 50, 50);
            });
        }
    }
    // タイプ別
    ctx.textAlign = 'right';
    ctx.fillStyle = 'black';
    ctx.font = `36px ${FONT_FAMILY_TEXT} bold`;
    // キュート
    const cuteRank = rankList.cute.sort(compareRank);
    const cuteImagePath = idolIconPath(cuteRank[0].name);
    await Canvas.loadImage(cuteImagePath).then(image => {
        ctx.drawImage(image, 650, 200, 200, 200);
    });
    // クール
    const coolRank = rankList.cool.sort(compareRank);
    const coolImagePath = idolIconPath(coolRank[0].name);
    await Canvas.loadImage(coolImagePath).then(image => {
        ctx.drawImage(image, 950, 200, 200, 200);
    });
    // セクシー
    const sexyRank = rankList.sexy.sort(compareRank);
    const sexyImagePath = idolIconPath(sexyRank[0].name);
    await Canvas.loadImage(sexyImagePath).then(image => {
        ctx.drawImage(image, 650, 450, 200, 200);
    });
    // ポップ
    const popRank = rankList.pop.sort(compareRank);
    const popImagePath = idolIconPath(popRank[0].name);
    await Canvas.loadImage(popImagePath).then(image => {
        ctx.drawImage(image, 950, 450, 200, 200);
    });
    // 注意書き
    ctx.textAlign = 'right';
    ctx.fillStyle = 'black';
    ctx.font = `16px ${FONT_FAMILY_TITLE}`;
    ctx.fillText('※順位変動は前日比', 1230, 700);
    // ファイル出力
    const fileImagePath = path.normalize(path.join(__dirname, `../../data/rank.png`));
    const buf = canvas.toBuffer();
    fs.writeFileSync(fileImagePath, buf);
    logger_1.default.system.info(`[createRankingImage]${fileImagePath}`);
    return fileImagePath;
};
const idolIconPath = (idolname) => {
    const idolMap = {
        '♥ 星宮いちご': 1,
        '♥ 北大路さくら': 2,
        '♥ 姫里マリア': 3,
        '♥ 星宮らいち': 4,
        '♥ 大空あかり': 5,
        '♥ 天羽まどか': 6,
        '♥ 音城ノエル': 7,
        '♥ 瀬名 翼': 8,
        '♦ 霧矢あおい': 9,
        '♦ 藤堂ユリカ': 10,
        '♦ 神谷しおん': 11,
        '♦ 音城セイラ': 12,
        '♦ 涼川直人（ナオ）': 13,
        '♦ 氷上スミレ': 14,
        '♦ 黒沢 凛': 15,
        '♦ 服部ユウ': 16,
        '♦ ジョニー別府': 17,
        '♠ 紫吹 蘭': 18,
        '♠ 三ノ輪ヒカリ': 19,
        '♠ 風沢そら': 20,
        '♠ 神崎美月': 21,
        '♠ 星宮りんご（ミヤ）': 22,
        '♠ 光石織姫（ヒメ）': 23,
        '♠ 紅林珠璃': 24,
        '♠ 大地のの': 25,
        '♠ 白樺リサ': 26,
        '♠ 藤原みやび': 27,
        '♣ 有栖川おとめ': 28,
        '♣ 一ノ瀬かえで': 29,
        '♣ 冴草きい': 30,
        '♣ 夏樹みくる': 31,
        '♣ 新条ひなき': 32,
        '♣ 栗栖ここね': 33,
        '♣ 堂島ニーナ': 34,
        '♣ 四ツ葉 春': 35
    };
    const num = idolMap[idolname];
    return `./static/images/aikatsu_icon_before_0${num}.jpg`;
};
const compareRank = (a, b) => {
    // Use toUpperCase() to ignore character casing
    const A = a.rank;
    const B = b.rank;
    let comparison = 0;
    if (A > B) {
        comparison = 1;
    }
    else if (A < B) {
        comparison = -1;
    }
    return comparison;
};
// createRankingImage(beforedata, afterdata);
