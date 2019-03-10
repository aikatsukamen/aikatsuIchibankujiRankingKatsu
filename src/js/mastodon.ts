import * as rp from 'request-promise';
import * as fs from 'fs';
import logger from './logger';
import * as configModule from 'config';
const config = configModule.util.toObject(configModule);
config.kkt.token = config.kkt.token || process.env.NODE_KKT_TOKEN;
if (!config.kkt.token) throw new Error('token未設定');

export const uploadImage = async (imagepath: string): Promise<any> => {
  // スプレッドシートからランキング取得
  const opt = {
    method: 'POST',
    uri: 'https://kirakiratter.com/api/v1/media',
    headers: {
      Authorization: 'Bearer ' + config.kkt.token,
      'Content-type': 'multipart/form-data'
    },
    formData: {
      file: fs.createReadStream(imagepath)
    },
    json: true
  };
  logger.access.info(opt);
  const response = await rp(opt);
  logger.access.info(JSON.stringify(response, null, '  '));
  return response;
};

export const katsu = async (text: string, imagepathList: string[]): Promise<void> => {
  const tootBody = {
    status: text,
    in_reply_to_id: null,
    media_ids: imagepathList,
    sensitive: null,
    spoiler_text: '',
    visibility: config.kkt.visibility
  };

  const opt = {
    method: 'POST',
    uri: 'https://kirakiratter.com/api/v1/statuses',
    headers: {
      Authorization: 'Bearer ' + config.kkt.token,
      'Content-type': 'application/json'
    },
    body: tootBody,
    json: true
  };
  logger.access.info(JSON.stringify(opt, null, '  '));
  const response = await rp(opt);
  logger.access.info(JSON.stringify(response, null, '  '));
};

// (async () => {
//   const res = await uploadImage('./data/rank.png');
//   console.log(res);
// })();
