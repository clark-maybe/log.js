/** 生成默认配置信息 */

export const VERSION = '2.0.1';

//忽略采集
export const IGNORE_LIST = [
    `${location.protocol}//pv.sohu.com/cityjson?ie=utf-8`
];

export function getDefaultInfo() {

    let temp: { logType: string[]; ioFilter: (item: any) => boolean; pattern: string; degree: number; id: string; sendAddress: string; reportingBefore: (params: any) => any } = {
        pattern: 'default',
        logType: ["error", "diy", 'click', 'io'],
        degree: 1,
        id: 'logJs',
        ioFilter: item => true,
        sendAddress: '',
        reportingBefore: params => params
    };

    return temp;
}