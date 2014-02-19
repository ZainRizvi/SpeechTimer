
function toDoubleDigits(number) {
    if (number < 10) {
        return "0" + number;
    } else {
        return number;
    }
}

function toTimeSpan(hours, minutes, seconds) {
    return toDoubleDigits(hours) + ":" + toDoubleDigits(minutes) + ":" + toDoubleDigits(seconds)
}