import BlockSyncStore from "./blockSyncStore";
import WalletAddressStore from "./walletAddressStore";

let blockSyncStore = new BlockSyncStore();
let walletAddressStore=new WalletAddressStore();

const Stores = {
    blockSyncStore,
    walletAddressStore
};

export default Stores;