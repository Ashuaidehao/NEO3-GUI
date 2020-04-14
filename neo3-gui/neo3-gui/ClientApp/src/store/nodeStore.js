/* eslint-disable */
import { observable, action } from "mobx";


class NodeStore {

    constructor() {
        console.log("node store init");
        if (window.nodeManager) {
            this.nodeManager = window.nodeManager
        }
    }

    @action start(network, port) {
        const env = { NEO_NETWORK: network || "", NEO_GUI_PORT: port || "" };
        if (!this.nodeManager.isRunning()) {
            this.nodeManager.start(env);
        }
    }


    @action kill(data) {
        this.nodeManager.kill();
    }
}

export default NodeStore;