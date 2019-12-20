using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Neo.Common
{
    public class MethodMetadata
    {
        public Delegate Invoker { get; set; }

        public void Invoke()
        {
        }
    }
}
