/* eslint-disable */
import { observable, action } from "mobx";
import neoNode from "../neonode";


class NodeStore {

    constructor() {
        console.log("node store init");
        // if (window.nodeManager) {
        //     this.nodeManager = window.nodeManager
        // }
        this.nodeManager = neoNode;
    }

    @action start(network, port) {
        this.nodeManager.start(network, port);

    }


    @action kill(data) {
        this.nodeManager.kill();
    }
}

export default NodeStore;