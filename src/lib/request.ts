import storage from "./storage";
import queue from "./queue";

/** Request module */

const request_fetch = () => {
    let param: object = queue.queue.shift();
    let reportingBefore: (params: object) => any = storage.config_info.reportingBefore;
    if (!storage.config_info.sendAddress) {
        //If the sending address is not configured, stop the message push queue
        console.warn("[logjs] The reporting address has not been configured. ");
        queue.shutdown();
        return void 0;
    }
    if (!param) return void 0;

    if (reportingBefore && typeof reportingBefore === "function") {

        //If the hook returns false, the default reporting action is stopped, and the sendAddress is invalid
        if(reportingBefore(param) === false) return false;

        param = reportingBefore(param) || param;
    }

    fetch(storage.config_info.sendAddress, {
            headers: {
                "Content-Type": "application/json;charset=UTF-8"
            },
            method: "POST",
            body: JSON.stringify(param)
        }
    ).then(function (res) {
        //
    });
}

let request: { fetch: () => (any) } = {
    fetch: request_fetch
};

export default request;