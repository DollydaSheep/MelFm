var redirect_uri = "http://127.0.0.1:5500/homepage.html"

var clientId = '3d5f27f68e2a4d199904609ac0b0d41f';
var clientSecret = '6f8b0da94035484f916a17da808f6153';
var access;
var refresh;

localStorage.setItem("client_id", clientId);
localStorage.setItem("client_secret", clientSecret);

const authorize = "https://accounts.spotify.com/authorize"
const TOKEN = "https://accounts.spotify.com/api/token";

var currentTrack;
var duration = 0;
var start = 0;

function onpageload(){
    clientId = localStorage.getItem("client_id");
    clientSecret = localStorage.getItem("client_secret");
    if(window.location.search.length > 0){
        handleRedirect();
    }
    else{
        access = sessionStorage.getItem("access_token");
        console.log(access);
        if(access!=null){
            callAPI("GET", 'https://api.spotify.com/v1/me/player/recently-played?limit=10', null, getRecent);
        }
    }
}


setInterval(callAPI,1000,"GET",'https://api.spotify.com/v1/me/player', null, getPlayback);

function callAPI(method, url, body, callback){
    let xhr = new XMLHttpRequest();
    xhr.open(method, url, true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.setRequestHeader('Authorization', 'Bearer ' + access);
    xhr.send(body);
    xhr.onload = callback;
    console.log(url);
    console.log(duration);
}

function getRecent(){
    var data = JSON.parse(this.responseText);
    for(let i=9;i>=0;i--){
        var img = data.items[i].track.album.images[2].url;
        var trackname = data.items[i].track.name;
        var artistname = data.items[i].track.artists[0].name;
        var url = data.items[i].track.external_urls.spotify;
        let place = document.querySelector(".after");
        let track = `<div class="track">
            <img src="${img}" alt="Album Art">
            <div class="info">
            <p class="tname"><a href="${url}" target="_blank">${trackname}</a></p>
            <p class"aname">${artistname}</p>
            </div>
        </div>`;
        place.insertAdjacentHTML("afterend", track);
    }
}

function getPlayback(){
    var data = JSON.parse(this.responseText);
    if(data.is_playing){
        duration++;
        callAPI("GET", 'https://api.spotify.com/v1/me/player/currently-playing', null, getTrackInfo);
    }
}

function getTrackInfo(){
    var data = JSON.parse(this.responseText);
    if(currentTrack==null || currentTrack != data.item.name + data.item.artists[0].name){
        console.log(this.status);
        if(this.status == 200){
            console.log(data);
            var img = data.item.album.images[2].url;
            var trackname = data.item.name;
            var artistname = data.item.artists[0].name;
            var url = data.item.external_urls.spotify;
            let place = document.querySelector(".after");
            let last = document.querySelector(".recent-tracks");
            let rem = document.querySelector(".track");
            let cr = document.getElementById("cr");
            if(rem && duration<10 && start!=0){
                rem.parentNode.removeChild(rem);
            }
            else if(rem && cr){
                cr.remove();
                last.removeChild(last.lastElementChild);
                rem.removeAttribute("id");
            }
            else{
                last.removeChild(last.lastElementChild);
                rem.removeAttribute("id");
            }
            let track = `<div class="track" id="currentPlaying">
            <img src="${img}" alt="Album Art">
            <div class="info">
            <p class="tname"><a href="${url}" target="_blank">${trackname}</a></p>
            <p class"aname">${artistname}</p>
            </div>
            <p id="cr">Currently Playing</p>
        </div>`;
            place.insertAdjacentHTML("afterend", track);
            currentTrack = trackname + artistname;
            console.log(track);
            duration = 0;
            start = 1;
        }
        else if(this.status == 401){
            refreshAccessToken();
        }
    }
}

function refreshAccessToken(){
    refresh = sessionStorage.getItem("refresh_token");
    let body = "grant_type=refresh_token";
    body += "&refresh_token=" + refresh;
    body += "&client_id=" + clientId;
    body += "&client_secret=" + clientSecret;
    callAuthorizationApi(body);
}

function handleRedirect(){
    let code = getCode();
    if (code) {
        fetchAccessToken(code);
        window.history.pushState("", "", redirect_uri);
    }
}

function fetchAccessToken( code ){
    let body = "grant_type=authorization_code";
    body += "&code=" + code;
    body += "&redirect_uri=" + encodeURI(redirect_uri);
    body += "&client_id=" + clientId;
    body += "&client_secret=" + clientSecret;
    callAuthorizationApi(body);
}

function callAuthorizationApi(body){
    let xhr = new XMLHttpRequest();
    xhr.open("POST", TOKEN, true);
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    xhr.setRequestHeader('Authorization', 'Basic ' + btoa(clientId + ":" + clientSecret));
    xhr.send(body);
    xhr.onload = handleAuthorizationResponse;
}

function handleAuthorizationResponse(){
    if(this.status == 200){
        var data = JSON.parse(this.responseText);
        console.log(data);
        if(data.access_token != undefined){
            access = data.access_token;
            sessionStorage.setItem("access_token", access);
            console.log(sessionStorage.getItem("access_token"));
        }
        if(data.refresh_token != undefined){
            refresh = data.refresh_token;
            sessionStorage.setItem("refresh_token", refresh);
            console.log(sessionStorage.getItem("refresh_token"));
        }
        onpageload();
    }
    else{
        console.log(this.responseText);
        alert(this.responseText);
    }
}

function getCode(){
    let code = null;
    const queryString = window.location.search;
    if( queryString.length > 0){
        const urlParams = new URLSearchParams(queryString);
        code = urlParams.get('code')
    }
    return code;
}

function auth(){
    let url = authorize;
    url += "?client_id=" + clientId;
    url += "&response_type=code";
    url += "&redirect_uri=" + encodeURI(redirect_uri);
    url += "&show_dialog=true";
    url += "&scope=user-read-currently-playing user-read-playback-state user-read-recently-played user-top-read";
    window.location.href = url;
}