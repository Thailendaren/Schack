function ProbePvTable(){
    var i = GameBoard.posKey % PVENTREIS;
    
    if(GameBoard.PvTable[i].posKey == GameBoard.posKey){
        return GameBoard.PvTable[i].move;
    }
    return NOMOVE;
}

function StorePvMove(){
    var i = GameBoard.posKey % PVENTREIS;
    GameBoard.PvTable[i].posKey = GameBoard.posKey;
    GameBoard.PvTable[i].move = move;
}