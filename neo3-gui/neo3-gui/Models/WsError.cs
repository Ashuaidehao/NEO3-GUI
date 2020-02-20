using System.ComponentModel;

namespace Neo.Models
{
    public class WsError
    {
        public int Code { get; set; }
        public string Message { get; set; }
    }

    public enum ErrorCode
    {
        [Description("invalid parameter")]
        InvalidPara = 20000,
        [Description("Wallet file is not exist!")]
        WalletFileNotFound = 20001,
        [Description("Wrong password")]
        WrongPassword = 20002,
        [Description("failed to open the wallet")]
        FailToOpenWallet = 20003,
        [Description("wallet should be open first!")]
        WalletNotOpen = 20004,
        [Description("method not found!")]
        MethodNotFound = 20005,
        [Description("parameter cannot be empty!")]
        ParameterIsNull = 20006,
        [Description("invalid private key!")]
        InvalidPrivateKey = 20007,
        [Description("transaction is not exist!")]
        TxIdNotFound = 20008,
        [Description("address is not exist!")]
        AddressNotFound = 20009,
        [Description("address's private key is not exist here!")]
        AddressNotFoundPrivateKey = 20010,
    }
}