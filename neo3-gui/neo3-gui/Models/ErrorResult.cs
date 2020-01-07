using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Neo.Models
{
    public class ErrorResult
    {
        public ErrorResult(string errorMessage)
        {
            Message = errorMessage;
        }
        public string Message { get; set; }
    }
}
