import BlockSyncStore from "./blockSyncStore";
import WalletStore from "./walletStore";

let blockSyncStore = new BlockSyncStore();
let walletStore = new WalletStore();

const Stores = {
    walletStore,
    blockSyncStore
};

export { blockSyncStore, walletStore }
export default Stores;