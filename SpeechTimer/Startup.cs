﻿using Owin;
using Microsoft.Owin;
[assembly: OwinStartup(typeof(SpeechTimer.Startup))]

namespace SpeechTimer
{
    public partial class Startup
    {
        public void Configuration(IAppBuilder app)
        {
            // Any connection or hub wire up and configuration should go here
            app.MapSignalR();
        }
    }
}