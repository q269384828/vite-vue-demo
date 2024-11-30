import * as zh from './zh';

const configsMap = Object.fromEntries([
    zh
].map((item) => [item.lang, item.config]));

export default configsMap;