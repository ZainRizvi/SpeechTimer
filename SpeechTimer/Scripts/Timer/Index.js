
$(document).ready(function () {
    var count = 0;
    var hours = 0;
    var minutes = 2;
    var seconds = 5;
    var complete = false;
    var timer = $.timer(function () {

        if (complete) { return; }
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
            complete = true;
            alert("Countdown reached!");
        }

        $('#counter').html(ToDoubleDigits(hours) + ":" + ToDoubleDigits(minutes) + ":" + ToDoubleDigits(seconds));
    });
    timer.set({ time: 1000, autostart: true });

    $("#submitTime").each(function () {
        this.onclick = function () {
            hours = $("#inHours").val();
            minutes = $("#inMinutes").val();
            seconds = $("#inSeconds").val();
        }
    });
});

function ToDoubleDigits(number) {
    if (number < 10) {
        return "0" + number;
    } else {
        return number;
    }
}