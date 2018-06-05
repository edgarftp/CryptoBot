$(document).ready(function(){
    var percentage = .01;
    var refPrice = null;
    var refDifference = null;
    var arrayObj = [];
    var index = 0;
    var difAmount = null;
    var interval = null;
    var bitsoInterval = null;
    var order = 0;
    

    var check_for_buy = function () {
        difAmount = 0;
        arrayObj.forEach(element => {
            difAmount += element.dif;
        });
        if (difAmount>refDifference){
            buy_function();
            console.log('we buyin');
            clearInterval(interval);
        }
        
    };
    

    var binance_price_check = function (btcPrice){
        btcPrice = parseFloat(btcPrice);
        if (index == 0) {
            if (refPrice == null){
                refPrice = btcPrice;
                refDifference = parseFloat (btcPrice * percentage);
                arrayObj[index] = {
                    "price": btcPrice,
                    "dif": 0
                };
                index++;
                console.log(arrayObj);
                console.log("ref Difference = " + refDifference);
                console.log("dif Amount = " + difAmount);
            } else {
                refPrice = btcPrice;
                refDifference = parseFloat (btcPrice * percentage);
                arrayObj[index] = {
                    "price": btcPrice,
                    "dif": parseFloat (btcPrice - (arrayObj[11].price))
                };
                index++;
                console.log(arrayObj);
                console.log("ref Difference = " + refDifference);
                console.log("dif Amount = " + difAmount);
            }   
        } else if(index>0 && index<11){
            console.log(btcPrice);
            arrayObj[index] = {
                "price": btcPrice,
                "dif": parseFloat (btcPrice - (arrayObj[index-1].price))
            };
            index++;
            console.log(arrayObj);
            console.log("ref Difference = " + refDifference);
            console.log("dif Amount = " + difAmount);
        } else {
            arrayObj[index] = {
                "price": btcPrice,
                "dif": parseFloat (btcPrice - (arrayObj[index-1].price))
            };
            index=0;
            console.log(arrayObj);
            console.log("ref Difference = " + refDifference);
            console.log("dif Amount = " + difAmount);
        }

        check_for_buy();

    };

$("#startButton").on("click", function () {
    interval = setInterval(async function () {
    
        const binance = new ccxt.binance ();  
        const marketsArrayPrice = await binance.publicGetTickerPrice ();
        if (marketsArrayPrice){
            let btcPrice = marketsArrayPrice[11].price;
            binance_price_check(btcPrice); 
        }
}, 5000);

});
var bitso_price_check = function () {

};

var buy_status = function (price, quantity, date) {
    order++;
    var divRow = $("<div>").addClass("row");
    var divColumns = $("<div>").addClass("col-md-12");
    var pOrder = $("<p>").text("Buy order #" + order).addClass(col-md-1);
    var pDate = $("<p>").text(date).addClass(col-md-1);
    var pBuyPrice = $("<p>").text("$" + parseFloat(price).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,')).addClass(col-md-1);
    var pQuantity = $("<p>").text(quantity).addClass(col-md-1);
    var pCoin = $("<p>").text("BTC").addClass(col-md-1);
    var pEquivalent = $("<p>").text("$" + parseFloat(parseFloat(price)*parseFloat(quantity)).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,')).addClass(col-md-1);

    bitsoInterval = setInterval(bitso_price_check, 5000);
};


       
var buy_function = function() {
        var queryURL = "https://api.bitso.com/v3/order_book/?book=btc_mxn"

        $.ajax ({
            url: queryURL,
            method: "GET"
        }).then(function(response) {
            var result = response.payload;
            console.log(result);
            var cash = 100000;
            var quantity = null;
            var sumPrice = null;
            var buyPrice = null;
            var cost = 0;
            var i = 0;
            var date = null;
            if (result.asks.length > 0){
                do {
                    price = parseFloat(result.asks[i].price * 1.01);
                    amount = parseFloat(result.asks[i].amount);
                    cost += parseFloat(price * amount);
                    if (cost>cash){
                        sumPrice += price;
                        buyPrice = (sumPrice)/(i+1);
                        quantity = parseFloat(cash/buyPrice);
                        cash = 0;
                        date = moment().format('MMMM Do YYYY, h:mm:ss a');
                        console.log(i+1);
                        console.log("Compraste: " + quantity + " BTC");
                        console.log("A precio de: " + buyPrice + " BTC");
                    } else {
                        sumPrice += price;
                        cash -= cost;
                        buyPrice = (sumPrice)/(i+1);
                        quantity = parseFloat(cash/buyPrice);
                        i++;
                    }
                }
                while(cash>0 || i > 9);
                
            }
            buy_status(buyPrice, quantity, date);
          
        })
    };


})