/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
$( document ).ready(function() {
  var source   = $("#some-template").html();
  var template = Handlebars.compile(source);
  var data = { users: [
      {username: "alan", firstName: "Alan", lastName: "Johnson", email: "alan@test.com" },
      {username: "allison", firstName: "Allison", lastName: "House", email: "allison@test.com" },
      {username: "ryan", firstName: "Ryan", lastName: "Carson", email: "ryan@test.com" }
    ]};
  //$("#content").html(template(data));

    screentime.init({
        startButton : "button#start",
        stopButton : "button#stop",
        progressBar : "div#timerFiller",
        progressOvertimeBar : "div#overtimerbar",
        timerObj: "#timer",
        seconds: 5
        });

});
