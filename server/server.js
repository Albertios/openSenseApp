var express = require('express');
var bodyParser = require('body-parser');
var logger = require('morgan');
var methodOverride = require('method-override')
var cors = require('cors');
 
var app = express();
app.use(logger('dev'));
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());
app.use(methodOverride());
app.use(cors());
 
app.post('/forecast', function(req, res){

    var list = []
    
    var today = new Date();
    var dd = today.getDate();
    var mm = today.getMonth()+1; //January is 0!
    var yyyy = today.getFullYear();
    var fromDay = dd, toDay = dd , fromMonth = mm, toMonth = mm, fromYear = yyyy, toYear= yyyy;
    var firstD, secondD, thirdD, fourthD, fifth;
    if(dd == 1){
        if(mm==1){
            toDay == 31;
            fromMonth = toMonth = 12;
            fromYear = toYear = yyyy-1;
        }
        else if (mm == 3){
            if(yyyy%400 == 0){
                today = 29;
            }
            else{
                today = 28;
            }
            fromMonth = toMonth = mm - 1;
        }
        else if(mm == 2 || mm == 4 || mm == 6 || mm == 8 || mm == 9 || mm == 11){
            today = 31;
            fromMonth = toMonth = mm - 1;
        }
        else if(mm == 5 || mm == 7 || mm == 10 || mm == 12){
            today = 30;
            fromMonth = toMonth = mm - 1;
        }
    }
    else if(mm == 1){
        toDay -= 1;
        fromMonth = 12;
        fromYear = yyyy - 1; 
    }
    else{
        toDay -= dd;
        fromMonth = mm-1;
    }

    // if(mm==1 && dd>=28){
    //     if(dd==28)
    //     {
    //         firstD = 28;secondD=29; thirdD = 30; fourthD=31, fifth=1;
    //         mm=

    //     }else if(dd==29){

    //     }

    // }

    //add '0' in case month or/and day value is less than 10
    if(toDay<10) {
        toDay = '0' + toDay;
    }
    if(fromDay<10) {
        fromDay = '0' + fromDay;
    }
    if(fromMonth<10) {
        fromMonth = '0' + fromMonth;
    }
    if(toMonth<10) {
        toMonth = '0' + toMonth;
    }

    //var t = new Date();
    // list.push(String(t.setDate(today.getDate()+1)))
    // list.push(String(today.add(1).day()))
    list.push('\xa0\xa0'+" 09:00")
    list.push('\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0'+"  12:00")
    list.push('\xa0\xa0\xa0\xa0\xa0\xa0\xa0' +"15:00")
    if(dd == "28"){
        list.push(String("28")+"/"+String(toMonth)+"/"+String(yyyy%100)+"\t (Today)")
        list.push(String("29")+"/"+String(toMonth)+"/"+String(yyyy%100))
        list.push(String("30")+"/"+String(toMonth)+"/"+String(yyyy%100))
        list.push(String("31")+"/"+String(toMonth)+"/"+String(yyyy%100))
        list.push(String("01")+"/"+String("02")+"/"+String(yyyy%100))
    }else if (dd =="29"){
        list.push(String("29")+"/"+String(toMonth)+"/"+String(yyyy%100)+"\t (Today)")
        list.push(String("30")+"/"+String(toMonth)+"/"+String(yyyy%100))
        list.push(String("31")+"/"+String(toMonth)+"/"+String(yyyy%100))
        list.push(String("01")+"/"+String("02")+"/"+String(yyyy%100))
        list.push(String("02")+"/"+String("02")+"/"+String(yyyy%100))
    }else{
        list.push(String(dd)+"/"+String(toMonth)+"/"+String(yyyy%100)+"\t (Today)")
        list.push(String(dd+1)+"/"+String(toMonth)+"/"+String(yyyy%100))
        list.push(String(dd+2)+"/"+String(toMonth)+"/"+String(yyyy%100))
        list.push(String(dd+3)+"/"+String(toMonth)+"/"+String(yyyy%100))
        list.push(String(dd+4)+"/"+String(toMonth)+"/"+String(yyyy%100))
    }

    // console.log(String(fromDay)+"3333-"+String(fromMonth)+"-"+String(fromYear))
    // console.log(String(toDay)+"-"+String(toMonth)+"-"+String(toYear))

    var request = require("request")
    //Westfälisches Pferdemuseum Münster station
    //var url = "https://api.opensensemap.org/statistics/descriptive?boxid=5837219353fb45000f9478b0&&phenomenon=Temperatur&from-date=2018-12-21T00:01:01.930Z&to-date=2019-01-21T22:59:59.930Z&download=true&format=json&window=3600000&operation=arithmeticMean"
    var url = "https://api.opensensemap.org/statistics/descriptive?boxid="+req.body.BoxId+"&&phenomenon=Temperatur&from-date="+String(fromYear)+"-"+String(fromMonth)+"-"+String(fromDay)+"T00:01:01.930Z&to-date="+String(toYear)+"-"+String(toMonth)+"-"+String(toDay)+"T22:59:59.930Z&download=true&format=json&window=3600000&operation=arithmeticMean"
    //cyper station
    //var url = "https://api.opensensemap.org/statistics/descriptive?boxid=593bcd656ccf3b0011791f5a&&phenomenon=Temperatur&from-date=2018-12-21T00:01:01.930Z&to-date=2019-01-21T22:59:59.930Z&download=true&format=json&window=3600000&operation=arithmeticMean"
    //var url = "https://api.opensensemap.org/statistics/descriptive?boxid=593bcd656ccf3b0011791f5a&&phenomenon=Temperatur&from-date="+String(fromYear)+"-"+String(fromMonth)+"-"+String(fromDay)+"T00:01:01.930Z&to-date="+String(toYear)+"-"+String(toMonth)+"-"+String(toDay)+"T22:59:59.930Z&download=true&format=json&window=3600000&operation=arithmeticMean"
    request({
        url: url,
        json: true
    }, function (error, response, body) {

        if (!error && response.statusCode === 200) {
            //console.log(response) // Print the json response
            //console.log(typeof response)
            //console.log(body)
            let {PythonShell} = require('python-shell')
            var pyshell = new PythonShell('forecast.py');

            pyshell.send(JSON.stringify(body));
            //pyshell.send(JSON.stringify([1,2,3,4,5]));

            pyshell.on('message', function (message) {
                list.push(message.substr(11,15))
                //list.push(message)
                //console.log(message);
            });
            // end the input stream and allow the process to exit
            pyshell.end(function (err) {
                if (err){
                    throw err;
                };
                res.json(list);
            });
        }
    })
}); 
 
app.listen(8080);