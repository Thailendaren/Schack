$(function() {
	init();
	console.log("Main Init Called");	
	ParseFen(START_FEN);
	PrintBoard();
});

function InitFilesRanksBrd() {
	
	var i = 0;
	var file = FILES.FILE_A;
	var rank = RANKS.RANK_1;
	var sq = SQUARES.A1;
	
	for(i = 0; i < BRD_SQ_NUM; i++) {
		FilesBrd[i] = SQUARES.OFFBOARD;
		RanksBrd[i] = SQUARES.OFFBOARD;
	}
	
	for(rank = RANKS.RANK_1; rank <= RANKS.RANK_8; ++rank) {
		for(file = FILES.FILE_A; file <= FILES.FILE_H; ++file) {
			sq = FR2SQ(file,rank);
			FilesBrd[sq] = file;
			RanksBrd[sq] = rank;
		}
    }
}

function InitHashKeys() {
    var i = 0;
    
    for(i = 0; i < 14 * 120; i++){
        PieceKeys[i] = RAND_32();
    }
    
    SideKey = RAND_32();
    
    for(i = 0; i < 16; i++){
        CastleKeys[i] = RAND_32();
    }
}

function InitSq120To64(){
    var i = 0;
    var file = FILES.FILE_A;
    var rank = RANKS.RANK_1;
    var sq = SQUARES.A1;
    var sq64 = 0;
    
    for(i = 0; i < BRD_SQ_NUM; i++){
        Sq120ToSq64[i] = 65;
    }
    
    for(i = 0; i < 64; i++){
        Sq64ToSq120[i] = 120;
    }
    
    for(rank = RANKS.RANK_1; rank <= RANKS.RANK_8; rank++) {
		for(file = FILES.FILE_A; file <= FILES.FILE_H; file++) {
			sq = FR2SQ(file,rank);
			Sq64ToSq120[sq64] = sq;
			Sq120ToSq64[sq] = sq64;
			sq64++;
		}
	}
}

function InitBoardVars(){
    var i;
    
    for(i = 0; i < MAXGAMEMOVES; i++){
        GameBoard.history.push({move : NOMOVE, castlePerm : 0, enPas : 0, fiftyMove : 0, posKey : 0});
    }
}

function init() {
	console.log("init() called");
	InitFilesRanksBrd();
    InitHashKeys();
    InitSq120To64();
    InitBoardVars();
}