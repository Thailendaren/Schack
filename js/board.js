function PCEINDEX(pce, pceNum) {
	return (pce * 10 + pceNum);
}

var GameBoard = {};

GameBoard.pieces = new Array(BRD_SQ_NUM);
GameBoard.side = COLOURS.WHITE;
GameBoard.fiftyMove = 0;
GameBoard.hisPly = 0;
GameBoard.ply = 0;
GameBoard.enPas = 0;
GameBoard.castlePerm = 0;
GameBoard.material = new Array(2);
GameBoard.pceNum = new Array(13);
GameBoard.pList = new Array(14 * 10);
GameBoard.posKey = 0;
GameBoard.moveList = new Array(MAXDEPTH * MAXPOSITIONMOVES);    // Alla drag som går att göra
GameBoard.moveScores = new Array(MAXDEPTH * MAXPOSITIONMOVES);  // Alla drag har får ett antal poäng
GameBoard.moveListStart = new Array(MAXDEPTH);                  // Var moveList kommer att börja

function GeneratePosKey(){
    var sq = 0;
    var finalKey = 0;
    var piece = PIECES.EMPTY;
    
    for(sq = 0; sq < BRD_SQ_NUM; sq++){
        piece = GameBoard.pieces[sq];
        if(piece != PIECES.EMPTY && piece != SQUARES.OFFBOARD){
            finalKey ^= PieceKeys[(piece * 120) + sq];
        }
    }
    
    if(GameBoard.side == COLOURS.WHITE){
        finalKey ^= SideKey;
    }
    
    if(GameBoard.enPas != SQUARES.NO_SQ){
        finalKey ^= PieceKeys[GameBoard.enPas];
    }
    
    finalKey ^= CastleKeys[GameBoard.castlePerm];
    
    return finalKey;
}



// Denna funktion tömmer spelplanen
function ResetBoard(){
    var i = 0;
    for(i = 0; i <BRD_SQ_NUM; i++){                 // Denna loop gör så att alla rutor blir rutor utanför spelplanen
        GameBoard.pieces[i] = SQUARES.OFFBOARD;
    }
    
    for(i = 0; i < 64; i++){                        // Denna loop gör så att alla rutor som ska vara del av spelplanen blir det
        GameBoard.pieces[SQ120(i)] = PIECES.EMPTY;
    }
    
    for(i = 0; i < 14*120; i++){                    // Denna loop gör så att alla rutor är tomma
        GameBoard.pList[i] = PIECES.EMPTY;
    }
    
    for(i=0; i<2; i++){             // Denna loop gör så att alla rutor får materialet av typ 0
        GameBoard.material[i] = 0;
    }
    
    for(i=0; i<13; i++){            // Denna loop gör så att vi har 0 antal pjäser på planen
        GameBoard.pceNum[i] = 0;
    }
    
    GameBoard.side = COLOURS.BOTH;      // Detta gör så att sidorna inte har en bestämd färg
    GameBoard.enPas = SQUARES.NO_SQ;    // Det finns inga rutor som är kvalificeras som en passant så det sätts som ingen ruta
    GameBoard.fiftyMove = 0;            // fitftyMove blir 0 då inga drag har gjorts på den nya tomma planen än
    GameBoard.ply = 0;                  // 
    GameBoard.hisPly = 0;               // 
    GameBoard.castlePerm = 0;           // Det går inte att göra castling så det sätt till 0
    GameBoard.posKey = 0;               // posKey kommer att sättas lite senare så det blir 0 tills vidare
    GameBoard.moveListStart[GameBoard.ply] = 0; // 
}



// Denna funktion gör det möjligt att använda sig av fen positioner. Fen är, i korta ord, att man kan sätta upp spelplanen med en rad tecken
function ParseFen(fen){
    ResetBoard();           // Det första som måste göras är att tömma spelplanen så det inte blir några krockar
    
    var rank = RANKS.RANK_8;    // I schackprogrammering så börjar man med rutan i top vänster vilket är rad 8 och column A
    var file = FILES.FILE_A;    // ^^
    var piece = 0;
    var count = 0;
    var i = 0;
    var sq120 = 0;
    var fenCount = 0;
    
    while((rank >= RANKS.RANK_1) && fenCount < fen.length){
        count = 1;
        switch(fen[fenCount]){
            case 'p': piece = PIECES.bP; break;
            case 'r': piece = PIECES.bR; break;
            case 'n': piece = PIECES.bN; break;
            case 'b': piece = PIECES.bB; break;
            case 'k': piece = PIECES.bK; break;
            case 'q': piece = PIECES.bQ; break;
            case 'P': piece = PIECES.wP; break;
            case 'R': piece = PIECES.wR; break;
            case 'N': piece = PIECES.wN; break;
            case 'B': piece = PIECES.wB; break;
            case 'K': piece = PIECES.wK; break;
            case 'Q': piece = PIECES.wQ; break;

            case '1':
            case '2':
            case '3':
            case '4':
            case '5':
            case '6':
            case '7':
            case '8':
                piece = PIECES.EMPTY;
                count = fen[fenCount].charCodeAt() - '0'.charCodeAt();
                break;
                case '/':
            case ' ':
                rank--;
                file = FILES.FILE_A;
                fenCount++;
                continue;  
            default:
                console.log("FEN error");
                return;
        }
        
        for(i=0; i<count; i++) {	
			sq120 = FR2SQ(file,rank);            
            GameBoard.pieces[sq120] = piece;
			file++;
        }
        
        fenCount++;
    }
    
    GameBoard.side = (fen[fenCount] == 'w') ? COLOURS.WHITE : COLOURS.BLACK;
    fenCount += 2;
    
    for (i = 0; i < 4; i++) {
        if (fen[fenCountnt] == ' ') {
            break;
        }		
		switch(fen[fenCountnt]) {
			case 'K': GameBoard.castlePerm |= CASTLEBIT.WKCA; break;
			case 'Q': GameBoard.castlePerm |= CASTLEBIT.WQCA; break;
			case 'k': GameBoard.castlePerm |= CASTLEBIT.BKCA; break;
			case 'q': GameBoard.castlePerm |= CASTLEBIT.BQCA; break;
			default:	     break;
        }
		fenCountnt++;
	}
	fenCountnt++;	
	
	if (fen[fenCountnt] != '-') {        
		file = fen[fenCountnt].charCodeAt() - 'a'.charCodeAt();
		rank = fen[fenCountnt + 1].charCodeAt() - '1'.charCodeAt();	
		console.log("fen[fenCount]:" + fen[fenCountnt] + " File:" + file + " Rank:" + rank);	
		GameBoard.enPas = FR2SQ(file,rank);		
    }
	
	GameBoard.posKey = GeneratePosKey();
}
