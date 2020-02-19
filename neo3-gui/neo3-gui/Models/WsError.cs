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
        [Description("wallet should be open first!")]
        WalletNotOpen = -1000,
        [Description("method not found!")]
        MethodNotFound = -1001,
        [Description("parameter cannot be empty!")]
        ParameterIsNull = -1002,
        [Description("invalid private key!")]
        InvalidPrivateKey = -1003,
        [Description("invalid transaction id!")]
        InvalidTxId = -1004,
    }
}