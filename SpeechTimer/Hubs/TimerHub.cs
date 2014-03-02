using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Microsoft.AspNet.SignalR;

namespace SpeechTimer.Hubs
{
    public class TimerHub : Hub
    {
        enum Type 
        {
            Controller,
            Viewer,
            SingleView
        }

        const int sessionCodeLenght = 4;
        const string validSessionCharacters = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890";

        private List<string> GetViewerGroups(string sessionCode)
        {
            List<string> viewers = new List<string>() {
                GetGroupName(sessionCode, Type.Viewer),
                GetGroupName(sessionCode, Type.SingleView)
            };

            return viewers;
        }

        private List<string> GetControllerGroups(string sessionCode)
        {
            List<string> viewers = new List<string>() {
                GetGroupName(sessionCode, Type.Controller),
                GetGroupName(sessionCode, Type.SingleView)
            };

            return viewers;
        }

        #region Public Methods

        public void SendSetCountdownTime(int hours, int minutes, int seconds, string sessionCode)
        {
            Clients.Groups(GetViewerGroups(sessionCode))
                .setCountdownTime(hours, minutes, seconds);
        }

        public void SendTimeRemaining(int hours, int minutes, int seconds, string sessionCode)
        {
            List<string> receipients = GetControllerGroups(sessionCode);

            Clients.Groups(receipients)
                .setTimeRemaining(hours, minutes, seconds);
        }

        public void PauseTimer(string sessionCode)
        {
            Clients.Groups(GetViewerGroups(sessionCode)).pauseTimer();
        }

        public void ResumeTimer(string sessionCode)
        {
            Clients.Groups(GetViewerGroups(sessionCode)).resumeTimer();
        }

        public void ViewerJoinSession(string sessionCode)
        {
            JoinSessionWithType(sessionCode, Type.Viewer);
        }

        public void ControllerJoinSession(string sessionToJoin, string sessionToLeave)
        {
            if (!JoinSessionWithType(sessionToJoin, Type.Controller))
            {
                Clients.Caller.sessionCodeSetFailed();
            }
            try
            {
                Groups.Remove(Context.ConnectionId, GetGroupName(sessionToLeave, Type.Controller));
            }
            catch { }
        }

        public void JoinSession(string sessionToJoin, string sessionToLeave)
        {
            if (!JoinSessionWithType(sessionToJoin, Type.SingleView))
            {
                Clients.Caller.sessionCodeSetFailed();
            }
            try
            {
                Groups.Remove(Context.ConnectionId, GetGroupName(sessionToLeave, Type.SingleView));
            }
            catch { }
        }

        #endregion

        #region Helper Methods

        private bool JoinSessionWithType(string sessionCode, Type type)
        {
            if (!IsValidSessionCode(sessionCode)) return false;

            Groups.Add(Context.ConnectionId, GetGroupName(sessionCode, type));
            return true;
        }

        private string GetGroupName(string sessionCode, Type type)
        {
            if (!IsValidSessionCode(sessionCode)) throw new Exception("Invalid session code");

            string name = string.Format("{0}-{1}", type, sessionCode);

            return name;
        }

        private bool IsValidSessionCode(string sessionCode)
        {
            // Drop invalid request
            if (string.IsNullOrEmpty(sessionCode)) return false;
            //if (sessionCode.Length != sessionCodeLenght) return false;
            if (!sessionCode.All(c => validSessionCharacters.Contains(c))) return false;

            return true;
        }

        #endregion
    }
}