import UAParser from "ua-parser-js";
import storage from './storage';
import {onFCP, onTTFB, onLCP, onFID} from 'web-vitals';
import {ErrorInfo, ClickInfo} from "../interface";
import { IGNORE_LIST } from '../config';

/** Capture module */

const capture_onerror = () => {
    window.onerror = function (message, source, lineno, colno, error) {
        let error_info: ErrorInfo = {
            timeStep: new Date().getTime(),
            type: message,
            source: source,
            lineno: lineno,
            colno: colno,
            error: error,
            href: window.location.href,
            logType: "error"
        };
        storage.save("error_list", error_info);
    };
}

const capture_terminal = () => {

    get_ip_souhu(1);
    get_ttfb();
    get_fcp();
    get_lcp();
    get_fid();

    let ua: string = navigator.userAgent || '';
    let parser: any = new UAParser(ua);
    let ua_info: any = parser.getResult();

    let terminal_info: { referrer: string; resolving_power: string; os: UAParser.IOS; engine: UAParser.IEngine; browser: UAParser.IBrowser; cpu: UAParser.ICPU; ua: string; device: UAParser.IDevice } = {
        resolving_power: screen.width + "*" + screen.height,
        referrer: get_referrer(),
        ...ua_info
    };
    storage.save("terminal_info", terminal_info);
}

const get_referrer = () => {
    let ref: string = '';
    if (document.referrer.length > 0) {
        ref = document.referrer;
    }else{
        ref = window.location.href;
    }
    return ref;
}

const get_ip_souhu = (number: number) => {
    let ipElement: any = document.createElement("script");
    ipElement.src = `${location.protocol}//pv.sohu.com/cityjson?ie=utf-8`;

    ipElement.onload = function (e: Event) {

        //Stop acquiring IP if it has already been acquired
        if(storage.terminal_info.ip) return void 0;

        let obj: object = {
            ip: window['returnCitySN']['cip'],
            city: window['returnCitySN']['cname']
        };
        storage.save("terminal_info", obj);
        document.head.removeChild(ipElement);
    };

    ipElement.onerror = function (e: Event){
        //If not, try again - three times
        if(number <= 5){
            document.head.removeChild(ipElement);
            get_ip_souhu(number += 1);
        }
    }

    document.head.appendChild(ipElement);
}

const capture_onclick = () => {
    let body: any = document.body;
    if (!body) return void 0;
    body.onclick = function (e: any) {
        let eleLocation: any[] = [];
        e?.path?.map( (item: any) => {
            if(!!item.localName){
                eleLocation.push(`${item.localName}${item.className ? '.' + item.className : ''}`);
            }
        });
        let click_info: ClickInfo = {
            logType: 'click',
            eleType: e.target?.localName,
            eleContent: e.target?.innerText,
            timeStep: new Date().getTime(),
            href: window.location.href,
            eleLocation: eleLocation.join('<=')
        };
        storage.save("click_list", click_info);
    };
}

const diy_log = (obj: any, tag: number | string) => {

    let diy_info: { logType: string; timeStep: number; obj: any; tag: number | string } = {
        logType: "diy",
        obj: obj,
        tag: tag,
        timeStep: new Date().getTime()
    };

    storage.save("diy_list", diy_info);
}

//Get the overall resource information to promote the IOlist, and calculate the performance information of the current terminal (if there is no performance object, stop calculating the page performance and obtain IO information)
const get_performance = () => {
    if(!(window.performance || window.msPerformance || window.webkitPerformance)) return console.warn('[log.js] Failed to get page performance information successfully.');

    if(!performance.timing) return console.warn('[log.js] Failed to get performance information successfully.');

    let timing: any = performance.timing;
    let tempPerformance: { fp: number, redirect_time: number, domain_lookup_time: number, connect_time: number, response_time: number, dom_complete_time: number } = {
        fp: 0,//White screen time - in milliseconds
        redirect_time: 0,//Redirect time - in milliseconds
        domain_lookup_time: 0,//DNS query time - in milliseconds
        connect_time: 0,//TCP link time - in milliseconds
        response_time: 0,//HTTP request time - in milliseconds
        dom_complete_time: 0,//DOM parsing time consuming-In milliseconds
    };

    tempPerformance.fp = timing.responseStart - timing.navigationStart;
    tempPerformance.redirect_time = timing.redirectEnd - timing.redirectStart;
    tempPerformance.domain_lookup_time = timing.domainLookupEnd - timing.domainLookupStart;
    tempPerformance.response_time = timing.responseEnd - timing.responseStart;
    tempPerformance.dom_complete_time = timing.domComplete - timing.domInteractive;
    tempPerformance.connect_time = timing.connectEnd - timing.connectStart;

    storage.save('performance_info', tempPerformance);
}

const get_ttfb = () => {
    onTTFB((metric) => {
        storage.save('performance_info', { ttfb: metric.value ?? 'Failed to get' });
    })
}

const get_fcp = () => {
    onFCP((metric => {
        storage.save('performance_info', { fcp: metric.value ?? 'Failed to get' });
    }))
}

const get_lcp = () => {
    onLCP((metric => {
        storage.save('performance_info', { lcp: metric.value ?? 'Failed to get' });
    }))
}

const get_fid = () => {
    onFID((metric => {
        storage.save('performance_info', { fid: metric.value ?? 'Failed to get' });
    }))
}

const capture_onload = () => {

    window.onload = function (){
        get_performance();
        capture_onclick();
    }

}

const capture_start_all = () => {
    for (let key in capture) {
        if (key === "start_all" || key === 'diy_log' || key === 'get_performance') {
            continue;
        }
        capture[key]();
    }
}

const create_io_monitor = () => {
    const observer = new PerformanceObserver( list => {

        let ioFilter: any = storage.config_info.ioFilter;
        let resourcesList: any = list.getEntries();
        resourcesList = resourcesList.filter( (item: any) => {

            let flag = true;
            if(IGNORE_LIST.map( it => it === item.name)) flag = false;

            return ioFilter(item) && (item.name.indexOf(storage.config_info.sendAddress) === -1) && flag;
        });

        let tempList: any[] = [];
        resourcesList.map( (item: any) => {
            let tempItem: any = item.toJSON();
            tempItem.logType = 'io';
            tempItem.timeStep = new Date().getTime();
            tempList.push(tempItem);
        })

        tempList.map( item => {
            storage.save('io_list', item);
        })

    })
    observer.observe({entryTypes:['longtask', 'frame', 'navigation', 'resource', 'mark', 'measure']});
}


let capture: { [key: string]: any; get_performance_resource: () => (void); window_onload: () => void; diy_log: (obj: any, tag: number | string) => void; terminal_info: () => void; click_info: () => any; execution_error: () => void; create_io_monitor: () => void; start_all: () => void } = {
    execution_error: capture_onerror, //Execution error
    terminal_info: capture_terminal, //Terminal information acquisition
    click_info: capture_onclick, //Click to get information
    window_onload: capture_onload,//Page loading completed
    diy_log: diy_log,//Custom Log
    get_performance_resource: get_performance,//Get resource loading status
    create_io_monitor: create_io_monitor,//Create io information monitoring
    start_all: capture_start_all, //Start all monitoring
};


export default capture;
