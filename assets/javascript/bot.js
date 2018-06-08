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
    var percentageValue = null;
    var cash = null;
    var quantity = null;
    var buyPrice = null;
    var actualPrice = null;
    var sellPrice = null;
    var buyBoolean = false;
    var stopBotBool = true;


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
                refDifference = parseFloat(btcPrice * -5);
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
        cash = parseFloat($("#cashValue").val().trim());
        percentageValue = parseFloat($("#percentageValue").val().trim());
        $("#startBtn").addClass("hide");
        $("#stopBotBtn").removeClass("hide");
        start_buy();
        console.log("your cash " + cash);
        console.log("your percentage value " + percentageValue + "%");
    });

    var start_buy = function () {
        interval = setInterval(async function () {

            const binance = new ccxt.binance();
            const marketsArrayPrice = await binance.publicGetTickerPrice();
            if (marketsArrayPrice) {
                let btcPrice = marketsArrayPrice[11].price;
                binance_price_check(btcPrice);
            }
        }, 5000);
    }



    var print_sell_data = function (date) {
        $("#pCloseDate").text(date);
        $("#pClosePrice").text("$" + parseFloat(sellPrice).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,'));
        $("#win-loss-" + order).text(parseFloat(((sellPrice - buyPrice) / buyPrice) * 100).toFixed(2) + "%");
        $("#stopBtn" + order).attr("disabled", "disabled");
        clearInterval(bitsoInterval);
        buyBoolean = false;
        if (stopBotBool) {
            start_buy();
        }

    }

    var sell_coin = function () {
        var queryURL = "https://api.bitso.com/v3/order_book/?book=btc_mxn"

        $.ajax({
            url: queryURL,
            method: "GET"
        }).then(function (response) {
            var result = response.payload;
            var cost = 0;
            var quantRedux = 0;
            var sPriceSum = 0;
            var i = 0;
            var date = null;
            if (result.bids.length > 0) {
                do {
                    price = parseFloat(result.bids[i].price);
                    amount = parseFloat(result.bids[i].amount);
                    cost = parseFloat(amount * 1.01);
                    console.log(cost);
                    if (cost >= quantRedux) {
                        quantRedux = 0;
                        sPriceSum += (price * (quantRedux / 1.01));
                        sellPrice = (sPriceSum / (quantity / 1.01));
                        date = moment().format('MMMM Do YYYY, h:mm:ss a');
                    } else {
                        quantRedux -= cost;
                        sPriceSum += amount * price;
                        i++;

                    }
                }
                while (quantRedux > 0 || i > 40);
                print_sell_data(date);
            }
        });
    }

        var buy_status = function (price, quantity, date) {
            buyBoolean = true;
            stopLossPrice = parseFloat(price);
            order++;
            var divColumns = $("<div>").addClass("row col-md-12");
            var pOrder = $("<p>").text("Buy order #" + order).addClass("col-md-1 dynamic");
            var pDate = $("<p>").text(date).addClass("col-md-2 dynamic");
            var pBuyPrice = $("<p>").text("$" + parseFloat(price).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,')).addClass("dynamic col-md-1");
            var pQuantity = $("<p>").text(parseFloat(quantity + "BTC").toFixed(8)).addClass("dynamic col-md-1");
            var pActualPrice = $("<p>").addClass("col-md-2 dynamic").text("$" + parseFloat(price).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,')).attr("id", "actual-price-" + order);
            var pWinLoss = $("<p>").text("N/A").addClass("col-md-1 dynamic").attr("id", "win-loss-" + order);
            var pClosePrice = $("<p>").text("N/A").addClass("col-md-1 dynamic").attr("id", "pClosePrice");
            var stopBtn = $("<button>").text("Stop").addClass("col-md-1 btn btn-danger btn-sm closeButtons").attr("id", "stopBtn" + order);
            divColumns.append(pOrder, pDate, pBuyPrice, pQuantity, pActualPrice, pClosePrice, pWinLoss, stopBtn);
            $("#divHolder").prepend(divColumns);

            bitsoInterval = setInterval(function () {
                var queryURL = "https://api.bitso.com/v3/ticker/?book=btc_mxn"

                $.ajax({
                    url: queryURL,
                    method: "GET"
                }).then(function (response) {
                    actualPrice = parseFloat(response.payload.last);
                    if (actualPrice > stopLossPrice) {
                        stopLossPrice = actualPrice;
                    }
                    var lowestPrice = parseFloat(stopLossPrice * (1 - (percentageValue / 100)));

                    if (lowestPrice > actualPrice) {
                        sell_coin();
                    }
                    console.log(actualPrice);
                    $("#actual-price-" + order).text(actualPrice);
                    var winLoss = parseFloat(((actualPrice - price) / price) * 100);
                    if (winLoss > 0) {
                        $("#win-loss-" + order).text((winLoss).toFixed(2) + "%").removeClass("red").addClass("green");
                    } else if (winLoss < 0) {
                        $("#win-loss-" + order).text((winLoss).toFixed(2) + "%").removeClass("green").addClass("red");
                    } else {
                        $("#win-loss-" + order).text((winLoss).toFixed(2) + "%").removeClass("red green");
                    }

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
                quantity = 0;
                var sumPrice = 0;
                buyPrice = 0;
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

        $(".closeButtons").on("click","#closeBtn" + order, function () {
            sell_coin();
        });

        $("#stopBotBtn").on("click", function () {
            if (buyBoolean) {
                stopBotBool = false;
                sell_coin();
            } else {
                clearInterval(interval);
            }
        });


});
