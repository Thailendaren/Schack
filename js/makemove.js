function ClearPiece(sq){
    var pce = GameBoard.pieces[sq];
    var color = PieceCol[pce];
    var i;
    var t_pceNum = -1;
    
    HashPiece(pce, sq);
    
    GameBoard.pieces[sq] = PIECES.EMPTY;
    GameBoard. material[color] -= PieceVal[pce];
    
    for(i = 0; i < GameBoard.pceNum[pce]; i++){
        if(GameBoard.pList[PCEINDEX(pce, i)] == sq){
            t_pceNum = i;
            break;
        }
    }
    
    GameBoard.pceNum[pce]--;
    GameBoard.pList[PCEINDEX(pce, t_pceNum)] = GameBoard.pList[PCEINDEX(pce, GameBoard.pceNum[pce])];
}

function AddPiece(sq, pce){
    var color = PieceCol;
    
    HashPiece(pce, sq);
    
    GameBoard.pieces[sq] = pce;
    GameBoard.material[color] += PieceVal[pce];
    GameBoard.pList[PCEINDEX(pce, GameBoard.pceNum[pce])] = sq;
    GameBoard.pceNum[pce]++;
}

function MovePiece(from, to){
    var i;
    var pce = GameBoard.pieces[from];
    
    HashPiece(pce, from);
    GameBoard.pieces[from] = PIECES.EMPTY;
    
    HashPiece(pce, to);
    GameBoard.pieces[to] = pce;
    
    for(i=0; i < GameBoard.pceNum[pce]; i++){
        if(GameBoard.pList[PCEINDEX(pce, i)] == from){
            GameBoard.pList[PCEINDEX(pce, i)] = to;
            break;
        }
    }
}

function MakeMove(move){
    var from = FROMSQ(move);
    var to = TOSQ(move);
    var side = GameBoard.side;	

	GameBoard.history[GameBoard.hisPly].posKey = GameBoard.posKey;

	if( (move & MFLAGEP) != 0){
		if(side == COLOURS.WHITE){
			ClearPiece(to-10);
		}
        else{
			ClearPiece(to+10);
		}
	} else if( (move & MFLAGCA) != 0){
		switch(to){
			case SQUARES.C1:
                MovePiece(SQUARES.A1, SQUARES.D1);
			break;
            case SQUARES.C8:
                MovePiece(SQUARES.A8, SQUARES.D8);
			break;
            case SQUARES.G1:
                MovePiece(SQUARES.H1, SQUARES.F1);
			break;
            case SQUARES.G8:
                MovePiece(SQUARES.H8, SQUARES.F8);
			break;
            default: break;
		}
	}
	
	if(GameBoard.enPas != SQUARES.NO_SQ) HASH_EP();
	HashCastle();
	
	GameBoard.history[GameBoard.hisPly].move = move;
    GameBoard.history[GameBoard.hisPly].fiftyMove = GameBoard.fiftyMove;
    GameBoard.history[GameBoard.hisPly].enPas = GameBoard.enPas;
    GameBoard.history[GameBoard.hisPly].castlePerm = GameBoard.castlePerm;
    
    GameBoard.castlePerm &= CastlePerm[from];
    GameBoard.castlePerm &= CastlePerm[to];
    GameBoard.enPas = SQUARES.NO_SQ;
    
    HashCastle();
    
    var captured = CAPTURED(move);
    GameBoard.fiftyMove++;
    
    if(captured != PIECES.EMPTY){
        ClearPiece(to);
        GameBoard.fiftyMove = 0;
    }
    
    GameBoard.hisPly++;
	GameBoard.ply++;
	
	if(PiecePawn[GameBoard.pieces[from]] == true){
        GameBoard.fiftyMove = 0;
        if( (move & MFLAGPS) != 0){
            if(side==COLOURS.WHITE){
                GameBoard.enPas=from+10;
            }
            else{
                GameBoard.enPas=from-10;
            }
            HashEnPas();
        }
    }
    
    MovePiece(from, to);
    
    var prPce = PROMOTED(move);
    if(prPce != PIECES.EMPTY){       
        ClearPiece(to);
        AddPiece(to, prPce);
    }
    
    GameBoard.side ^= 1;
    HashPiece();
    
    if(SqAttacked(GameBoard.pList[PCEINDEX(Kings[side],0)], GameBoard.side)){
        // TakeMove();
    	return false;
    }
    
    return true;
}