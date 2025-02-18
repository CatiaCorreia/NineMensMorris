class Player{
    constructor(player, color, npieces, ptype, nickname){
        this.player = player;
        this.color = color;
        this.pieces = npieces;
        this.ptype = ptype;
        this.nickname = nickname;
    }

    getNick(){
        return this.nickname;
    }

    getPlayer(){
        return this.player;
    }

    getColor(){
        return this.color;
    }

    getPieces(){
        return this.pieces;
    }

    setPieces(p){
        this.pieces = p;
    }

    getPtype(){
        return this.ptype;
    }
}
let laststep;
class Game {

    constructor(first_player, playercolor, nickname){
        this.game_mode = document.getElementById("game-mode").value;
        this.boardsize = parseInt(document.getElementById("board-size").value);
        this.turns = 0;
        this.originmove = {"square" : null, "position" : null};
        
        
        this.piece;
        this.pieceRemoved = false;
        this.pieceSelected = false;
        this.testResult = false;

        this.estado = "add_pieces";
        this.draw  = false;
        this.winner;

        
        this.estado_tabuleiro = this.criarTabuleiro( this.boardsize);
  
        this.npecas = 3 * this.boardsize;
        this.criarPecas("red-pieces", "red", this.npecas);
        this.criarPecas("blue-pieces", "blue", this.npecas);

        this.createPlayers(first_player, playercolor, nickname);

        addMLog("Game started");
        addMLog("Game phase: Add pieces to the board");
        addMLog("Turn: " + this.currplayer.getPlayer());
    }

    createPlayers(first_player, playercolor, nickname){
        console.log("GAME MODE " + this.game_mode);
        if(this.game_mode == "pvp")
        {
            if(first_player == nickname)
            {
                this.player1 = new Player("Player 1", playercolor, this.npecas, "person", nickname);
                if( playercolor == "red") this.player2 = new Player("Player 2", "blue", this.npecas, "person", nickname);
                else this.player2 = new Player("Player 2", "red", this.npecas, "person", nickname);
                this.currplayer = this.player1;
                this.nextplayer = this.player2;
            }
            else
            {
                this.player2 = new Player("Player 2", playercolor, this.npecas, "person", nickname);
                if( playercolor == "red") this.player1 = new Player("Player 1", "blue", this.npecas, "person", nickname);
                else this.player1 = new Player("Player 1", "red", this.npecas, "person", nickname);
                this.currplayer = this.player1;
                this.nextplayer = this.player2;
            }
             
        }
        else if(this.game_mode == "pvai")
        {
            this.player1 = new Player("Player 1", "red", this.npecas, "person");
            this.player2 = new Player("Player 2", "blue", this.npecas, "ai");
            this.currplayer = this.player1;
            this.nextplayer = this.player2;
        }
    }

    addLinhas(quadrado) {
        const linhas = [
            { className: "linha-horizontal", top: "50%", left: "0", right: "0", width: "100%" },
            { className: "linha-vertical", top: "0", left: "50%", bottom: "0", height: "100%" },
        ];

        linhas.forEach(linhaConfig => {
            const linha = document.createElement("div");
            linha.className = linhaConfig.className;
        
            quadrado.appendChild(linha);
        });
    }

    criarTabuleiro(n) {
        console.log(n);
        const tam_ini = 120;
        var game_list = [];
        let tabuleiro = document.getElementById("tabuleiro");
    
        let quadrado = document.createElement("div");
        quadrado.className = "quadrado";
        quadrado.style.width = tam_ini + "px";
        quadrado.style.height = tam_ini + "px";
      
    
        this.addBotoes(quadrado, 0);
        game_list.push(["empty", "empty", "empty", "empty", "empty", "empty", "empty", "empty"]);
        
        tabuleiro.appendChild(quadrado);
      
        for (let i = 1; i < n; i++) {
          let tam = tam_ini + i * 120;
      
          let quadrado2 = document.createElement("div");
          quadrado2.className = "quadrado";
          quadrado2.style.width = tam + "px";
          quadrado2.style.height = tam + "px";
      
          this.addBotoes(quadrado2, i);
          this.addLinhas(quadrado2, i);
      
          quadrado2.appendChild(quadrado);
          quadrado = quadrado2;
          game_list.push(["empty", "empty", "empty", "empty", "empty", "empty", "empty", "empty"]);
        }
      
        tabuleiro.appendChild(quadrado);
        return game_list;
    }
      
    
    addBotoes(quadrado, ind) {
        this.posicoes = [
            "top-left", "top-mid", "top-right",
            "right-mid", "bottom-right",
            "bottom-mid", "bottom-left", "left-mid"
        ];
        
        this.posicoes.forEach(posicao => {
            let botao = document.createElement("button");
            botao.className = `botao ${posicao}`;
            botao.id = ind + posicao;
            botao.addEventListener('click', () => { 
                                                    if (nickname) {
                                                        notify(ind, this.posicoes.indexOf(posicao));
                                                    }
                                                    else
                                                    {  
                                                        if (this.draw == false && this.player1.getPieces() == 3 && this.player2.getPieces() == 3)
                                                        {
                                                            addMLog("Draw countdown started 10 turns left");
                                                            this.draw = true;
                                                            this.drawturns = 1;
                                                        }
                                                        if(this.estado == "add_pieces" && 
                                                            (this.piece.includes(this.currplayer.getColor()))) {

                                                                this.addPiece(ind, this.posicoes.indexOf(posicao), botao.id, true);
                                                                
                                                        }

                                                        else if (this.estado == "move_pieces" &&
                                                                (this.piece.includes(this.currplayer.getColor())) &&
                                                                this.pieceSelected == false)

                                                                this.pieceSelected = true;

                                                        else if(this.estado == "move_pieces" &&
                                                            (this.piece.includes(this.currplayer.getColor())) &&
                                                            this.pieceSelected == true)

                                                            {
                                                                this.movePiece(ind, this.posicoes.indexOf(posicao), botao.id);
                                                                this.pieceSelected = false;
                                                            }
                                                            
                                                        if(!this.isGameFinished()) this.updateState();
                                                        if (this.estado == "remove" && this.pieceRemoved) 
                                                        {
                                                            this.switchPlayer();
                                                            if(!this.isGameFinished()) this.updateState();
                                                        }
                                                    }
                                                }
                                  )
            quadrado.appendChild(botao);
        });
    }
      
    
    criarPecas(playerId, color, npecas) {
        const container = document.getElementById(playerId);
        for (let i = 0; i < npecas; i++) {
            const circulo = document.createElement("button");
            circulo.className = "circulo";
            circulo.style.backgroundColor = color;
            circulo.id = color + i;
            circulo.addEventListener("click", () => {
                                                        this.piece = circulo.id;
                                                        if (this.estado == "remove")
                                                        {
                                                            this.pieceRemoved = this.removeOponentPiece(circulo.id);   
                                                        }
                                                    }
            )
            container.appendChild(circulo);
        }
    }

    addPiece(quadrado, posicao, moveid, piece_selected) {
        if(this.estado_tabuleiro[quadrado][posicao] == "empty")
        {
            var pieceElement;
            if(piece_selected) pieceElement = document.getElementById(this.piece);
            else {
                pieceElement = document.getElementById(this.currplayer.getColor() + Math.floor(this.turns/2));
            }
            pieceElement.classList.add("circulo-centralizado");
            document.getElementById(moveid).appendChild(pieceElement);
            this.estado_tabuleiro[quadrado][posicao] = this.currplayer.getColor();
            this.turns++;
            this.switchPlayer();
        }
    }

    removeOponentPiece(pieceId, nick) {
        console.log("REMOVE PIECE " + pieceId);

        if((pieceId.includes(this.currplayer.getColor()) && !nickname)) {
            return false;
        }
        const parentid = document.getElementById(pieceId).parentNode.id;
        const quadrado = Number(parentid.charAt(0));
        const posicao = this.posicoes.indexOf(parentid.substring(1));
        
        this.estado_tabuleiro[quadrado][posicao] = "empty";
        const pieceElement = document.getElementById(pieceId);
        pieceElement.classList.remove("circulo-centralizado");
        if(pieceId.includes("blue")) 
            {
                document.getElementById("red-pieces").appendChild(document.getElementById(pieceId));
                this.player2.setPieces(this.player2.getPieces() - 1);
            }
        else 
            {
                document.getElementById("blue-pieces").appendChild(document.getElementById(pieceId));
                this.player1.setPieces(this.player1.getPieces() - 1);
            }
        this.testResult = false;
        if(this.draw == true) this.drawUpdate();
        return true;
    }

    movePiece(destination_square, destination_position, moveId){
        if(nickname)
        {
            const parentid = document.getElementById(this.originmove.square + this.posicoes[this.originmove.position]);
            const child = parentid.children[0].id;
            document.getElementById(moveId).appendChild(document.getElementById(child));            
        }
        else
        {
            const parentid = document.getElementById(this.piece).parentNode.id;
            const origin_square = Number(parentid.charAt(0));
            const origin_position = this.posicoes.indexOf(parentid.substring(1));
            if (this.isMoveValid(destination_square, destination_position, origin_square, origin_position) == true)
            {
                this.estado_tabuleiro[origin_square][origin_position] = "empty";
                document.getElementById(moveId).appendChild(document.getElementById(this.piece));
                this.estado_tabuleiro[destination_square][destination_position] = this.currplayer.getColor();
                this.turns++;
                this.testResult = this.testThree(destination_square, destination_position);

                if(this.testResult == false) 
                {
                    if(this.draw == true) this.drawUpdate();
                    this.switchPlayer();
                }
                else 
                {
                    this.estado = "remove";
                    addMLog("Game phase: remove an opponent's piece");
                }
            }
        }
    }

    drawUpdate(){
        this.estado = "move_pieces";
        this.drawturns += 1;
        const turns_left = 10 - this.drawturns;
        const message = "Draw countdown: " +  turns_left.toString() + " turns left";
        addMLog(message);
    }

    aiMove() {
        if (this.aiturns == undefined) {
            this.aiturns = 0;
        }

        if (this.estado == "add_pieces")
        {
            do {

                var square = Math.floor(Math.random() * this.boardsize);
                var position = Math.floor(Math.random() * 8);

            } while (this.estado_tabuleiro[square][position] != "empty");
            
            this.piece = this.currplayer.getColor() + this.aiturns.toString();
            const moveId = square.toString() + this.posicoes[position];
            this.addPiece(square, position, moveId);
            
        }
        else if (this.estado == "move_pieces")
        {   
            var pieces = this.getPiecesPlaced(this.currplayer);
            var possible_moves = this.getPossibleMoves(pieces);
            const idx = Math.floor(Math.random() * possible_moves[0].length);
            this.piece = document.getElementById(possible_moves[0][idx]).children[0].id;
            const destination = possible_moves[1][idx];
            const destination_square = Number(destination.charAt(0));
            const destination_position = this.posicoes.indexOf(destination.substring(1));
            this.movePiece(destination_square, destination_position, destination);
        }

        if (this.estado == "remove") {
            const adv = this.player1;
            const occupied = this.getPiecesPlaced(adv);
            const nremoved = Math.floor(Math.random() * occupied.length);
            const removed = document.getElementById(occupied[nremoved]).children[0].id;
            this.removeOponentPiece(removed, null);
        }   
        this.aiturns += 1;
    }

    updateState(){
        if ((this.estado == "remove") && (this.pieceRemoved == false))
        {
            this.estado = "remove";
        }
        else if((this.estado == "remove") && (this.pieceRemoved == true))
        {    
            this.estado = "move_pieces";
            addMLog("Game phase: move the pieces on the board");
            this.pieceRemoved = false;                    
        }
        else if((this.turns >= (this.npecas * 2)) && (this.draw == false))
        {
            this.estado = "move_pieces";
            if((this.turns == (this.npecas * 2)) && (this.pieceSelected == true)) addMLog("Game phase: move the pieces on the board");
        }
    }

    isGameFinished() {
        if (this.estado != "add_pieces" && this.player1.getPieces() == 2)
        {
            this.winner = this.player2.getPlayer();
            addMLog("Game over. Player 2 is the winner.");
            return true;
        }
        else if (this.estado != "add_pieces" && this.player2.getPieces() == 2)
        {
            this.winner = this.player1.getPlayer();
            addMLog("Game over. Player 1 is the winner.");
            return true;
        }
        else if(this.estado != "add_pieces" && this.IsMovePossible() == false || this.drawturns == 10)
        {
            addMLog("Game over. It's a draw.");
            return true;
        }
        return false;
    }

    switchPlayer() {

        
        let temp = this.currplayer;
        this.currplayer = this.nextplayer;
        this.nextplayer = temp;
        addMLog("Turn: " + this.currplayer.getPlayer());
        if(this.currplayer.getPtype() == "ai") 
        {
            this.aiMove();
            if(!this.isGameFinished()) this.updateState();

        }
    }

    testThree(quadrado, posicao) {
        const positionColor = this.estado_tabuleiro[quadrado][posicao];
        const inner_three = this.testInnerThree(quadrado, posicao,positionColor); 
        switch(posicao){
            case 0:
                if ((this.estado_tabuleiro[quadrado][1] == positionColor &&
                    this.estado_tabuleiro[quadrado][2] == positionColor) ||
                    (this.estado_tabuleiro[quadrado][7] == positionColor &&
                    this.estado_tabuleiro[quadrado][6] == positionColor)
                    )
                    return true;
                else return false;
            
            case 1:
                if ((this.estado_tabuleiro[quadrado][0] == positionColor &&
                    this.estado_tabuleiro[quadrado][2] == positionColor) ||
                    (inner_three)
                    )
                    return true;
                else return false;
            case 2:
                if ((this.estado_tabuleiro[quadrado][0] == positionColor &&
                    this.estado_tabuleiro[quadrado][1] == positionColor) ||
                    (this.estado_tabuleiro[quadrado][3] == positionColor &&
                    this.estado_tabuleiro[quadrado][4] == positionColor)
                    )
                    return true;
                else return false;

            case 3:
                if ((this.estado_tabuleiro[quadrado][2] == positionColor &&
                    this.estado_tabuleiro[quadrado][4] == positionColor) ||
                    (inner_three))
                    return true;
                else return false;
            
            case 4:
                if ((this.estado_tabuleiro[quadrado][3] == positionColor &&
                    this.estado_tabuleiro[quadrado][2] == positionColor) ||
                    (this.estado_tabuleiro[quadrado][5] == positionColor &&
                    this.estado_tabuleiro[quadrado][6] == positionColor)
                    )
                    return true;
                else return false;

            case 5:
                if ((this.estado_tabuleiro[quadrado][4] == positionColor &&
                    this.estado_tabuleiro[quadrado][6] == positionColor) ||
                    (inner_three))
                    return true;
                else return false;

            case 6:
                if ((this.estado_tabuleiro[quadrado][5] == positionColor &&
                    this.estado_tabuleiro[quadrado][4] == positionColor) ||
                    (this.estado_tabuleiro[quadrado][7] == positionColor &&
                    this.estado_tabuleiro[quadrado][0] == positionColor)
                    )
                    return true;
                else return false;
            
            case 7:
                if ((this.estado_tabuleiro[quadrado][0] == positionColor &&
                    this.estado_tabuleiro[quadrado][6] == positionColor) ||
                    (inner_three))
                    return true;
                else return false;
        }
    }

    testInnerThree(quadrado, posicao,positionColor){
        if (this.boardsize < 3) return false;
        const ilimit = 0;
        const elimit = this.boardsize - 3;
        var idx;
        if (quadrado == 0 || quadrado == 1) idx = 0;
        else idx = quadrado - 2;

        for(; idx >= ilimit && idx <= elimit; idx++){
            if(this.estado_tabuleiro[idx][posicao] == positionColor &&
               this.estado_tabuleiro[idx + 1][posicao] == positionColor &&
               this.estado_tabuleiro[idx + 2][posicao] == positionColor
            ) return true;
        }
        return false;
    }

    isMoveValid(destination_square, destination_position, origin_square, origin_position) {

        if (this.estado_tabuleiro[destination_square][destination_position] != "empty") {
            return false;
        }
        if (this.currplayer.getPieces() == 3) return true;
        else if (destination_position == origin_position &&
            (destination_square == (origin_square - 1) || destination_square == (origin_square + 1)) && 
            (destination_position == 1 || destination_position == 3 || destination_position == 5 || destination_position == 7))
            return true;
        else if (destination_square == origin_square &&
            destination_position != origin_position) {
            switch (origin_position) {
                case 0:
                    if (destination_position == 1 ||
                        destination_position == 7
                    ) return true;
                    else return false;

                case 1:
                    if (destination_position == 0 ||
                        destination_position == 2
                    ) return true;
                    else return false;

                case 2:
                    if (destination_position == 1 ||
                        destination_position == 3
                    ) return true;
                    else return false;

                case 3:
                    if (destination_position == 2 ||
                        destination_position == 4
                    ) return true;
                    else return false;

                case 4:
                    if (destination_position == 3 ||
                        destination_position == 5
                    ) return true;
                    else return false;

                case 5:
                    if (destination_position == 4 ||
                        destination_position == 6
                    ) return true;
                    else return false;

                case 6:
                    if (destination_position == 5 ||
                        destination_position == 7
                    ) return true;
                    return false;

                case 7:
                    if (destination_position == 0 ||
                        destination_position == 6
                    ) return true;
                    else return false;

            }
        }
        return false;
    }


    IsMovePossible() {
        const pieces = this.getPiecesPlaced(this.currplayer);
        for(let id = 0; id < pieces.length; id++)
        {   
            const move = pieces[id];
            const origin_square = Number(move.charAt(0));
            const origin_position = this.posicoes.indexOf(move.substring(1));
            for(let destination_square = 0; destination_square < this.boardsize; destination_square++) {
                for(let destination_position = 0; destination_position < 8; destination_position++)
                {
                    if(this.isMoveValid(destination_square, destination_position, origin_square, origin_position) == true)
                        return true;
                }
            }
        };
        return false;
                                    

    }

    getPiecesPlaced(player) {
        var occupied = [];
        for(let quadrado = 0; quadrado < this.boardsize; quadrado++) {
            for(let posicao = 0; posicao < 8; posicao++) {
                if(this.estado_tabuleiro[quadrado][posicao] ==( player.getColor())) {
                    const move_Id = quadrado.toString() + this.posicoes[posicao];
                    occupied.push(move_Id);
                }
            }
        }

        return occupied;
    }

    getPossibleMoves(pieces){
        var moves_or = [];
        var moves_dst = [];
        for (let id = 0; id < pieces.length; id++)
        {
            const origin_square = Number(pieces[id].charAt(0));
            const origin_position = this.posicoes.indexOf(pieces[id].substring(1));
            for(let destination_square = 0; destination_square < this.boardsize; destination_square++) {
                for(let destination_position = 0; destination_position < 8; destination_position++)
                {
                    if(this.isMoveValid(destination_square, destination_position, origin_square, origin_position) == true)
                    {
                        moves_dst.push(destination_square + this.posicoes[destination_position]);
                        moves_or.push(pieces[id]);
                    }
                }
            }
        }

        return [moves_or, moves_dst];
    }
    
    updateGame(phase, cell, step, nick){
        console.log("last " + laststep);
        console.log("erm actually " + step);
        switch(phase)
        {
            case "drop":
            {
                this.addPiece(cell.square, cell.position, cell.square + this.posicoes[cell.position], false);
                break;
            }
            case "move":
                if(this.turns == 2 * 3 * this.boardsize - 1) {
                    this.addPiece(cell.square, cell.position, cell.square + this.posicoes[cell.position], false);
                }
                else if(laststep == "from")
                {
                    this.originmove.square = cell.square;
                    this.originmove.position = cell.position;
                }
                else if (laststep == "to")
                {
                    this.movePiece(cell.square, cell.position, cell.square + this.posicoes[cell.position]);
                    this.originmove.square = null;
                    this.originmove.position = null;
                }
                else if (laststep == "take")
                {   
                    const parentid = document.getElementById(cell.square + this.posicoes[cell.position]);
                    const child = parentid.children[0].id;
                    this.removeOponentPiece(child, nick);
                }
            laststep = step;
            break;
        }
    }
}
