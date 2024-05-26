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

let changeCSS;
let activeCSS1 = "recent-h2";
let activeCSS2 = "recent-i";
let activeCSS3 = ".recent";

function onpageload(){
    clientId = localStorage.getItem("client_id");
    clientSecret = localStorage.getItem("client_secret");
    if(window.location.search.length > 0){
        handleRedirect();
    }
    else{
        access = localStorage.getItem("access_token");
        console.log(access);
        if(access!=null){
            callAPI("GET", 'https://api.spotify.com/v1/me/player/recently-played?limit=10', null, getRecentt);
            let place = document.querySelector(".after");
            let head = `<h1 id="head">Recent Tracks</h1>`;
            place.insertAdjacentHTML("afterbegin", head);
        }
    }
}

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

function recent(){
    let rem = document.querySelector(".content-area");
    for(let i=0;i<10;i++){
        rem.removeChild(rem.children[1]);
    }
    rem = document.getElementById("head");
    rem.remove();

    changeCSS = document.getElementById("recent-h2");
    changeCSS.style.color = "black";
    changeCSS = document.getElementById("recent-i");
    changeCSS.style.color = "black";
    changeCSS = document.querySelector(".recent");
    changeCSS.style.borderBottom = "2px solid black";
    if(activeCSS1 != "recent-h2"){
        changeCSS = document.getElementById(activeCSS1);
        changeCSS.style.color = "rgb(97, 97, 97)";
        changeCSS = document.getElementById(activeCSS2);
        changeCSS.style.color = "rgb(97, 97, 97)";
        changeCSS = document.querySelector(activeCSS3);
        changeCSS.style.borderBottom = "2px solid transparent";
    }
    activeCSS1 = "recent-h2";
    activeCSS2 = "recent-i";
    activeCSS3 = ".recent";
    callAPI("GET", 'https://api.spotify.com/v1/me/player/recently-played?limit=10', null, getRecentt);
    let place = document.querySelector(".after");
    let head = `<h1 id="head">Recent Tracks</h1>`;
    place.insertAdjacentHTML("afterbegin", head);
}

function artists(){
    let rem = document.querySelector(".content-area");
    for(let i=0;i<10;i++){
        rem.removeChild(rem.children[1]);
    }
    rem = document.getElementById("head");
    rem.remove();

    changeCSS = document.getElementById("artists-h2");
    changeCSS.style.color = "black";
    changeCSS = document.getElementById("artists-i");
    changeCSS.style.color = "black";
    changeCSS = document.querySelector(".artists");
    changeCSS.style.borderBottom = "2px solid black";
    if(activeCSS1 != "artists-h2"){
        changeCSS = document.getElementById(activeCSS1);
        changeCSS.style.color = "rgb(97, 97, 97)";
        changeCSS = document.getElementById(activeCSS2);
        changeCSS.style.color = "rgb(97, 97, 97)";
        changeCSS = document.querySelector(activeCSS3);
        changeCSS.style.borderBottom = "2px solid transparent";
    }
    activeCSS1 = "artists-h2";
    activeCSS2 = "artists-i";
    activeCSS3 = ".artists";
    if(access!=null){
        callAPI("GET", 'https://api.spotify.com/v1/me/top/artists?time_range=short_term&limit=10', null, getTopArtist);
    }
    let place = document.querySelector(".after");
    let head = `<h1 id="head">Top Artists</h1>`;
    place.insertAdjacentHTML("afterbegin", head);
}

function tracks(){
    let rem = document.querySelector(".content-area");
    for(let i=0;i<10;i++){
        rem.removeChild(rem.children[1]);
    }
    rem = document.getElementById("head");
    rem.remove();

    changeCSS = document.getElementById("tracks-h2");
    changeCSS.style.color = "black";
    changeCSS = document.getElementById("tracks-i");
    changeCSS.style.color = "black";
    changeCSS = document.querySelector(".tracks");
    changeCSS.style.borderBottom = "2px solid black";
    if(activeCSS1 != "tracks-h2"){
        changeCSS = document.getElementById(activeCSS1);
        changeCSS.style.color = "rgb(97, 97, 97)";
        changeCSS = document.getElementById(activeCSS2);
        changeCSS.style.color = "rgb(97, 97, 97)";
        changeCSS = document.querySelector(activeCSS3);
        changeCSS.style.borderBottom = "2px solid transparent";
    }
    activeCSS1 = "tracks-h2";
    activeCSS2 = "tracks-i";
    activeCSS3 = ".tracks";
    if(access!=null){
        callAPI("GET", 'https://api.spotify.com/v1/me/top/tracks?time_range=short_term&limit=10', null, getTopTracks);
    }
    let place = document.querySelector(".after");
    let head = `<h1 id="head">Top Tracks</h1>`;
    place.insertAdjacentHTML("afterbegin", head);
}

function getTopTracks(){
    var data = JSON.parse(this.responseText);
    for(let i=9;i>=0;i--){
        if(i!=9){
            var s = "&nbsp&nbsp";;
        }
        else{
            s = "";
        }
        var img = data.items[i].album.images[2].url;
        var trackname = data.items[i].name;
        var artistname = data.items[i].artists[0].name;
        let place = document.querySelector(".after");
        let track = `<div class="track">
            <p>${i+1}${s}</p>
            <img src="${img}" alt="Album Art">
            <div class="info">
            <p class"tname">${trackname}</p>
            <p class"aname">${artistname}</p>
            </div>
            <p id="gray">100 listens</p>
        </div>`;
        place.insertAdjacentHTML("afterend", track);
    }
}

function getTopArtist(){
    var data = JSON.parse(this.responseText);
    for(let i=9;i>=0;i--){
        if(i!=9){
            var s = "&nbsp&nbsp";;
        }
        else{
            s = "";
        }
        var img = data.items[i].images[2].url;
        var artistname = data.items[i].name;
        let place = document.querySelector(".after");
        let track = `<div class="track">
            <p>${i+1}${s}</p>
            <p></p>
            <img src="${img}" alt="Album Art">
            <div class="info">
            <p class"aname">${artistname}</p>
            </div>
            <p id="gray">100 listens</p>
        </div>`;
        place.insertAdjacentHTML("afterend", track);
    }
}

function getRecentt(){
    var data = JSON.parse(this.responseText);
    for(let i=9;i>=0;i--){
        var img = data.items[i].track.album.images[2].url;
        var trackname = data.items[i].track.name;
        var artistname = data.items[i].track.artists[0].name;
        var date = data.items[i].played_at;
        console.log(i + " " + date);
        var h = date.at(11) + date.at(12);
        var m = date.at(14) + date.at(15);
        var time = new Date();
        h = Number(h) + 8;
        var sum = (h * 60) + Number(m);
        var currtime = (time.getHours() * 60) + time.getMinutes();
        if(sum <= currtime - 60){
            var t;
            var pl;
            if(time.getHours() - h == 1){
                t = "an";
                pl = "hour";
            }
            else{
                t = time.getHours() - h;
                pl = "hours";
            }
        }
        else if(sum > currtime){
            t = (24 - h) + time.getHours();
            pl = "hours";
        }
        else{
            if(currtime - sum == 1){
                t = "a";
                pl = "minute";
            }
            else{
                t = currtime - sum;
                pl = "minutes";
            }
        }
        let place = document.querySelector(".after");
        let track = `<div class="track">
            <img src="${img}" alt="Album Art">
            <div class="info">
            <p class="tname">${trackname}</p>
            <p class"aname">${artistname}</p>
            </div>
            <p>${t} ${pl} ago</p>
        </div>`;
        place.insertAdjacentHTML("afterend", track);
    }

}

function refreshAccessToken(){
    refresh = localStorage.getItem("refresh_token");
    let body = "grant_type=refresh_token";
    body += "&refresh_token=" + refresh;
    body += "&client_id=" + clientId;
    body += "&client_secret=" + clientSecret;
    callAuthorizationApi(body);
}

function handleRedirect(){
    let code = getCode();
    fetchAccessToken( code );
    window.history.pushState("", "", redirect_uri);
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
            localStorage.setItem("access_token", access);
        }
        if(data.refresh_token != undefined){
            refresh = data.refresh_token;
            localStorage.setItem("refresh_token", refresh);
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

