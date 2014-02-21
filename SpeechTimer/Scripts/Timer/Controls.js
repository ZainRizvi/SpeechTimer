

$(function () {

    $(".dial").knob();
    resizeKnob();

    // Reference the auto-generated proxy for the hub.
    var chat = $.connection.timerHub;

    //
    // Functions that the hub can call back 
    //
    chat.client.setTimeRemaining = function (hours, minutes, seconds) {
        $('#counter').html(toTimeSpan(hours, minutes, seconds));
    };

    chat.client.sessionCodeSetFailed = function () {
        alert("Yikes! That session code wasn't quite right");
    }


    // Start the connection.
    $.connection.hub.start().done(function () {
        $('#submitTime').click(function () {
            // Call the SendSetCountdownTime method on the hub. 
            chat.server.sendSetCountdownTime(
                $("#inHours").val(),
                $("#inMinutes").val(),
                $("#inSeconds").val(),
                getSessionCode());
        });
        $('#pause').click(function () {
            chat.server.pauseTimer(getSessionCode());
        })
        $('#resume').click(function () {
            chat.server.resumeTimer(getSessionCode());

            //$('.dial')
            //    .trigger(
            //        'configure',
            //        {
            //            "skin": "tron",
            //            "width": 100,
            //            "height": 100
            //        }
            //    );
        })
        $('#setSessionCode').click(function () {
            var newSessionCode = $("#sessionCode").val();
            var currentSessionCode = getSessionCode();
            chat.server.controllerJoinSession(newSessionCode, currentSessionCode);
            setSessionCode(newSessionCode);
        })
    });
});

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

function getSessionCode() {
    return $("#currentSessionCode").val();
}

function setSessionCode(code) {
    $("#currentSessionCode").val(code);
}