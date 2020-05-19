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

const Stores = {
    nodeStore,
    walletStore,
    blockSyncStore,
    pathStore
};

export { blockSyncStore, walletStore ,nodeStore,pathStore}
export default Stores;