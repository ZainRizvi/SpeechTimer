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
            Viewer
        }

        const int sessionCodeLenght = 4;
        const string validSessionCharacters = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

        #region Public Methods

        public void SendSetCountdownTime(int hours, int minutes, int seconds, string sessionCode)
        {
            Clients.Group(GetGroupName(sessionCode, Type.Viewer))
                .setCountdownTime(hours, minutes, seconds);
        }

        public void SendTimeRemaining(int hours, int minutes, int seconds, string sessionCode)
        {
            Clients.Group(GetGroupName(sessionCode, Type.Controller))
                .setTimeRemaining(hours, minutes, seconds);
        }

        public void PauseTimer(string sessionCode)
        {
            Clients.Group(GetGroupName(sessionCode, Type.Viewer)).pauseTimer();
        }

        public void ResumeTimer(string sessionCode)
        {
            Clients.Group(GetGroupName(sessionCode, Type.Viewer)).resumeTimer();
        }

        public void ViewerJoinSession(string sessionCode)
        {
            JoinSession(sessionCode, Type.Viewer);
        }

        public void ControllerJoinSession(string sessionToJoin, string sessionToLeave)
        {
            if (!JoinSession(sessionToJoin, Type.Controller))
            {
                Clients.Caller.sessionCodeSetFailed();
            }
            Groups.Remove(Context.ConnectionId, GetGroupName(sessionToLeave, Type.Controller));
        }

        #endregion

        #region Helper Methods

        private bool JoinSession(string sessionCode, Type type)
        {
            if (!IsValidSessionCode(sessionCode)) return false;

            Groups.Add(Context.ConnectionId, GetGroupName(sessionCode, type));
            return true;
        }

        private string GetGroupName(string sessionCode, Type type)
        {
            if (!IsValidSessionCode(sessionCode)) throw new Exception("Invalid session code");

            const string viewerPrefix = "viewer-";
            const string controllerPrefix = "controler-";

            switch (type)
            {
                case (Type.Controller): return controllerPrefix + sessionCode.ToLowerInvariant();
                case (Type.Viewer): return viewerPrefix + sessionCode.ToLowerInvariant();
            }

            throw new Exception("Invalid type specified");
        }

        private bool IsValidSessionCode(string sessionCode)
        {
            // Drop invalid request
            if (string.IsNullOrEmpty(sessionCode)) return false;
            if (sessionCode.Length != sessionCodeLenght) return false;
            if (!sessionCode.All(c => validSessionCharacters.Contains(c))) return false;

            return true;
        }

        #endregion
    }
}