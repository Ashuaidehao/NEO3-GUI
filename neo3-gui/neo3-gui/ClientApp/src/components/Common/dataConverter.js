import bs58check from "bs58check";
import { NEO3_ADDRESS_VERSION } from "../../constants";


class DataConverter {

    /**
     * convert scriptHash to address
     */
    toAddress(scriptHashHex) {
        let littleEndian = scriptHashHex;
        if (scriptHashHex.indexOf("0x") >= 0) {
            littleEndian = this.reverseHexString(scriptHashHex.replace("0x", ""));
        }
        const bytes = Buffer.from(NEO3_ADDRESS_VERSION + littleEndian, 'hex')
        if (bytes.length != 21) {
            return null;
        }
        const address = bs58check.encode(bytes)
        return address;
    }


    /**
     * direct reverse hexstring,input:'f9df308b7bb380469354062f6b73f9cb0124317b',output:'7b312401cbf9736b2f0654934680b37b8b30dff9'
     * @param {*} hexString 
     */
    reverseHexString(hexString) {
        if (hexString.length & 1) {
            throw new RangeError();
        }
        return hexString.match(/../g).reverse().join("");
    }

}


export default DataConverter;