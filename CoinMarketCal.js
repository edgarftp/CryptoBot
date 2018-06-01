
  $.ajax({
    url: "https://api.coinmarketcal.com/v1/events?access_token=NzQyNjhkMjljYWE2Y2RkNTE4YWM5ZjllMzg1MDYyYWE0MDdiMTlhM2RiZGJkMDc2ZTY4MGQ0ZmRhZjcwY2VmNw&page=1&max=4",
    method: "GET"
  }).then(function(response) {
  console.log(response);
});