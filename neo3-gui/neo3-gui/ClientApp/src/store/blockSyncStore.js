/* eslint-disable */
import { observable,action } from "mobx";


class BlockSyncStore {
    @observable syncHeight = 0;
    @observable headerHeight=0;

    @action setHeight(data){
        this.syncHeight=data.syncHeight;
        this.headerHeight=data.headerHeight;
    }
}

export default BlockSyncStore;