import {getDefaultInfo} from "../config";
import storage from "../lib/storage";
import md5 from 'md5';
import {ConfigInfo} from "../interface";

/** 深拷贝 */
export const deep_copy = (obj: any) => {
    if (!obj) return {};
    let result: any;
    if (typeof obj === "object") {
        result = obj.constructor === Array ? [] : {};
        for (let i in obj) {
            typeof obj[i] === "object"
                ? (result[i] = deep_copy(obj[i]))
                : obj.hasOwnProperty(i)
                ? (result[i] = obj[i])
                : void 0;
        }
    } else {
        result = obj;
    }
    return result;
}

/** 配置项校正 */
export const parameter_correction = (params: any) => {
    if (!params) return getDefaultInfo();
    let tempObj: ConfigInfo = getDefaultInfo();
    tempObj.pattern = 'config';
    Object.assign(tempObj, storage.config_info);
    Object.assign(tempObj, params);
    //校正采集度
    if (tempObj) {
        if (tempObj.degree > 1) {
            tempObj.degree = 1;
        }
        if (tempObj.degree < 0) {
            tempObj.degree = 0;
        }
    }
    //校正进入类型
    if (tempObj && tempObj.pattern) {
        tempObj.pattern = 'config';
    }
    return tempObj;
}

/** 生成uid */
export const create_uid = () => md5(storage.terminal_info.ip + navigator.userAgent);