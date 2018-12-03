//import {MySONparser} from "./json-parse.js"
export  function getDataFromServer(url, callback) {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', url, true);
    xhr.send();

    xhr.onreadystatechange = function() {
        if (xhr.readyState != 4)
          return;
        if (xhr.status === 200) {

        callback(JSON.parse/*MySONparser*/(xhr.responseText, function(key,value) {
            if (key === "regexp") {
                return RegExp(value);
            }
            else {
                return value;
            }
         }));
        }
    }
}
