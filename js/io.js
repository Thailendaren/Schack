function PrSq(sq){
    return(FileChar[FilesBrd[sq]] + RankChar[RanksBrd[sq]])
}

function PrintMove(move){
    var MoveString;
    
    var ff = FilesBrd[FROMSQ(move)];    // ff = FileFrom. Alltså vilken column som pjäsen rör sig från
    var rf = RanksBrd[FROMSQ(move)];    // rf = RankFrom. Alltså vilken rad som pjäsen rör sig från
    var ft = FilesBrd[TOSQ(move)];      // ft = FileTo. Alltså vilken column som pjäsen rör sig till
    var rt = RanksBrd[TOSQ(move)];      // rt = RankTo. Alltså vilken rad som pjäsen rör sig till
    
    MoveString = FileChar[ff] + RankChar[rf] + FileChar[ft] + RankChar[rt];
    
    var promoted = PROMOTED(move);
    
    if(promoted != PIECES.EMPTY){
        var pchar = "q";
        if(PieceKnight[promoted] == true){
            pchar = "n";
        }
        else if(PieceRookQueen[promoted] == true && PieceBishopQueen[promoted] == false){
            pchar = "r";
        }
        else if(PieceRookQueen[promoted] == false && PieceBishopQueen[promoted] == true){
            pchar = "b";
        }
        MoveString += pchar;
    }
    return MoveString;
}

function PrintMoveList(){
    var i;
    var move;
    console.log("MoveList: ");
    
    for(i = GameBoard.moveListStart[GameBoard.ply]; i < GameBoard.moveListStart[GameBoard.ply + 1]; i++){
        move = GameBoard.moveList[i];
        console.log(PrintMove(move));
    }
}