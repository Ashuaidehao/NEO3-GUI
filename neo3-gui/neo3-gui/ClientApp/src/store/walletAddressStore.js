import { observable, action } from "mobx";

class WalletAddressStore {
    @observable accountlist = [];

    @action setAccounts(data) {
        for (let index = 0; index < data.length; index++) {
            const element = data[index];
            this.accountlist.push(element);
        }

        // this.accountlist.replace(data);
        console.log("address update!!!!"+JSON.stringify(data));
    }

}

export default WalletAddressStore;