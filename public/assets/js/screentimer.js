var screentime = (function() {

    var timer;
    var timerRunning = false;
    var overtimeRunning = false;
    var oSettings;
    var currentSecondsLeft = 60;
    var totalSeconds = 60;
    var totalOvertime = 0;
    var warningSounded = false;
    var test_template = '';

    function doInit(settings) {

        oSettings = settings;
        totalSeconds = settings.seconds;
        currentSecondsLeft = settings.seconds;
        updateDestintion(totalSeconds);

        //var source   = $("#timer-layout").html();
        //var button_template = Handlebars.compile(source);
        //source   = $("#overtime-layout").html();
        //test_template = Handlebars.compile(source);

        //$("#content").html(button_template({}));

        $(oSettings.startButton).show();
        $(settings.startButton).click(function() {
            startTimer();
        });
        $(settings.stopButton).click(function() {
            stopTimer();
        });

    }

    function stopTimer() {

        timerRunning = false;
        overtimeRunning = false;
        $(oSettings.startButton).show();
        $(oSettings.stopButton).hide();

        if (totalOvertime > 0) {
            console.log("Overtime report: " + totalOvertime);
        } else {
            console.log("Time left : " + currentSecondsLeft);
        }
        clearTimeout(timer);

    }

    function startTimer() {

        timerRunning = true;
        doTimerRun();
        $(oSettings.startButton).hide();
        $(oSettings.stopButton).show();

    }

    function doTimerRun() {

        if (currentSecondsLeft > 0 && timerRunning) {
            updateBar();
            updateDestintion(currentSecondsLeft);

            timer = setTimeout(function() {
                doTimerRun();
                updateBar(oSettings.progressBar);
                updateDestintion(currentSecondsLeft);
                currentSecondsLeft = currentSecondsLeft -1;
            }, 1000);
        } else if (timerRunning && currentSecondsLeft <= 0) {

            startOvertime();

        }


    }

    function doOvertimeRun() {

        if (overtimeRunning) {

            overTimer = setTimeout(function() {
                doOvertimeRun();
                updateDestintion(totalOvertime);
                totalOvertime = totalOvertime + 1;
            }, 1000);
        }

    }

    function startOvertime() {

        overtimeRunning = true;
        doOvertimeRun();
        $("#content").html(test_template());

        $(oSettings.stopButton).click(function() {
            stopTimer();
        });

    }

    function updateDestintion(secondsLeft) {

        $(oSettings.timerObj).html(formatSeconds(secondsLeft));
    }

    function formatSeconds(iSeconds) {
        sec_numb    = parseInt(iSeconds, 10); // don't forget the second parm
        var hours   = Math.floor(sec_numb / 3600);
        var minutes = Math.floor((sec_numb - (hours * 3600)) / 60);
        var seconds = sec_numb - (hours * 3600) - (minutes * 60);

        if (hours   < 10) {hours   = "0"+hours;}
        if (minutes < 10) {minutes = "0"+minutes;}
        if (seconds < 10) {seconds = "0"+seconds;}
        var time    = hours+':'+minutes+':'+seconds;
        return time;
    }

    function updateBar(objItem) {

        var currentSplit = totalSeconds - currentSecondsLeft;
        var split = 100 / totalSeconds;
        var percent = currentSplit * split;
        if (percent > 90) {
            $(objItem).css("background-color", "red");
            playSound();
        }
        $(objItem).css("width", percent + "%");

    }

    function playSound() {

        if (!warningSounded) {
            console.log("Play sound");
            $('<embed hidden="true" autoplay="true" loop="false" id="chatAudio" src="/public/assets/media/warning.mp3"></embed>').appendTo('body');
            warningSounded = true;
        }

    }

    return {
        init : function init(settings) {
            doInit(settings);
        }
    }

}());
