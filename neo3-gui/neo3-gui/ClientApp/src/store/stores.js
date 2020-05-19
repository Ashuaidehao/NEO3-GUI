/* eslint-disable */
import BlockSyncStore from "./blockSyncStore";
import WalletStore from "./walletStore";
import NodeStore from "./nodeStore";
import PathStore from "./pathStore";
import TransStore from "./transStore";

let blockSyncStore = new BlockSyncStore();
let walletStore = new WalletStore();
let nodeStore=new NodeStore();
let pathStore = new PathStore();
let transStore = new TransStore();

const Stores = {
    nodeStore,
    walletStore,
    blockSyncStore,
    pathStore,
    transStore
};

export { blockSyncStore, walletStore ,nodeStore,pathStore,transStore}
export default Stores;