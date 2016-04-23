"use strict";
var page = require('webpage').create();
var server = require('webserver').create();

console.log('The default user agent is ' + page.settings.userAgent);
page.settings.userAgent = 'SpecialAgent';

    var listening = server.listen('192.168.2.158:8083', function (request, response) {
        console.log("HTTP REQUEST");
        console.log(JSON.stringify(request, null, 4));
        console.log("======================= Split line =======================");

        if(request.method === 'GET'){
            response.statusCode = 200;
            response.headers = {"Cache": "no-cache", "Content-Type": "text/html"};

            response.write("<html><head><title>YES!</title><script src='http://apps.bdimg.com/libs/jquery/1.8.3/jquery.min.js'></script></head><body>" +
                "<h1>申通快递订单查询</h1>" +
                "<form>" +
                "<input type='text' value='3306578393260' id='emsinfo'>" +
                "<input type='button' value='查询' id='getems'>" +
                "</form>" +
                "<h2>注意：目前只是测试版本：只能输入正确的申通单号，错误或者是没有单号，就会奔溃。</h2>" +
                "<p>测试期间千万别输入错误单号，可以在自己的买的东西里面复制申通快递单号测试</p>" +
                "<p>测试单号： 3306578393260 ， 3306506961803， </p>" +
                "<script>" +
                "$(function() { " +
                "$('#getems').click(function() { $.post('',{ems:$('#emsinfo').val()},function(data) {alert(data)}); })" +
                "})" +
                "</script>" +
                "</body></html>");
            response.close();

        }

        if(request.method === 'POST'){
            if(request.post.length == 17){
                var ems = request.post.substring(4,17);
                console.log(ems + ' :' + ems.length);
                page.open('http://q1.sto.cn/chaxun/result?express_no=' + ems, function(status) {
                    if (status !== 'success') {
                        console.log('Unable to access network');
                    } else {
                        var ua = page.evaluate(function() {
                            return $('.right-box').text()
                        });
                        console.log(ua);

                        response.write(ua);
                        response.close();
                    }
                    // phantom.exit();
                });

            }else{
                response.write("请输入正确的订单号");
                response.close();
            }

        }

    });
