

$(document).ready(function () {


    var count = 0;
    var hours = 0;
    var minutes = 2;
    var seconds = 5;
    var timerPaused = false;

    //$("#submitTime").each(function () {
    //    this.onclick = function () {
    //        hours = $("#inHours").val();
    //        minutes = $("#inMinutes").val();
    //        seconds = $("#inSeconds").val();
    //    }
    //});
    
    // Reference the auto-generated proxy for the hub.  
    var chat = $.connection.timerHub;
    // Create a function that the hub can call back to set the countdown time.
    chat.client.setCountdownTime = function (hoursIn, minutesIn, secondsIn) {
        // Add the message to the page. 
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
                alert("Countdown reached!");
            }

            $('#counter').html(ToDoubleDigits(hours) + ":" + ToDoubleDigits(minutes) + ":" + ToDoubleDigits(seconds));

            // Send time remaining to the controllers
            chat.server.sendTimeRemaining(hours, minutes, seconds);
        });
        timer.set({ time: 1000, autostart: true });

    });


        //function () {
        //$('#submitTime').click(function () {
        //    // Call the Send method on the hub. 
        //    chat.server.sendSetCountdownTime($("#inHours").val(), $("#inMinutes").val(), $("#inSeconds").val());
        //});
    //});
});

function ToDoubleDigits(number) {
    if (number < 10) {
        return "0" + number;
    } else {
        return number;
    }
}