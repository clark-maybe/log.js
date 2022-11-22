/** configuration information */
export interface ConfigInfo {
    logType: string[]; //日志类型 - [ 'error', 'click', 'diy', 'io' ]
    ioFilter: (item) => boolean; //I/O筛选器 用以定义 io_list 获取规则
    pattern: string; //启动模式 - default / config
    degree: number; //采集率 - (0 - 1)
    id: string; //实例标识
    sendAddress: string; //日志发送地址（默认 POST application/json 接收服务需自行配置跨域）
    reportingBefore: (params) => any; //日志上报前钩子（用以重构参数结构，追加自定义参数）
}

/** Terminal information */
export interface TerminalInfo {
    resolving_power?: string, //分辨率
    referrer?: string, //referrer
    ip?: string, //IP
    city?: string, //城市
}

/** Performance Information */
export interface PerformanceInfo {
    ttfb?: number, //第一字节时间
    fcp?: number, //首次内容绘制
    lcp?: number, //最大内容绘制
    fid?: number, //首次输入延迟
    fp?: number, //白屏耗时
    redirect_time?: number, //重定向耗时
    domain_lookup_time?: number, //DNS查询耗时
    connect_time?: number, //TCP链接耗时
    response_time?: number, //HTTP请求耗时
    dom_complete_time?: number, //DOM解析耗时
}

/** Error log message body */
export interface ErrorInfo {
    logType: string;
    lineno?: number;
    timeStep: number;
    colno?: number;
    source?: string;
    href?: string;
    type?: Event | string;
    error?: Error
}

/** Custom log message body */
export interface DiyInfo {
    logType: string,
    content?: any, //日志内容
    tag?: string, //标签
    timeStep: number //时间戳
}

/** Click the log message body */
export interface ClickInfo {
    logType: string,
    eleType?: string, //元素类型
    eleContent?: string, //元素内容
    timeStep: number, //时间戳
    href?: string, //当前路由
    eleLocation?: string //元素位置
}

/** IO Log Message Body */
export interface IoInfo {
    logType: string,
    timeStep: number, //时间戳
    name?: string, //资源名称
    entryType?: string, //类型
    startTime?: number, //开始时间
    duration?: number, //总计耗时
    initiatorType?: string, //启动器类型
    nextHopProtocol?: string, //下一跳协议
    renderBlockingStatus?: string, //渲染阻止状态
    workerStart?: number, //工作开始时间
    redirectStart?: number, //重定向开始时间
    redirectEnd?: number, //重定向结束时间
    fetchStart?: number, //请求开始时间
    domainLookupStart?: number, //域查找开始时间
    domainLookupEnd?: number, //域查找结束时间
    connectStart?: number, //链接开始时间
    connectEnd?: number, //链接结束时间
    secureConnectionStart?: number,
    requestStart?: number,
    responseStart?: number,
    responseEnd?: number,
    transferSize?: number,
    encodedBodySize?: number,
    decodedBodySize?: number,
    serverTiming?: any[],
    unloadEventStart?: number,
    unloadEventEnd?: number,
    domInteractive?: number,
    domContentLoadedEventStart?: number,
    domContentLoadedEventEnd?: number,
    domComplete?: number,
    loadEventStart?: number,
    loadEventEnd?: number,
    type?: string,
    redirectCount?: number,
    activationStart?: number,
}

declare global {
    interface Window {
        log: any;
        msPerformance: any;
        webkitPerformance: any;
        returnCitySN: any
    }
}