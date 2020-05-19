/* eslint-disable */
import { observable, action } from "mobx";
import neoNode from "../neonode";

class transStore {
    constructor() {
        console.log("node store init");
        this.nodeManager = neoNode;
    }

    @action start(network, port) {
        this.nodeManager.start(network, port);
    }

    @action kill(data) {
        this.nodeManager.kill();
    }
}

export default transStore;