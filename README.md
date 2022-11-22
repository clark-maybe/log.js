> TS 重构目前已经完成，正在最后测试中...
>
> 经历了13个月的时间，log.js V2 版本终于制作完成了，期间伴随着一个完整 C端系统的成长，在与实际业务的碰撞中，进行了数次小版本的迭代，全新重构后的 log.js 新增了许多特性，也同时移除了一些冗余功能，下面让我重新来介绍下新版本的 log.js.  issue 我会第一时间回复，欢迎大家 star  [开源地址](https://gitee.com/clark-fl/log.js)
>

### 首先，log.js 是什么

log.js 是一个前端监控插件，他可以提供

1. JS执行异常捕获
2. 性能指标监测及捕获
3. 异常IO，自定义IO 筛选捕获
4. 终端信息捕获，IP，城市，分辨率，UA解析等
5. 点击动作捕获

等...   监控内容还在持续补充中

### 为什么是 log.js

作为一个web前端开发者，深知web信息的采集受到终端影响而天然采集困难，异常场景往往无法完整复现，或者未知的异常影响用户留存，现阶段市面上的web探针大多集成在自身应用体系内，存在 配置重量级，难以解耦 等问题。

log.js 开箱即用的方式极大缩减了信息采集的难度，渐进式的设计也可以满足大部分自定义场景

### log.js 受到框架限制吗

不会，log.js 基于hack劫持方式采集底层数据，与框架无关，不论是 React，Vue，Jquery，都能hold住.

### log.js 会影响应用吗

不会，log.js 不会操作视图，同时采集数据后的上报也以队列形式等待业务io低峰期才会进行.

### log.js 可以采集小程序日志吗

目前不行，log.js 基于 W3C 标准实现的 DOM，目前还没有针对小程序的兼容规划.

### 我应该如何使用 log.js

开箱即用，log.js 为 IIFE 方式注册，无需生成实例，调用 `log.init(…params)` 您仅需要配置发送地址即可启动 **log.js**

```jsx
<head>
    <meta charset="UTF-8">
    <title>示例</title>
    <script src="https://logjs.site/version/2.0.0beta/log.min.js"></script>
</head>

<body>
		<script>
			log.init({ sendAddress: 'https://www.xxx.com/xxx' });
		</script>
</body>
```

### 深入配置 log.js

```jsx
log.init({
    logType: ["error", "diy", 'click', 'io'],//日志类型 - [ 'error', 'click', 'diy', 'io' ]
    degree: 1,//采集率 - (0 - 1)
    id: 'logJs',//logjs实例标识,
    ioFilter: item => true,//I/O筛选器（fun，用以定义 io_list 获取规则）
    sendAddress: '',//日志发送地址（默认 POST application/json 接收服务需自行配置跨域）
    reportingBefore: params => params,//日志上报前钩子（用以重构参数结构，追加自定义参数）
})
```

### log.js 对外暴露的方法

```jsx
log.init(…params) //启动log.js   注意：在未调用此方法前，log.js 实际上已经开始工作了，不过信息均存放在内存中，外部无法访问
```

```jsx
log.setOptions(…params) //更新配置
```

```jsx
log.log(...) //打印远程日志 与console.log 使用方式一致，消息将作为自定义消息推送
```

```jsx
log.getTerminalInfo() //获取终端信息  注意：需要在 log.js init 后使用
```

```jsx
log.getPerformanceInfo() //获取性能信息  注意：需要在 log.js init 后使用
```

```jsx
log.version //获取当前 log.js 版本
```

### 消息体解释

```jsx
{
	"io_list": [{ //io消息继承自 PerformanceEntry [文档地址](https://developer.mozilla.org/zh-CN/docs/Web/API/PerformanceEntry)
		"name": "http://localhost:63342/log.js/website/index.html?_ijt=26dmaaemranugo6rciidd5nar5",
		"entryType": "navigation",
		"startTime": 0,
		"duration": 191.5,
		"initiatorType": "navigation",
		"nextHopProtocol": "http/1.1",
		"renderBlockingStatus": "blocking",
		"workerStart": 0,
		"redirectStart": 0,
		"redirectEnd": 0,
		"fetchStart": 4,
		"domainLookupStart": 4,
		"domainLookupEnd": 4,
		"connectStart": 4,
		"connectEnd": 4,
		"secureConnectionStart": 0,
		"requestStart": 9.199999928474426,
		"responseStart": 10.899999976158142,
		"responseEnd": 13.299999952316284,
		"transferSize": 3064,
		"encodedBodySize": 2764,
		"decodedBodySize": 2764,
		"serverTiming": [],
		"unloadEventStart": 17.5,
		"unloadEventEnd": 17.5,
		"domInteractive": 110.10000002384186,
		"domContentLoadedEventStart": 110.10000002384186,
		"domContentLoadedEventEnd": 110.29999995231628,
		"domComplete": 190.79999995231628,
		"loadEventStart": 190.79999995231628,
		"loadEventEnd": 191.5,
		"type": "reload",
		"redirectCount": 0,
		"activationStart": 0,
		"logType": "io",
		"timeStep": 1667894728849
	}],
	"terminal_info": {
		"resolving_power": "1440*900", //宽高比
		"referrer": "http://localhost:63342/log.js/website/index.html?_ijt=26dmaaemranugo6rciidd5nar5", //referrer
		"ua": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/107.0.0.0 Safari/537.36", //ua
		"browser": { //浏览器信息
			"name": "Chrome",
			"version": "107.0.0.0",
			"major": "107"
		},
		"engine": { //引擎信息
			"name": "Blink",
			"version": "107.0.0.0"
		},
		"os": { //系统信息
			"name": "Mac OS",
			"version": "10.15.7"
		},
		"device": {},
		"cpu": {},
		"ip": "xx.xx.x.xx",
		"city": "湖北省武汉市"
	},
	"performance_info": {
		"fcp": 115.39999997615814, //首次内容绘制 (FCP)
		"fp": 11, //白屏时间（FP）
		"redirect_time": 0, //重定向耗时
		"domain_lookup_time": 0, //DNS查询耗时
		"connect_time": 0, //TCP链接耗时
		"response_time": 2, //HTTP请求耗时
		"dom_complete_time": 81, //DOM解析耗时
		"ttfb": 10.899999976158142 //第一字节时间 (TTFB)
	},
	"uid": "a165595ca1d7f19c6eef5a31f586767b",//user标识，由ip与ua生成，用以追溯行为轨迹
	"id": "logJs" //配置信息中的id标识将携带在每条报文中
}
... 其他消息体消息待补充
```