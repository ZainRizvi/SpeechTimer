
$.getScript("/Scripts/Timer/Helper.js");

$(document).ready(function () {

    var count = 0;
    var hours = 0;
    var minutes = 2;
    var seconds = 5;
    var timerPaused = false;

    setSessionCode();
    
    // Reference the auto-generated proxy for the hub.  
    var chat = $.connection.timerHub;

    // Create a function that the hub can call back to set the countdown time.
    chat.client.setCountdownTime = function (hoursIn, minutesIn, secondsIn) {
        hours = hoursIn;
        minutes = minutesIn;
        seconds = secondsIn;
        timerPaused = false;
    };

    chat.client.pauseTimer = function () {
        timerPaused = true;
    }

    chat.client.resumeTimer = function () {
        timerPaused = false;
    }

    // Start the connection.
    $.connection.hub.start().done(function () {

        // Register the session code with the server
        chat.server.viewerJoinSession($("#sessionCode").text());

        // Start the countdown timer
        var timer = $.timer(function () {

            if (timerPaused) { return; }
            seconds = seconds - 1;
            if (seconds < 0) {
                seconds = 59;
                minutes = minutes - 1;
            }
            if (minutes < 0) {
                minutes = 59;
                hours = hours - 1;
            }
            if (hours < 0) {
                hours = 0;
                minutes = 0;
                seconds = 0;
                timerPaused = true;
            }

            $('#counter').html(toTimeSpan(hours, minutes, seconds));

            // Send time remaining to the controllers
            chat.server.sendTimeRemaining(hours, minutes, seconds, getSessionCode());
        });
        timer.set({ time: 1000, autostart: true });

    });

    //$(".dial").knob();
});

function setSessionCode() {
    $("#sessionCode").text(randString(6));
}

function getSessionCode() {
    return $("#sessionCode").text();
}

function randString(n) {
    if (!n) {
        n = 5;
    }

    var text = '';
    var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';

    for (var i = 0; i < n; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }

    return text;
}