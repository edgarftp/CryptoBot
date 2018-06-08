$(document).ready(function () {


  $.ajax({
    url: "https://api.coinmarketcal.com/v1/events?access_token=NzQyNjhkMjljYWE2Y2RkNTE4YWM5ZjllMzg1MDYyYWE0MDdiMTlhM2RiZGJkMDc2ZTY4MGQ0ZmRhZjcwY2VmNw&page=1&max=4",
    method: "GET"
  }).then(function (response) {

    console.log(response);
    // console.log(response[0].coins[0].id);
    // console.log(response[0].coins[0].name);
    // console.log(response[0].coins[0].symbol);
    // console.log(response[0].source);

    $("#card1").attr("src", response[0].proof);
    $("#card-title1").html(response[0].title);
    $("#card-text1").html(response[0].description);
    $("#date-event1").html(response[0].date_event);
    $("#source1").attr("href", response[0].source);

    $("#card2").attr("src", response[1].proof);
    $("#card-title2").html(response[1].title);
    $("#card-text2").html(response[1].description);
    $("#date-event2").html(response[1].date_event);
    $("#source2").attr("href",response[1].source);

    $("#card3").attr("src", response[2].proof);
    $("#card-title3").html(response[2].title);
    $("#card-text3").html(response[2].description);
    $("#date-event3").html(response[2].date_event);
    $("#source3").attr("href",response[2].source);

    $("#card4").attr("src", response[3].proof);
    $("#card-title4").html(response[3].title);
    $("#card-text4").html(response[3].description);
    $("#date-event4").html(response[3].date_event);
    $("#source4").attr("href",response[3].source);


    // for (var i = 0; i < response.length; i++) {
      
    //   console.log(response[i]);
    //   var newCard = $('<div>').addClass('card');
    //   newCard.append(
    //     $('<div>').addClass('card-title').text(response[i].title),
    //     $('<div>').addClass('card-body').text(response[i].description).append(
    //       $('<img>').attr('src', response[i].proof)
    //     )
    //   )
    //   $('#carousel-inner').append(newCard);
    //   console.log('card');
    // }
  });
});