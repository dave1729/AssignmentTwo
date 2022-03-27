function getJson(callbackOnSuccess) {
    var isAsync = true;
    var xmlHttp = new XMLHttpRequest();
    var myJsonId = getMyJsonBinId();
    var theUrl = "https://davesjson.azurewebsites.net/api/DavesJson?id=" + myJsonId;
    xmlHttp.open( "GET", theUrl, isAsync ); // false for synchronous request true for async
    xmlHttp.setRequestHeader("Content-Type", "application/json");
    xmlHttp.onreadystatechange = function() {//Call a function when the state changes.
        if(xmlHttp.readyState == XMLHttpRequest.DONE && xmlHttp.status == 200) {
            console.log(`Get on ${theUrl} succeeded.`);
            if(callbackOnSuccess !== undefined) callbackOnSuccess(xmlHttp.responseText);
        }
        else if (xmlHttp.status !== 200){
            console.log(`Get on ${theUrl} failed. Status: ${xmlHttp.status}.`);
        }
    }
    xmlHttp.send( undefined );
}

function saveJson(objectAsJson, callbackOnSuccess) {
    var xmlHttp = new XMLHttpRequest();
    var myJsonId = getMyJsonBinId();
    var theUrl = "https://davesjson.azurewebsites.net/api/DavesJson?id=" + myJsonId;
    xmlHttp.open( "PUT", theUrl, true ); // false for synchronous request
    xmlHttp.setRequestHeader("Content-Type", "application/json");
    xmlHttp.onreadystatechange = function() {//Call a function when the state changes.
        if(xmlHttp.readyState == XMLHttpRequest.DONE && xmlHttp.status === 200) {
            console.log(`Put on ${theUrl} succeeded.`);
            if(callbackOnSuccess !== undefined) callbackOnSuccess();
        }
        else if (xmlHttp.status !== 200){
            console.log(`Put on ${theUrl} failed. Status: ${xmlHttp.status}.`);
            console.log(`    Response Text ${xmlHttp.responseText}`);
            console.log(`    Response ${xmlHttp.response}`);
        }
    }

    xmlHttp.send(objectAsJson);
}

function getMyJsonBinId() {
    return "ZPQ88";
}