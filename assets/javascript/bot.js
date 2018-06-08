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
                refDifference = parseFloat(btcPrice * percentage);
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
        $("#pClosePrice").text("$" + parseFloat(sellPrice).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,'));
        var winLoss = parseFloat(((sellPrice - buyPrice) / buyPrice) * 100);
        if (winLoss > 0) {
            $("#win-loss-" + order).text((winLoss).toFixed(2) + "%").removeClass("red").addClass("green");
        } else if (winLoss < 0) {
            $("#win-loss-" + order).text((winLoss).toFixed(2) + "%").removeClass("green").addClass("red");
        } else {
            $("#win-loss-" + order).text((winLoss).toFixed(2) + "%").removeClass("red green");
        }
        $("#stopBtn" + order).attr("disabled", "disabled");
        clearInterval(bitsoInterval);
        buyBoolean = false;
        if (stopBotBool) {
            start_buy();
        }else {
            $("#stopBotBtn").addClass("hide");
            $("#startBtn").removeClass("hide");
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
            var quantRedux = quantity;
            var sPriceSum = 0;
            var i = 0;
            var date = null;
            var amount = 0;
            if (result.bids.length > 0) {
                do {
                    price = parseFloat(result.bids[i].price);
                    amount = parseFloat(result.bids[i].amount);
                    cost = parseFloat(amount * 1.005);
                    console.log(cost);
                    if (cost >= quantRedux) {
                        sPriceSum += (price * (quantRedux / 1.005));
                        sellPrice = (sPriceSum / (quantity / 1.005));
                        date = moment().format('MMMM Do YYYY, h:mm:ss a');
                        quantRedux = 0;
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
            var tableRow = $("<tr>");
            var pOrder = $("<td>").text("Buy order #" + order).addClass(" dynamic").attr("scope", "col");
            var pDate = $("<td>").text(date).addClass(" dynamic").attr("scope", "col");
            var pBuyPrice = $("<td>").text("$" + parseFloat(price).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,')).addClass("dynamic ").attr("scope", "col");
            var pQuantity = $("<td>").text(parseFloat(quantity + "BTC").toFixed(8)).addClass("dynamic ").attr("scope", "col");
            var pActualPrice = $("<td>").addClass("dynamic").text("$" + parseFloat(price).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,')).attr("id", "actual-price-" + order).attr("scope", "col");
            var pWinLoss = $("<td>").text("N/A").addClass(" dynamic").attr("id", "win-loss-" + order).attr("scope", "col");
            var pClosePrice = $("<td>").text("N/A").addClass(" dynamic").attr("id", "pClosePrice").attr("scope", "col");
            var btnTdHolder = $("<td>").attr("scope", "col");
            var stopBtn = $("<button>").text("Stop").addClass(" btn btn-danger btn-sm closeButtons").attr("id", "stopBtn" + order);
            btnTdHolder.append(stopBtn);
            tableRow.append(pOrder, pDate, pBuyPrice, pQuantity, pActualPrice, pClosePrice, pWinLoss, stopBtn);
            $("#rowHolder").prepend(tableRow);

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
                    $("#actual-price-" + order).text("$" + parseFloat(actualPrice).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,'));
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
                var internCash = cash;
                var result = response.payload;
                console.log(result);
                quantity = 0;
                var sumPrice = 0;
                buyPrice = 0;
                var cost = 0;
                var bQuant = 0;
                var i = 0;
                var date = null;
                var amount = 0;
                if (result.asks.length > 0) {
                    do {
                        price = parseFloat(result.asks[i].price);
                        amount = parseFloat(result.asks[i].amount);
                        cost = parseFloat(price * amount * 1.005);
                        console.log(cost);
                        if (cost >= internCash) {
                            sumPrice += (internCash / 1.005);
                            quantity += (bQuant + (internCash / (price * 1.005)));
                            buyPrice = (sumPrice) / (quantity);
                            internCash = 0;
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
                            internCash -= cost;
                            i++;
                        }
                    }
                    while (internCash > 0 || i > 40);

                }
                buy_status(buyPrice, quantity, date);

            })
        };

        $(document).on("click",".closeButtons", function () {

            sell_coin();
        });

        $("#stopBotBtn").on("click", function () {
            if (buyBoolean) {
                console.log("buyBoolean true");
                stopBotBool = false;
                sell_coin();
            } else {
                console.log("buyBoolean False");
                clearInterval(interval);
                $("#stopBotBtn").addClass("hide");
                $("#startBtn").removeClass("hide");
            }
        });


});
