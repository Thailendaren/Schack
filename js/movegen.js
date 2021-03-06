// Följande fyra funktioner är de tre olika dragen som man kan göra
function MOVE(from, to, captured, promoted, flag){
    return(from | (to << 7) | (captured << 14) | (promoted << 20) | flag);
}

function AddCaptureMove(move){
    GameBoard.moveList[GameBoard.moveListStart[GameBoard.ply + 1]] = move;
    GameBoard.moveScores[GameBoard.moveListStart[GameBoard.ply + 1]++] = 0;
}

function AddQuietMove(move){
    GameBoard.moveList[GameBoard.moveListStart[GameBoard.ply + 1]] = move;
    GameBoard.moveScores[GameBoard.moveListStart[GameBoard.ply + 1]++] = 0;
}

function AddEnPassantMove(move){
    GameBoard.moveList[GameBoard.moveListStart[GameBoard.ply + 1]] = move;
    GameBoard.moveScores[GameBoard.moveListStart[GameBoard.ply + 1]++] = 0;
}

function AddWhitePawnCaptureMove(from, to, cap){
    if(RanksBrd[from] == RANKS.RANK_7){
        AddCaptureMove(MOVE(from, to, cap, PIECES.wQ, 0));
        AddCaptureMove(MOVE(from, to, cap, PIECES.wR, 0));
        AddCaptureMove(MOVE(from, to, cap, PIECES.wB, 0));
        AddCaptureMove(MOVE(from, to, cap, PIECES.wN, 0));
    }
    else{
        AddCaptureMove(MOVE(from, to, cap, PIECES.EMPTY, 0));
    }
}

function AddBlackPawnCaptureMove(from, to, cap){
    if(RanksBrd[from] == RANKS.RANK_2){
        AddCaptureMove(MOVE(from, to, cap, PIECES.bQ, 0));
        AddCaptureMove(MOVE(from, to, cap, PIECES.bR, 0));
        AddCaptureMove(MOVE(from, to, cap, PIECES.bB, 0));
        AddCaptureMove(MOVE(from, to, cap, PIECES.bN, 0));
    }
    else{
        AddCaptureMove(MOVE(from, to, cap, PIECES.EMPTY, 0));
    }
}

function AddWhitePawnQuietMove(from, to){
    if(RanksBrd[from] == RANKS.RANK_7){
        AddQuietMove(MOVE(from, to, PIECES.EMPTY, PIECES.wQ, 0));
        AddQuietMove(MOVE(from, to, PIECES.EMPTY, PIECES.wR, 0));
        AddQuietMove(MOVE(from, to, PIECES.EMPTY, PIECES.wB, 0));
        AddQuietMove(MOVE(from, to, PIECES.EMPTY, PIECES.wN, 0));
    }
    else{
        AddQuietMove(MOVE(from, to, PIECES.EMPTY, PIECES.EMPTY, 0));
    }
}

function AddBlackPawnQuietMove(from, to){
    if(RanksBrd[from] == RANKS.RANK_2){
        AddQuietMove(MOVE(from, to, PIECES.EMPTY, PIECES.bQ, 0));
        AddQuietMove(MOVE(from, to, PIECES.EMPTY, PIECES.bR, 0));
        AddQuietMove(MOVE(from, to, PIECES.EMPTY, PIECES.bB, 0));
        AddQuietMove(MOVE(from, to, PIECES.EMPTY, PIECES.bN, 0));
    }
    else{
        AddQuietMove(MOVE(from, to, PIECES.EMPTY, PIECES.EMPTY, 0));
    }
}


// Denna funktion hittar de olika drag som alla olika pjäser kan göra
function GenerateMoves(){
    GameBoard.moveListStart[GameBoard.ply + 1] = GameBoard.moveListStart[GameBoard.ply];
    
    var pceType;
    var pceNum;
    var sq;
    var pceIndex;
    var pce;
    var t_sq;
    var dir;
    
    
    
    // Sökmotor för bönders drag
    // Vita bönder
    if(GameBoard.side == COLOURS.WHITE){
        pceType = PIECES.wP;
        
        for(pceNum = 0; pceNum < GameBoard.pceNum[pceType]; pceNum++){
            sq = GameBoard.pList[PCEINDEX(pceType, pceNum)];
            
            if(GameBoard.pieces[sq + 10] == PIECES.EMPTY){
                AddWhitePawnQuietMove(sq, sq + 10);     // Bonde Normalt Drag
                if(RanksBrd[sq] == RANKS.RANK_2 && GameBoard.pieces[sq + 20] == PIECES.EMPTY){
                    AddQuietMove(MOVE(sq, sq + 20, PIECES.EMPTY, PIECES.EMPTY, MFLAGPS));
                }
            }
            
            if(SQOFFBOARD(sq + 9) == false && PieceCol[GameBoard.pieces[sq + 9]] == COLOURS.BLACK){
                AddWhitePawnCaptureMove(sq, sq + 9, GameBoard.pieces[sq + 9]);   // Bonde attack
            }
            if(SQOFFBOARD(sq + 11) == false && PieceCol[GameBoard.pieces[sq + 11]] == COLOURS.BLACK){
                AddWhitePawnCaptureMove(sq, sq + 11, GameBoard.pieces[sq + 11]);   // Bonde attack
            }
            
            if(GameBoard.enPas != SQUARES.NO_SQ){
                if(sq + 9 == GameBoard.enPas){
                    AddEnPassantMove(MOVE(sq, sq + 9, PIECES.EMPTY, PIECES.EMPTY, MFLAGEP));
                }
                if(sq + 11 == GameBoard.enPas){
                    AddEnPassantMove(MOVE(sq, sq + 11, PIECES.EMPTY, PIECES.EMPTY, MFLAGEP));
                }
            }
        }
        
        // Bygga bord drag
        if(GameBoard.castlePerm & CASTLEBIT.WKCA){
            if(GameBoard.pieces[SQUARES.F1] == PIECES.EMPTY && GameBoard.pieces[SQUAERS.G1] == PIECES.EMPTY){
                if(SqAttacked(SQUARES.F1, COLOURS.BLACK) == false && SqAttacked(SQUARES.E1, COLOURS.BLACK) == false){
                    AddQuietMove(MOVE(SQUARES.E1, SQUARES.C1, PIECES.EMPTY, PIECES.EMPTY, MFLAGCA));
                }
            }
        }
        if(GameBoard.castlePerm & CASTLEBIT.WQCA){
            if(GameBoard.pieces[SQUARES.D1] == PIECES.EMPTY && GameBoard.pieces[SQUAERS.C1] == PIECES.EMPTY && GameBoard.pieces[SQUAERS.B1] == PIECES.EMPTY){
                if(SqAttacked(SQUARES.D1, COLOURS.BLACK) == false && SqAttacked(SQUARES.E1, COLOURS.BLACK) == false){
                    AddQuietMove(MOVE(SQUARES.E1, SQUARES.G1, PIECES.EMPTY, PIECES.EMPTY, MFLAGCA));
                }
            }
        }
        
        
    }
    // Svarta bönder
    else{
        pceType = PIECES.bP;
        
        for(pceNum = 0; pceNum < GameBoard.pceNum[pceType]; pceNum++){
            sq = GameBoard.pList[PCEINDEX(pceType, pceNum)];
            
            if(GameBoard.pieces[sq - 10] == PIECES.EMPTY){
                AddBlackPawnQuietMove(sq, sq - 10);     // Bonde Normalt Drag
                if(RanksBrd[sq] == RANKS.RANK_7 && GameBoard.pieces[sq - 20] == PIECES.EMPTY){
                    AddQuietMove(MOVE(sq, sq - 20, PIECES.EMPTY, PIECES.EMPTY, MFLAGPS));
                }
            }
            
            if(SQOFFBOARD(sq - 9) == false && PieceCol[GameBoard.pieces[sq - 9]] == COLOURS.BLACK){
                AddBlackPawnCaptureMove(sq, sq - 9, GameBoard.pieces[sq - 9])// Bonde attack
            }
            if(SQOFFBOARD(sq - 11) == false && PieceCol[GameBoard.pieces[sq - 11]] == COLOURS.BLACK){
                AddBlackPawnCaptureMove(sq, sq - 11, GameBoard.pieces[sq - 11])// Bonde attack
            }
            
            if(GameBoard.enPas != SQUARES.NO_SQ){
                if(sq - 9 == GameBoard.enPas){
                    AddEnPassantMove(MOVE(sq, sq - 9, PIECES.EMPTY, PIECES.EMPTY, MFLAGEP));
                }
                if(sq - 11 == GameBoard.enPas){
                    AddEnPassantMove(MOVE(sq, sq - 11, PIECES.EMPTY, PIECES.EMPTY, MFLAGEP));
                }
            }
        }
        
        // Bygga borg drag
        if(GameBoard.castlePerm & CASTLEBIT.BKCA){
            if(GameBoard.pieces[SQUARES.F8] == PIECES.EMPTY && GameBoard.pieces[SQUARES.G8] == PIECES.EMPTY){
                if(SqAttacked(SQUARES.F8, COLOURS.WHITE) == false && SqAttacked(SQUARES.E8, COLOURS.WHITE) == false){
                    AddQuietMove(MOVE(SQUARES.E8, SQUARES.G8, PIECES.EMPTY, PIECES.EMPTY, MFLAGCA));
                }
            }
        }
        if(GameBoard.castlePerm & CASTLEBIT.BQCA){
            if(GameBoard.pieces[SQUARES.D8] == PIECES.EMPTY && GameBoard.pieces[SQUARES.C8] == PIECES.EMPTY && GameBoard.pieces[SQUAERS.B8] == PIECES.EMPTY){
                if(SqAttacked(SQUARES.D8, COLOURS.WHITE) == false && SqAttacked(SQUARES.E8, COLOURS.WHITE) == false){
                    AddQuietMove(MOVE(SQUARES.E8, SQUARES.C8, PIECES.EMPTY, PIECES.EMPTY, MFLAGCA));
                }
            }
        }
    }
    
    
    
    // Tar fram olika drag för pjäser som INTE "glider" fram
    // Dessa pjäser är hästar, kungar och bönder
    // Koden för bönder har redan skrivits ovan så följande är koden för hästar och kungar
    pceIndex = LoopNonSlideIndex[GameBoard.side];
    pce = LoopNonSlidePce[pceIndex++];
    
    while(pce != 0){
        for(pceNum = 0; pceNum < GameBoard.pceNum[pce]; pceNum++){
            sq = GameBoard.pList[PCEINDEX(pce, pceNum)];
            for(i = 0; i < DirNum[pce]; i++){
                dir = PceDir[pce][i];
                t_sq = sq + dir;
                if(SQOFFBOARD(t_sq) == true){
                    continue;
                }
                if(GameBoard.pieces[t_sq != PIECES.EMPTY]){
                    if(PieceCol[GameBoard.pieces[t_sq]] != GameBoard.side){
                        AddCaptureMove(MOVE(sq, t_sq, PIECES.EMPTY, PIECES.EMPTY, 0));
                    }
                }
                else{
                    AddQuietMove(MOVE(sq, t_sq, GameBoard.pieces[t_sq], PIECES.EMPTY, 0));
                }
            }
        }
        pce = LoopNonSlidePce[pceIndex++];
    }
    
    
    
    // Tar fram olika drag för pjäser som "glider" fram
    // Dessa pjäser är löpare, torn och damer
    pceIndex = LoopSlideIndex[GameBoard.side];
    pce = LoopSlidePce[pceIndex++];
    
    while(pce != 0){
        for(pceNum = 0; pceNum < GameBoard.pceNum[pce]; pceNum++){
            sq = GameBoard.pList[PCEINDEX(pce, pceNum)];
            for(i = 0; i < DirNum[pce]; i++){
                dir = PceDir[pce][i];
                t_sq = sq + dir;
                
                while(SQOFFBOARD(t_sq) == false){
                    if(GameBoard.pieces[t_sq != PIECES.EMPTY]){
                        if(PieceCol[GameBoard.pieces[t_sq]] != GameBoard.side){
                            AddCaptureMove(MOVE(sq, t_sq, GameBoard.pieces[t_sq], PIECES.EMPTY, 0));
                        }
                        break;
                    }
                    AddQuietMove(MOVE(sq, t_sq, PIECES.EMPTY, PIECES.EMPTY, 0));
                    t_sq += dir;
                }
            }
        pce = LoopSlidePce[pceIndex++];
        }
    }
}