using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Microsoft.AspNet.SignalR;

namespace SpeechTimer.Hubs
{
    public class TimerHub : Hub
    {
        public void SendSetCountdownTime(int hours, int minutes, int seconds)
        {
            Clients.Others.setCountdownTime(hours, minutes, seconds);
        }

        public void SendTimeRemaining(int hours, int minutes, int seconds)
        {
            Clients.Others.setTimeRemaining(hours, minutes, seconds);
        }

        public void PauseTimer()
        {
            Clients.Others.pauseTimer();
        }

        public void ResumeTimer()
        {
            Clients.Others.resumeTimer();
        }

    }
}