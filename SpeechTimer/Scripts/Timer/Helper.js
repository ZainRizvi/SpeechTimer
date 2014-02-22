
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