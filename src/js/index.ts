/*************************************
 * 一番くじランキング
 *************************************/

import logger from './logger';
import * as rp from 'request-promise';
import { CronJob } from 'cron';
import { RankList } from './types';
import { createRankingImage } from './createImage';
import { uploadImage, katsu } from './mastodon';

// 起動時メッセージ
logger.console.info('にょわー☆');

const getRanking = async () => {
  try {
    // スプレッドシートからランキング取得
    const getOpt = {
      method: 'GET',
      uri: 'https://script.google.com/macros/s/AKfycbx_5LNDwQoA3r60vZzceNJMY49DxxHxfW3cnC9K1P8nYLpHaxeN/exec',
      json: true
    };
    const response: RankList = await rp(getOpt);
    logger.access.debug(JSON.stringify(response, null, '  '));
    const filepath = await createRankingImage(response);

    const imagepath = await uploadImage(filepath);
    await katsu('.', [imagepath.id]);
  } catch (e) {
    logger.system.error(e);
  }
};

getRanking();

// 0時0分に実行
new CronJob('0 0 * * *', getRanking).start();

/**
 * シャットダウン処理
 *
 * FIXME: pm2経由だと上手く動かない
 */
const shutdown = () => {
  logger.system.info('終了信号を受信しました。');
  setTimeout(() => {
    process.exit(0);
  }, 1500);
};
// 終了信号を受信
process.on('SIGTERM', shutdown);
process.on('SIGINT', shutdown);
