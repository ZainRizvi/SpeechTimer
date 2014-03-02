var hoursStart = 0;
var minutesStart = 2;
var secondsStart = 15;

var hoursLeft;
var minutesLeft;
var secondsLeft;

var timerPaused = false;

$(document).ready(function () {

    // Enable the knobs
    $(".dial").knob();
    resizeKnob();

    hoursLeft = hoursStart;
    minutesLeft = minutesStart;
    secondsLeft = secondsStart;

    setSessionCode(getNewSessionCode());

    // Reference the auto-generated proxy for the hub.  
    var timerHub = $.connection.timerHub;

    setCountdownCallbacks(timerHub);
    setControlsCallbacks(timerHub);

    // Start the connection.
    $.connection.hub.start().done(function () {

        // Register the session code with the server
        timerHub.server.viewerJoinSession($("#sessionCode").text());

        startCountdownTimer();

        setupControlButtons();
    });

    turnOnMinimalistMode();
    resizeCountdownRectangle();
});

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
        //$.connection.timerHub.server.sendTimeRemaining(hoursLeft, minutesLeft, secondsLeft, getSessionCode());

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


function setupControlButtons() {
    var hub = $.connection.timerHub;

    $('#submitTime').click(function () {
        // Call the SendSetCountdownTime method on the hub. 
        hub.server.sendSetCountdownTime(
            $("#inHours").val(),
            $("#inMinutes").val(),
            $("#inSeconds").val(),
            getSessionCode());
    });

    $('#pause').click(function () {
        hub.server.pauseTimer(getSessionCode());
    });

    $('#resume').click(function () {
        hub.server.resumeTimer(getSessionCode());
    });

    $('#setSessionCode').click(function () {
        var newSessionCode = $("#setSessionCode").val()
        //var newSessionCode = $("#sessionCode").text();
        var currentSessionCode = getSessionCode();
        hub.server.controllerJoinSession(newSessionCode, currentSessionCode);
        setSessionCode(newSessionCode);
    });
}

function setControlsCallbacks(hub) {
    hub.client.setTimeRemaining = function (hours, minutes, seconds) {
        $('#counter').html(toTimeSpan(hours, minutes, seconds));
    };

    hub.client.sessionCodeSetFailed = function () {
        alert("Yikes! That session code wasn't quite right");
    }
}

$(window).resize(resizeKnob);

function resizeKnob() {
    var knobSideLenght = Math.min($("#controls-container").innerWidth() / 3.5, 200);

    $('.dial').trigger(
        'configure',
        {
            "width": knobSideLenght,
            "height": knobSideLenght
        }
    );
}