/* eslint-disable */
import { observable, action } from "mobx";

class transStore {
    
    @observable isOpen = false;
    @observable res = [];

    @action getAsset(network, port) {
        this.nodeManager.start(network, port);
    }

    @action sendtoMulti(method,data) {
        this.res = sendTo(method,data);
    }
}

function sendTo(method,data){

}

export default transStore;