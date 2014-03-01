

var hoursLeft;
var minutesLeft;
var secondsLeft;

var timerPaused = false;

$(document).ready(function () {
    initializeCountdown();
});

function initializeCountdown() {

    // Enable the knobs
    $(".dial").knob();

    var hoursStart = 0;
    var minutesStart = 2;
    var secondsStart = 15;

    hoursLeft = hoursStart;
    minutesLeft = minutesStart;
    secondsLeft = secondsStart;

    setSessionCode(getNewSessionCode());

    // Reference the auto-generated proxy for the hub.  
    var timerHub = $.connection.timerHub;

    setCountdownCallbacks(timerHub);

    // Start the connection.
    $.connection.hub.start().done(function () {

        // Register the session code with the server
        timerHub.server.viewerJoinSession($("#sessionCode").text());

        startCountdownTimer();
    });

    turnOnMinimalistMode();
    resizeCountdownRectangle();
}

function startCountdownTimer() {
    // Start the countdown timer
    var timer = $.timer(function () {

        if (timerPaused) { return; }
        secondsLeft = secondsLeft - 1;
        if (secondsLeft < 0) {
            secondsLeft = 59;
            minutesLeft = minutesLeft - 1;
        }
        if (minutesLeft < 0) {
            minutesLeft = 59;
            hoursLeft = hoursLeft - 1;
        }
        if (hoursLeft < 0) {
            hoursLeft = 0;
            minutesLeft = 0;
            secondsLeft = 0;
            timerPaused = true;
        }

        $('#counter').html(toTimeSpan(hoursLeft, minutesLeft, secondsLeft));
        displayTimeLeft(hoursLeft, minutesLeft, secondsLeft);

        // Send time remaining to the controllers
        timerHub.server.sendTimeRemaining(hoursLeft, minutesLeft, secondsLeft, getSessionCode());

    });
    timer.set({ time: 1000, autostart: true });
}

// Create functions that the hub can call back to set the countdown time.
function setCountdownCallbacks(timerHub) {
    timerHub.client.setCountdownTime = function (hoursIn, minutesIn, secondsIn) {
        hoursLeft = hoursStart = hoursIn;
        minutesLeft = minutesStart = minutesIn;
        secondsLeft = secondsStart = secondsIn;
        timerPaused = false;
    };

    timerHub.client.pauseTimer = function () {
        timerPaused = true;
    }

    timerHub.client.resumeTimer = function () {
        timerPaused = false;
    }
}

function displayTimeLeft(hoursLeft, minutesLeft, secondsLeft) {
    //$("#hoursLeft").val(hoursLeft).trigger('change');
    //$("#minutesLeft").val(minutesLeft).trigger('change');
    //$("#secondsLeft").val(secondsLeft).trigger('change');


    //$('#rectangle').width($("#rectangle").parent().outerWidth() * getSecondsInTime(hoursLeft, minutesLeft, secondsLeft) / getSecondsInTime(hoursStart, minutesStart, secondsStart));
    resizeCountdownRectangle();
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

    //var hoursLeft = $("#hoursLeft").val();
    //var minutesLeft = $("#minutesLeft").val();
    //var secondsLeft = $("#secondsLeft").val();

    $('#rectangle').width($("#rectangle").parent().outerWidth() * getSecondsInTime(hoursLeft, minutesLeft, secondsLeft) / getSecondsInTime(hoursStart, minutesStart, secondsStart));
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