var perft_leafNodes;

function Perft(depth){ 	
	if(depth == 0){
        perft_leafNodes++;
        return;
    }	
    
    GenerateMoves();
    
	var i;
	var move;
	
	for(i = GameBoard.moveListStart[GameBoard.ply]; i < GameBoard.moveListStart[GameBoard.ply + 1]; i++){
		move = GameBoard.moveList[i];	
		if(MakeMove(move) == false){
			continue;
		}		
		Perft(depth-1);
		TakeMove();
	}
    return;
}

function PerftTest(depth){    
	PrintBoard();
	console.log("Starting Test To Depth:" + depth);	
	perft_leafNodes = 0;

	var i;
	var move;
	var moveNum = 0;
	for(i = GameBoard.moveListStart[GameBoard.ply]; i < GameBoard.moveListStart[GameBoard.ply + 1]; i++) {
		move = GameBoard.moveList[i];	
		if(MakeMove(move) == false) {
			continue;
		}	
		moveNum++;	
        var cumnodes = perft_leafNodes;
		Perft(depth-1);
		TakeMove();
		var oldnodes = perft_leafNodes - cumnodes;
        console.log("move:" + moveNum + " " + PrMove(move) + " " + oldnodes);
	}
    
	console.log("Test Complete : " + perft_leafNodes + " leaf nodes visited");      

    return;
}