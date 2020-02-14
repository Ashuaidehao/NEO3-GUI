namespace Neo.Models
{
    public class WsError
    {
        public int Code { get; set; }
        public string Message { get; set; }
    }

    public enum ErrorCode
    {
        MethodNotFound = -999,
        WalletNotOpen =-1000,
    }
}