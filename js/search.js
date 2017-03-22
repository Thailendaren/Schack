var SearchController = {};

SearchController.nodes;
SearchController.fh;
SearchController.fhf;
SearchController.depth;
SearchController.time;
SearchController.start;
SearchController.stop;
SearchController.best;
SearchController.thinking;

function ClearPvTable(){
    for(i = 0; i < PVENTRIES; i++){
        GameBoard.PvTable[i].move = NOMOVE;
        GameBoard.PvTable[i].posKey = 0;
    }
}

function CheckUp(){
    if(($.now() - SearchController.start) > SearchController.time){
        SearchController.stop = true;
    }
}

function IsRepetition(){
    var i = 0;
    
    for(i = GameBoard.hisPly - GameBoard.fiftyMove; i < GameBoard.hisPly - 1; i++){
        if(GameBoard.posKey == GameBoard.history[i].posKey){
            return true;
        }
    }
    return false;
}

function AlphaBeta(alpha, beta, depth){
    if(depth <= 0){
        return EvalPosition();
    }
    
    if((SearchController.nodes & 2047) == 0){
        CheckUp();
    }
    
    SearchController.nodes++;
    
    if((IsRepetition() || GameBoard.fiftyMove >= 100) && GameBoard.ply != 0){
        return 0;
    }
    
    if(GameBoard.ply > MAXDEPTH-1){
        return EvalPosition();
    }
    
    var InCheck = SqAttacked(GameBoard.pList[PCEINDEX(Kings[GameBoard.side], 0)], GameBoard.side^1);
    if(InCheck == true){
        depth++;
    }
    
    var Score = -INF;
    
    GenerateMoves();
    
    var MoveNum = 0;
    var Legal = 0;
    var OldAlpha = alpha;
    var BestMove = NOMOVE;
    var Move = NOMOVE;
    
    // Get PvMove
    // Order PvMoce
    
    for(MoveNum = GameBoard.moveListStart[GameBoard.ply]; MoveNum < GameBoard.moveListStart[GameBoard.ply + 1]; MoveNum++){
        
        // Pick Next Best Move
        
		Move = GameBoard.moveList[MoveNum];	
		if(MakeMove(move) == false){
			continue;
		}
        Legal++;
		Score = -AlphaBeta(-beta, -alpha, depth-1);
		TakeMove();
        if(SearchController.stop == true){
            return 0;
        }
        if(Score > alpha){
            if(Score >= beta){
                if(Legal == 1){
                    SearchController.fhf++;
                }
                SearchController.fh++;
                // Update Killer Moves
                return beta;
            }
            alpha = Score;
            BestMove = Move;
            // Update History Table
        }
	}
    
    if(Legal == 0){
        if(InCheck == true){
            return -MATE + GameBoard.ply;
        }
        else{
            return 0;
        }
    }
    
    if(alpha != OldAlpha){
        StorePvMove(BestMove);
    }
    return alpha;
}

function ClearForSearch(){
    var i = 0;
    var i2 = 0;
    
    for(i = 0; i < 14 * BRD_SQ_NUM; i++){
        GameBoard.searchHistory[i] = 0;
    }
    for(i = 0; i < 3 * MAXDEPTH; i++){
        GameBoard.searchHistory[i] = 0;
    }
    ClearPvTable();
    GameBoard.ply = 0;
    SearchController.nodes = 0;
    SearchController.fh = 0;
    SearchController.fhf = 0;
    SearchController.start = $.now();
    SearchController.stop = false;
}

function SearchPosition(){
    var bestMove = NOMOVE;
    var bestScore = -INF;
    var currentDepth = 0;
    
    ClearForSearch();
    
    for(currentDepth = 1; currentDepth <= SearchController.depth; currentDepth++){
        //AB
        if(SearchController.stop == true){
            break;
        }
    }
    
    SearchController.best = bestMove;
    SearchController.thinking = false;
}