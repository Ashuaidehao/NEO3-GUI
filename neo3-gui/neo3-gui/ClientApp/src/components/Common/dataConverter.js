/* eslint-disable */
import bs58check from "bs58check";
import { NEO3_ADDRESS_VERSION } from "../../constants";


class DataConverter {

    /**
     * convert scriptHash to address
     *  @param {string} scriptHashHex 
     */
    toAddress(scriptHashHex) {
        let littleEndian = scriptHashHex;
        if (scriptHashHex.startsWith("0x")) {
            littleEndian = this.reverseHexString(scriptHashHex.slice(2));
        }
        const bytes = Buffer.from(NEO3_ADDRESS_VERSION + littleEndian, 'hex');
        if (bytes.length != 21) {
            return null;
        }
        const address = bs58check.encode(bytes);
        return address;
    }

    /**
     * convert address to scriptHash
     * @param {string} address 
     */
    toScriptHash(address){
        var bytes= bs58check.decode(address);
        return "0x"+ Buffer.from(bytes).toString("hex").slice(2);
    }


    /**
     * direct reverse hexstring,input:'f9df308b7bb380469354062f6b73f9cb0124317b',output:'7b312401cbf9736b2f0654934680b37b8b30dff9'
     * @param {string} hexString 
     */
    reverseHexString(hexString) {
        if (hexString.length & 1) {
            throw new RangeError();
        }
        return hexString.match(/../g).reverse().join("");
    }
}

export default DataConverter;