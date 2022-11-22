import { VERSION } from './config';
import capture from "./lib/capture";
import storage from './lib/storage';
import queue from "./lib/queue";
import {deep_copy, parameter_correction, create_uid} from "./utils";

window.log = (function () {

    //Priority start
    capture.start_all();

    //initialization
    const log_init = (params: any) => {
        if (storage.config_info.pattern === 'config') {
            return console.error("【log.js】log has been initialized and cannot be reconfigured.");
        }
        let tempParams: object = parameter_correction(params);
        storage.save("config_info", tempParams);
        queue.loop();
    }

    //Re adjust initialization parameters
    const log_set_options = (params: any) => {
        if (!params) {
            return console.error("【log.js】Please set options.");
        }
        if (storage.config_info.pattern === 'default') {
            return console.error("【log.js】Please use first log.init()");
        }
        let finalParams = parameter_correction(params);
        storage.save("config_info", finalParams);
        queue.shutdown();
        capture.start_all();
        queue.loop();
    }

    //Get terminal information
    const get_terminal_info = () => deep_copy(storage.terminal_info);

    //Get performance information
    const get_performance_info = () => deep_copy(storage.performance_info);

    //Get uid
    const get_uid = () => create_uid();

    return {
        init: log_init,
        setOptions: log_set_options,
        getTerminalInfo: get_terminal_info,
        getPerformanceInfo: get_performance_info,
        getUid: get_uid,
        log: capture.diy_log,
        version: VERSION
    };
})();
