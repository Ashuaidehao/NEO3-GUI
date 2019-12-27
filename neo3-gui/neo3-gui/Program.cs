using System;
using System.IO;
using System.Net;
using Microsoft.AspNetCore;
using Microsoft.AspNetCore.Hosting;
using Neo.Common;

namespace Neo
{
    class Program
    {
        public static GuiService Service=new GuiService();

        static void Main(string[] args)
        {
            AppDomain.CurrentDomain.ProcessExit += new EventHandler(CurrentDomain_ProcessExit);

            CreateWebHostBuilder(args).Build().Start();

            Service.Run(args);
            Service.Stop();

        }

        public static IWebHostBuilder CreateWebHostBuilder(string[] args)
        {
            return WebHost.CreateDefaultBuilder(args)
                .UseKestrel(k=>k.Listen(IPAddress.Parse("127.0.0.1"),8081))
                .UseStartup<Startup>();
        }


        public static void CurrentDomain_ProcessExit(object sender, EventArgs e)
        {
            CommandLineTool.Close();
        }
    }
}
