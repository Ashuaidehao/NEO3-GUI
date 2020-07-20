using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Neo.Common.Storage;
using Neo.Network.P2P.Payloads;
using Neo.Persistence;
using Neo.SmartContract;
using Neo.VM;
using Neo.VM.Types;

namespace Neo.Common
{
    public class ScriptAnalyzerEngine : ApplicationEngine
    {
        private Transaction _tx;
        public ScriptAnalyzerEngine(Transaction container, StoreView replaySnapshot) : base(TriggerType.Application, container, replaySnapshot, 0, true)
        {
            _tx = container;
            Console.WriteLine($"start analysis:[{_tx.Hash}]");
        }

        //protected override bool PreExecuteInstruction()
        //{
        //    //Console.WriteLine($"{CurrentContext.CurrentInstruction.OpCode}:[{CurrentContext.CurrentInstruction.Operand.ToArray().ToHexString()}]");
        //    return base.PreExecuteInstruction();
        //}

        public List<ContractEventInfo> ContractEvents = new List<ContractEventInfo>();
        protected override void OnSysCall(uint method)
        {
            if (Snapshot.Height == 0 || !ApplicationEngine.Services.TryGetValue(method, out var syscallMethod))
            {
                //Genesis block cannot be replay
                return;
            }
            if (syscallMethod != null)
            {
                //Console.WriteLine($"[SysCall]:{syscallMethod.Method}");
                if (syscallMethod == ApplicationEngine.System_Contract_Create)
                {
                    var script = CurrentContext.EvaluationStack.Peek()?.GetByteSafely();
                    if (script != null)
                    {
                        var contractHash = script.ToScriptHash();
                        Console.WriteLine($"Block[{Snapshot.Height}]-创建合约[{contractHash}]-[{_tx.Hash}]");
                        ContractEvents.Add(new ContractEventInfo()
                        {
                            Contract = contractHash,
                            Event = ContractEventType.Create,
                        });
                    }
                }

                if (syscallMethod == ApplicationEngine.System_Contract_Destroy)
                {
                    var destroyContract = CurrentScriptHash;
                    Console.WriteLine($"Block[{Snapshot.Height}]-销毁合约[{destroyContract}]-[{_tx.Hash}]");
                    ContractEvents.Add(new ContractEventInfo()
                    {
                        Contract = destroyContract,
                        Event = ContractEventType.Destroy,
                    });
                }

                if (syscallMethod == ApplicationEngine.System_Contract_Update)
                {
                    var oldContract = CurrentScriptHash;

                    var script = CurrentContext.EvaluationStack.Peek()?.GetByteSafely();
                    if (script != null)
                    {
                        var newContract = script.ToScriptHash();
                        Console.WriteLine($"Block[{Snapshot.Height}]-升级合约old[{oldContract}]-new[{newContract}]-[{_tx.Hash}]");
                        ContractEvents.Add(new ContractEventInfo()
                        {
                            Contract = oldContract,
                            Event = ContractEventType.Migrate,
                            MigrateToContract = newContract,
                        });
                    }
                }

                //if (syscallMethod == InteropService.Contract.Call)
                //{
                //    StackItem contractHash = CurrentContext.EvaluationStack.Peek();
                //    var methodItem = CurrentContext.EvaluationStack.Peek(1).GetString();

                //    var contract = new UInt160(contractHash.GetByteSafely());
                //    Console.WriteLine($"Block[{Snapshot.Height}]-Call合约[{contract}]-{methodItem}-[{_tx.Hash}]");
                //}

                if (syscallMethod == ApplicationEngine.System_Contract_CallEx)
                {
                    StackItem contractHash = CurrentContext.EvaluationStack.Peek();
                    var methodItem = CurrentContext.EvaluationStack.Peek(1).GetString();

                    var contract = new UInt160(contractHash.GetByteSafely());
                    Console.WriteLine($"Block[{Snapshot.Height}]-CallEx合约[{contract}]-{methodItem}-[{_tx.Hash}]");
                }
            }
            base.OnSysCall(method);
        }
    }
}
