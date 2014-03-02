
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

function toDoubleDigits(number) {
    if (number < 10) {
        return "0" + number;
    } else {
        return number;
    }
}

function toTimeSpan(hours, minutes, seconds)  {
    var timeText;
    if (hours > 0) {
        timeText = hours + ":" + toDoubleDigits(minutes)
    } else {
        timeText = minutes;
    }
    timeText += ":" + toDoubleDigits(seconds)

    return timeText;
}

function getSecondsInTime(hours, minutes, seconds) {
    return seconds + (minutes * 60) + (hours * 3600);
}

function setSessionCode(code) {
    $("#sessionCode").text(code);
}

function getSessionCode() {
    return $("#sessionCode").text();
}

function getNewSessionCode() {
    return randString(4);
}
