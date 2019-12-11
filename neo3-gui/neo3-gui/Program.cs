using System;
using System.Net;
using Microsoft.AspNetCore;
using Microsoft.AspNetCore.Hosting;

namespace Neo
{
    class Program
    {
        static void Main(string[] args)
        {

            AppDomain.CurrentDomain.ProcessExit += new EventHandler(CurrentDomain_ProcessExit);
            CreateWebHostBuilder(args).Build().Start();

            while (true)
            {
                Console.ReadLine();
            }
        }

        public static IWebHostBuilder CreateWebHostBuilder(string[] args)
        {
            return WebHost.CreateDefaultBuilder(args)
                .UseUrls(@"http://localhost:8081/")
                .UseStartup<Startup>();
        }


        public static void CurrentDomain_ProcessExit(object sender,EventArgs e)
        {
            CommandLineTool.Close();
        }
    }
}
