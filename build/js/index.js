"use strict";
/*************************************
 * 一番くじランキング
 *************************************/
Object.defineProperty(exports, "__esModule", { value: true });
const logger_1 = require("./logger");
const rp = require("request-promise");
const cron_1 = require("cron");
const createImage_1 = require("./createImage");
const mastodon_1 = require("./mastodon");
// 起動時メッセージ
logger_1.default.system.info(`にょわー☆(${process.pid})`);
let beforeRankList = {
    all: [],
    cute: [],
    cool: [],
    sexy: [],
    pop: [],
    date: ''
};
/**
 * ランキングを取得してカツする
 * @param fetchOnly beforeに入れるだけ
 */
const getRanking = async (fetchOnly) => {
    try {
        // スプレッドシートからランキング取得
        const getOpt = {
            method: 'GET',
            uri: 'https://script.google.com/macros/s/AKfycbx_5LNDwQoA3r60vZzceNJMY49DxxHxfW3cnC9K1P8nYLpHaxeN/exec',
            json: true
        };
        const response = await rp(getOpt);
        logger_1.default.access.debug(JSON.stringify(response, null, '  '));
        if (!fetchOnly) {
            const filepath = await createImage_1.createRankingImage(beforeRankList, response);
            const imagepath = await mastodon_1.uploadImage(filepath);
            await mastodon_1.katsu('.', [imagepath.id]);
        }
        beforeRankList = response;
    }
    catch (e) {
        logger_1.default.system.error(e);
    }
};
// 0時0分に実行
new cron_1.CronJob('0 0 * * *', getRanking).start();
// 初回起動はデータの取得だけ行う
getRanking(true);
/**
 * シャットダウン処理
 *
 * FIXME: pm2経由だと上手く動かない
 */
const shutdown = () => {
    logger_1.default.system.info('終了信号を受信しました。');
    setTimeout(() => {
        process.exit(0);
    }, 1500);
};
// 終了信号を受信
process.on('SIGTERM', shutdown);
process.on('SIGINT', shutdown);
