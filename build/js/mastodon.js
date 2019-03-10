"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const rp = require("request-promise");
const fs = require("fs");
const logger_1 = require("./logger");
const configModule = require("config");
const config = configModule.util.toObject(configModule);
config.kkt.token = process.env.NODE_KKT_TOKEN || config.kkt.token;
if (!config.kkt.token)
    throw new Error('token未設定');
exports.uploadImage = async (imagepath) => {
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
    logger_1.default.access.info(opt);
    const response = await rp(opt);
    logger_1.default.access.info(JSON.stringify(response, null, '  '));
    return response;
};
exports.katsu = async (text, imagepathList) => {
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
    logger_1.default.access.info(JSON.stringify(opt, null, '  '));
    const response = await rp(opt);
    logger_1.default.access.info(JSON.stringify(response, null, '  '));
};
// (async () => {
//   const res = await uploadImage('./data/rank.png');
//   console.log(res);
// })();
//# sourceMappingURL=mastodon.js.map