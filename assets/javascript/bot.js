$(document).ready(function () {
    var percentage = .01;
    var refPrice = null;
    var refDifference = null;
    var arrayObj = [];
    var index = 0;
    var difAmount = null;
    var interval = null;
    var bitsoInterval = null;
    var order = 0;
    var stopLossPrice = null;
    var stopLossNumber = null;


    var check_for_buy = function () {
        difAmount = 0;
        arrayObj.forEach(element => {
            difAmount += element.dif;
        });
        if (difAmount > refDifference) {
            buy_function();
            console.log('we buyin');
            clearInterval(interval);
        }

    };


    var binance_price_check = function (btcPrice) {
        btcPrice = parseFloat(btcPrice);
        if (index == 0) {
            if (refPrice == null) {
                refPrice = btcPrice;
                refDifference = parseFloat(btcPrice * -.00000001);
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
                refDifference = parseFloat(btcPrice * percentage);
                arrayObj[index] = {
                    "price": btcPrice,
                    "dif": parseFloat(btcPrice - (arrayObj[11].price))
                };
                index++;
                console.log(arrayObj);
                console.log("ref Difference = " + refDifference);
                console.log("dif Amount = " + difAmount);
            }
        } else if (index > 0 && index < 11) {
            console.log(btcPrice);
            arrayObj[index] = {
                "price": btcPrice,
                "dif": parseFloat(btcPrice - (arrayObj[index - 1].price))
            };
            index++;
            console.log(arrayObj);
            console.log("ref Difference = " + refDifference);
            console.log("dif Amount = " + difAmount);
        } else {
            arrayObj[index] = {
                "price": btcPrice,
                "dif": parseFloat(btcPrice - (arrayObj[index - 1].price))
            };
            index = 0;
            console.log(arrayObj);
            console.log("ref Difference = " + refDifference);
            console.log("dif Amount = " + difAmount);
        }

        check_for_buy();

    };

    $("#startBtn").on("click", function () {

        interval = setInterval(async function () {

            const binance = new ccxt.binance();
            const marketsArrayPrice = await binance.publicGetTickerPrice();
            if (marketsArrayPrice) {
                let btcPrice = marketsArrayPrice[11].price;
                binance_price_check(btcPrice);
            }
        }, 5000);

    });

    var buy_status = function (price, quantity, date) {
        stopLossPrice = parseFloat(price);
        order++;
        var divRow = $("<div>").addClass("row").attr("id", "divRow" + order);
        var divColumns = $("<div>").addClass("col-md-12");
        var pOrder = $("<p>").text("Buy order #" + order).addClass("col-md-1");
        var pDate = $("<p>").text(date).addClass("col-md-2");
        var pBuyPrice = $("<p>").text("$" + parseFloat(price).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,')).addClass("col-md-1");
        var pQuantity = $("<p>").text(parseFloat(quantity).toFixed(8)).addClass("col-md-1");
        var pCoin = $("<p>").text("BTC").addClass("col-md-1");
        var pEquivalent = $("<p>").text("$" + parseFloat(parseFloat(price) * parseFloat(quantity)).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,')).addClass("col-md-1");
        var pActualPrice = $("<p>").addClass("col-md-1").text("$" + parseFloat(price).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,')).attr("id", "actual-price-" + order);
        var pWinLoss = $("<p>").text("N/A").addClass("col-md-1").attr("id", "win-loss-" + order);
        divColumns.append(pOrder, pDate, pBuyPrice, pQuantity, pCoin, pEquivalent, pActualPrice, pWinLoss);
        divRow.append(divColumns);
        $("#divHolder").prepend(divRow);

        bitsoInterval = setInterval(function () {
            var queryURL = "https://api.bitso.com/v3/ticker/?book=btc_mxn"

            $.ajax({
                url: queryURL,
                method: "GET"
            }).then(function (response) {
                var actualPrice = parseFloat(response.payload.last);
                if (actualPrice>stopLossPrice){
                    stopLossPrice = actualPrice;
                }
                console.log(actualPrice);
                $("#actual-price-" + order).text(actualPrice);
                $("#win-loss-" + order).text(parseFloat(((actualPrice - price) / price) * 100).toFixed(2) + "%");
            });
        }, 5000)
    };



    var buy_function = function () {
        var queryURL = "https://api.bitso.com/v3/order_book/?book=btc_mxn"

        $.ajax({
            url: queryURL,
            method: "GET"
        }).then(function (response) {
            var result = response.payload;
            console.log(result);
            var cash = 200000;
            var quantity = 0;
            var sumPrice = 0;
            var buyPrice = 0;
            var cost = 0;
            var bQuant = 0;
            var i = 0;
            var date = null;
            if (result.asks.length > 0) {
                do {
                    price = parseFloat(result.asks[i].price);
                    amount = parseFloat(result.asks[i].amount);
                    cost = parseFloat(price * amount * 1.01);
                    console.log(cost);
                    if (cost >= cash) {
                        sumPrice += (cash / 1.01);
                        quantity += (bQuant + (cash / (price * 1.01)));
                        buyPrice = (sumPrice) / (quantity);
                        cash = 0;
                        date = moment().format('MMMM Do YYYY, h:mm:ss a');
                        console.log("Final " + sumPrice)
                        console.log(i + 1);
                        console.log("Compraste: " + quantity + " BTC");
                        console.log("A precio de: " + buyPrice + " BTC");
                    } else {
                        sumPrice += (price * amount);
                        bQuant += parseFloat(amount);
                        console.log("Q is " + bQuant);
                        console.log("sumPrice " + sumPrice);
                        cash -= cost;
                        i++;
                    }
                }
                while (cash > 0 || i > 40);

            }
            buy_status(buyPrice, quantity, date);

        })
    };


})