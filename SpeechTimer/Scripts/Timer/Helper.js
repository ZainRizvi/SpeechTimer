
function toDoubleDigits(number) {
    if (number < 10) {
        return "0" + number;
    } else {
        return number;
    }
}

function toTimeSpan(hours, minutes, seconds) {
    return hours + ":" + toDoubleDigits(minutes) + ":" + toDoubleDigits(seconds)
}

function getSecondsInTime(hours, minutes, seconds) {
    return seconds + (minutes * 60) + (hours * 3600);
}