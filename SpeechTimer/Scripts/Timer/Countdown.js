
var hoursStart = 0;
var minutesStart = 2;
var secondsStart = 15;

var hours;
var minutes;
var seconds;

var timerPaused = false;

$(document).ready(function () {

    // Enable the knobs
    $(".dial").knob();

    var count = 0;

    hours = hoursStart;
    minutes = minutesStart;
    seconds = secondsStart;
    
    setSessionCode();
    
    // Reference the auto-generated proxy for the hub.  
    var chat = $.connection.timerHub;

    // Create a function that the hub can call back to set the countdown time.
    chat.client.setCountdownTime = function (hoursIn, minutesIn, secondsIn) {
        hours = hoursStart = hoursIn;
        minutes = minutesStart = minutesIn;
        seconds = secondsStart = secondsIn;
        timerPaused = true;

        $('#counter').html(toTimeSpan(hours, minutes, seconds));
        displayTimeLeft(hours, minutes, seconds);

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
            displayTimeLeft(hours, minutes, seconds);

            // Send time remaining to the controllers
            chat.server.sendTimeRemaining(hours, minutes, seconds, getSessionCode());

        });
        timer.set({ time: 1000, autostart: true });

    });

    turnOnMinimalistMode();
    resizeCountdownRectangle();
    //$("#toggleMinimalist").click(toggleMinimalistMode);

});

function displayTimeLeft(hours, minutes, seconds) {
    //$("#hours").val(hours).trigger('change');
    //$("#minutes").val(minutes).trigger('change');
    //$("#seconds").val(seconds).trigger('change');


    //$('#rectangle').width($("#rectangle").parent().outerWidth() * getSecondsInTime(hours, minutes, seconds) / getSecondsInTime(hoursStart, minutesStart, secondsStart));
    resizeCountdownRectangle();
}

function setSessionCode() {
    $("#sessionCode").text(randString(2));
}

function getSessionCode() {
    return $("#sessionCode").text();
}

function randString(n) {
    if (!n) {
        n = 5;
    }

    var text = '';
    var possible = 'ABCDEFGHJKLMNPQRSTUVWXYZ123456789';

    for (var i = 0; i < n; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }

    return text;
}


function resizeCountdownRectangle() {
    var newHeight = $(window).height() / 3;
    $("#rectangle").height(newHeight);

    //var hours = $("#hours").val();
    //var minutes = $("#minutes").val();
    //var seconds = $("#seconds").val();

    $('#rectangle').width($("#rectangle").parent().outerWidth() * getSecondsInTime(hours, minutes, seconds) / getSecondsInTime(hoursStart, minutesStart, secondsStart));
}
    
$(window).resize(function () {
    resizeCountdownRectangle();
});

var minimalistMode = false;
function toggleMinimalistMode() {
    if (minimalistMode) {
        $("#minimalCss").remove();
        //$("#toggleMinimalist").html("Minimalist Mode: Off");
    } else {
        turnOnMinimalistMode();
    }

    minimalistMode = !minimalistMode;
}

function turnOnMinimalistMode() {
    $('head').append('<link href="/Content/Minimal.css" rel="stylesheet" id="minimalCss" />');
    //$("#toggleMinimalist").html("Minimalist Mode: On");
}