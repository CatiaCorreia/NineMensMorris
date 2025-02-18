var gameid;
var nickname;
var pass;
var boardsize;
var playercolor = null;
var datatable;

function makeRequest(command,args) {
        const xhr = new XMLHttpRequest();
        xhr.open('POST','http://twserver.alunos.dcc.fc.up.pt:8008/'+ command,true);
        xhr.onreadystatechange = function() {
            if(xhr.readyState == 4) {
                console.log(command + " " + xhr.responseText);
                const data = JSON.parse(xhr.responseText);
                if(xhr.responseText == "{}") {
                    if (command == "register") {
                        navigateTo('config-on-view');
                    }
                    else if (command == "leave") {
                        if (getView() != "wait-players") {
                            alert("You have lost the game because you left.");
                        }
                        navigateTo("login-view");
                    }

                }
                else {
                    if (command == "join") {
                        gameid = data.game;
                        navigateTo("wait-players");
                        update();
                    }
                    else if (command == "ranking" && data.ranking) {
                        datatable = data.ranking;
                        classifications(datatable);
                    }
                    else {
                        alert(xhr.responseText);
                    }
                }
         }
        }    
        xhr.send(JSON.stringify(args));
}

let game;

function sse() {
    var url = "http://twserver.alunos.dcc.fc.up.pt:8008/update?nick=" + nickname + "&game="+ gameid;
    const eventSource = new EventSource(url);
    eventSource.onmessage = function (event) {
        const data = JSON.parse(event.data);
        console.log("SSE " + event.data);
        if(data.winner){
            navigateTo('login-view');
            eventSource.close()
        }
        else if(data.players){
            if(playercolor == null)
            {
                const first_player = data.turn;
                console.log(data.players);
                console.log(nickname);
                playercolor = data.players[nickname];
                game = new Game(first_player, playercolor, nickname);
                navigateTo('game-view');
            }
            else if(data.step){
                game.updateGame(data.phase, data.cell, data.step, data.turn);
            }
            else{
                game.updateGame(data.phase, data.cell, null, null);
            }

            
        }
    }
}

function register(){
    nickname = document.getElementById("username").value;
    pass = document.getElementById("password").value;
    makeRequest("register", {'nick': nickname, 'password': pass});
}


function join(){
    const id = 15;
    boardsize = document.getElementById("board-size").value;
    makeRequest("join", {'group': id, 'nick': nickname, 'password': pass, 'size': boardsize});
    
}

function leave(){
    makeRequest("leave", {'nick': nickname, 'password': pass, 'game': gameid});
}

function notify(quadrado, posicao){
    const move = { "square": quadrado, "position": posicao };
    makeRequest("notify", {'nick': nickname, 'password': pass, 'game': gameid, 'cell': move});
}

function update(){
    sse({'nick': nickname, 'game': gameid});
}

function ranking(){
    const id = 15;
    makeRequest("ranking", {'group': id, 'size': boardsize});
}