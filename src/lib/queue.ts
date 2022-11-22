import storage from "./storage";
import request from "./request";
import {deep_copy, create_uid} from "../utils";
import {ClickInfo, DiyInfo, ErrorInfo, IoInfo} from "../interface";

/** queue */

let t: any;
let t1: any;

const queue_shutdown = () => {
    clearInterval(t);
    clearInterval(t1);
    t = null;
    t1 = null;
}

const find_type = (type: string) => {
    let logType = storage.config_info.logType || [];
    return logType.join().indexOf(type) !== -1;
}

const queue_loop = () => {

    //Stop starting if the acquisition degree is 0
    if(storage.config_info.degree === 0) return console.warn('[logjs] When the acquisition degree is zero, the probe will stop working. ');

    //Message sender
    t = setInterval(function () {
        request.fetch();
    }, 1000);

    //Message collector
    t1 = setInterval(function () {

        //Sampling rate filtering
        if(!degree_control()) return false;

        let errorSize = storage.error_list.length;
        let clickSize = storage.click_list.length;
        let ioSize = storage.io_list.length;
        let diySize = storage.diy_list.length;

        let param: { error_list: ErrorInfo[], click_list: ClickInfo[], io_list: IoInfo[], diy_list: DiyInfo[]} = {
            error_list: [],
            click_list: [],
            io_list: [],
            diy_list: []
        };

        if (find_type("error") && errorSize) param.error_list = deep_copy(storage.error_list);
        if (find_type("click") && clickSize) param.click_list = deep_copy(storage.click_list);
        if (find_type("io") && ioSize) param.io_list = deep_copy(storage.io_list);
        if (find_type("diy") && diySize) param.diy_list = deep_copy(storage.diy_list);

        ((find_type("error") && errorSize) || (find_type("click") && clickSize) || (find_type("io") && ioSize) || (find_type("diy") && diySize)) && queue.push(param);
    }, 800);
}

const queue_push = (info: any) => {

    info.terminal_info = storage.terminal_info;
    info.performance_info = storage.performance_info;
    info.uid = create_uid();
    storage.config_info.id && (info.id = storage.config_info.id);

    storage.click_list = [];
    storage.error_list = [];
    storage.io_list = [];
    storage.diy_list = [];

    queue.queue.push(info);
}

//Sample rate determiner
const degree_control = () => {
    let tempDegree = storage.config_info.degree * 100;
    let random = ~~(Math.random() * 100);
    return random < tempDegree;
}

let queue: { loop: () => void; queue: any[]; push: (info: any) => void; shutdown: () => void } = {
    queue: [], //Pending queue
    push: queue_push, //Queue Push
    shutdown: queue_shutdown, //Stop Queue Execution
    loop: queue_loop, //Queue executor
};

export default queue;