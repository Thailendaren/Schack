function PCEINDEX(pce, pceNum) {
	return (pce * 10 + pceNum);
}

var GameBoard = {};

GameBoard.pieces = new Array(BRD_SQ_NUM);
GameBoard.side = COLOURS.WHITE;
GameBoard.fiftyMove = 0;
GameBoard.hisPly = 0;
GameBoard.history = [];
GameBoard.ply = 0;              // Ply är antalet drag som hittas i sökträdet
GameBoard.enPas = 0;
GameBoard.castlePerm = 0;
GameBoard.material = new Array(2);
GameBoard.pceNum = new Array(13);
GameBoard.pList = new Array(14 * 10);
GameBoard.posKey = 0;
GameBoard.moveList = new Array(MAXDEPTH * MAXPOSITIONMOVES);    // Alla drag som går att göra
GameBoard.moveScores = new Array(MAXDEPTH * MAXPOSITIONMOVES);  // Alla drag har får ett antal poäng
GameBoard.moveListStart = new Array(MAXDEPTH);                  // Var moveList kommer att börja

function CheckBoard(){
    var t_pceNum = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    var t_material = [0, 0];
    var sq64, t_piece, t_pce_num, sq120, pCount;
    
    for(t_piece = PIECES.wP; t_piece <= PIECES.bK; t_piece++) {
		for(t_pce_num = 0; t_pce_num < GameBoard.pceNum[t_piece]; t_pce_num++) {
			sq120 = GameBoard.pList[PCEINDEX(t_piece,t_pce_num)];
			if(GameBoard.pieces[sq120] != t_piece) {
				console.log('Error Pce Lists');
				return false;
			}
		}
	}
    
    for(sq64 = 0; sq64 < 64; sq64++) {
		sq120 = SQ120(sq64);
		t_piece = GameBoard.pieces[sq120];
		t_pceNum[t_piece]++;
		t_material[PieceCol[t_piece]] += PieceVal[t_piece];
	}
	
	for(t_piece = PIECES.wP; t_piece <= PIECES.bK; t_piece++) {
		if(t_pceNum[t_piece] != GameBoard.pceNum[t_piece]) {
				console.log('Error t_pceNum');
				return false;
			}	
	}
	
	if(t_material[COLOURS.WHITE] != GameBoard.material[COLOURS.WHITE] || t_material[COLOURS.BLACK] != GameBoard.material[COLOURS.BLACK]) {
				console.log('Error t_material');
				return false;
	}	
	
	if(GameBoard.side != COLOURS.WHITE && GameBoard.side != COLOURS.BLACK) {
				console.log('Error GameBoard.side');
				return false;
	}
	
	if(GeneratePosKey() != GameBoard.posKey) {
				console.log('Error GameBoard.posKey');
				return false;
	}	
	return true;
}

function PrintBoard(){
    var sq, file,rank, piece;
    console.log("\nGame Board:\n");
    
    for(rank = RANKS.RANK_8; rank >= RANKS.RANK_1; rank--){
        var line = (RankChar[rank] + "  ");
        for(file = FILES.FILE_A; file <= FILES.FILE_H; file++){
            sq = FR2SQ(file,rank);
            piece = GameBoard.pieces[sq];
            line += (" " + PceChar[piece] + " ");
        }
        console.log(line);
    }
    console.log("");
    var line = "   ";
    for(file = FILES.FILE_A; file <= FILES.FILE_H; file++){
        line += (" " + FileChar[file] + " ");
    }
    console.log(line);
    console.log("side:" + SideChar[GameBoard.side]);
    console.log("enPas:" + GameBoard.enPas);
    line = "";
    
    if(GameBoard.castlePerm & CASTLEBIT.WKCA) line += "K";
    if(GameBoard.castlePerm & CASTLEBIT.WQCA) line += "Q";
    if(GameBoard.castlePerm & CASTLEBIT.BKCA) line += "k";
    if(GameBoard.castlePerm & CASTLEBIT.BQCA) line += "q";
    console.log("castle:" + line);
    console.log("key:" + GameBoard.posKey.toString(16));
}

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


// Denna function skriver ut alla pjäser som den hittar i UpdateListsMaterial() i konsolen
function PrintPieceLists(){
    var piece, pceNum;
    
    for(piece = PIECES.wP; piece <= PIECES.bK; piece++){
        for(pceNum = 0; pceNum < GameBoard.pceNum[piece]; pceNum++){
            console.log("Piece " + PceChar[piece] + " on " + PrSq(GameBoard.pList[PCEINDEX(piece, pceNum)]));
        }
    }
}




// Programmet letar efter alla pjäser och deras värden
// De tre första for-looparna är tagna från ResetBoard() och inklistrade här istället för performance reasons
function UpdateListsMaterial(){
    var piece, sq, i, colour;
    
    for(i = 0; i < 14*120; i++){                    // Denna loop gör så att alla rutor är tomma
        GameBoard.pList[i] = PIECES.EMPTY;
    }
    
    for(i=0; i<2; i++){             // Denna loop gör så att alla rutor får materialet av typ 0
        GameBoard.material[i] = 0;
    }
    
    for(i=0; i<13; i++){            // Denna loop gör så att vi har 0 antal pjäser på planen
        GameBoard.pceNum[i] = 0;
    }
    
    for(i = 0; i < 64; i++){
        sq = SQ120(i);
        piece = GameBoard.pieces[sq];
        if(piece != PIECES.EMPTY){
            colour = PieceCol[piece];
            GameBoard.material[colour] += PieceVal[piece];
            GameBoard.pList[PCEINDEX(piece, GameBoard.pceNum[piece])] = sq;
            GameBoard.pceNum[piece]++;
        }
    }
    PrintPieceLists();
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
    
    // Denna loop går genom alla tecken i en fen string. När den hittar ett tecken kommer den antingen att plasera en pjäs i en ruta eller hoppa över ett antal rutor
    while((rank >= RANKS.RANK_1) && fenCount < fen.length){
        count = 1;
        switch(fen[fenCount]){
            // Hittar den en bokstav så kommer den att plasera en pjäs
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
            //Hittar den ett nummer så kommer den att hoppa över ett antal rutor
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
            case '/':   // Ett snedstreck betyer att raden med rutor är slut och att loopen ska börja på nästa rad
            case ' ':   // Hittar den ett mellanslag så betyder det att en anna del i fen stringen börjar
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
        if (fen[fenCount] == ' ') {
            break;
        }		
		switch(fen[fenCount]) {
			case 'K': GameBoard.castlePerm |= CASTLEBIT.WKCA; break;
			case 'Q': GameBoard.castlePerm |= CASTLEBIT.WQCA; break;
			case 'k': GameBoard.castlePerm |= CASTLEBIT.BKCA; break;
			case 'q': GameBoard.castlePerm |= CASTLEBIT.BQCA; break;
			default:	     break;
        }
		fenCount++;
	}
	fenCount++;	
	
	if (fen[fenCount] != '-') {        
		file = fen[fenCount].charCodeAt() - 'a'.charCodeAt();
		rank = fen[fenCount + 1].charCodeAt() - '1'.charCodeAt();	
		console.log("fen[fenCount]:" + fen[fenCount] + " File:" + file + " Rank:" + rank);	
		GameBoard.enPas = FR2SQ(file,rank);		
    }
	
	GameBoard.posKey = GeneratePosKey();
    UpdateListsMaterial();
    //SqAttacked();
    PrintSqAttacked();
}



function PrintSqAttacked(){
    var sq, file, rank, piece;
    console.log("\nAttacked:\n")
    
    for(rank = RANKS.RANK_8; rank >= RANKS.RANK_1; rank--){
        var line = ((rank + 1) + "  ");
        for(file = FILES.FILE_A; file <= FILES.FILE_H; file++){
            sq = FR2SQ(file, rank);
            if(SqAttacked(sq, GameBoard.side) == true){
                piece = "X";
            }
            else{
                piece = "-";
            }
            line += (" " + piece + " ");
        }
        console.log(line);
    }
    console.log("");
}



// Denna funktion kollar om en ruta blir attackerad eller inte
function SqAttacked(sq, side){
    var pce;
    var t_sq;
    var i;
    
    // Här söker den efter om några bönder attackerar
    if(side == COLOURS.WHITE){
        if(GameBoard.pieces[sq - 11] == PIECES.wP || GameBoard.pieces[sq - 9] == PIECES.wP){
            return true;
        }
    }
    else{
        if(GameBoard.pieces[sq + 11] == PIECES.bP || GameBoard.pieces[sq + 9] == PIECES.bP){
            return true;
        }
    }
    
    // Här söker den efter om några hästar attackerar
    for(i = 0; i < 8; i++) {
		pce = GameBoard.pieces[sq + KnDir[i]];
		if(pce != SQUARES.OFFBOARD && PieceCol[pce] == side && PieceKnight[pce] == true){
			return true;
		}
	}
    
    // Här söker den efter om några torn attackerar
    for(i = 0; i < 4; i++){
        dir = RkDir[i];
        t_sq = sq + dir;
        pce = GameBoard.pieces[t_sq]
        while(pce != SQUARES.OFFBOARD){
            if(pce != PIECES.EMPTY){
                if(PieceRookQueen[pce] == true && PieceCol[pce] == side){
                    return true;
                }
                break;
            }
            t_sq += dir;
            pce = GameBoard.pieces[t_sq];
        }
    }
    
    // Här söker den efter om några löpare attackerar
    for(i = 0; i < 4; i++){
        dir = BiDir[i];
        t_sq = sq + dir;
        pce = GameBoard.pieces[t_sq]
        while(pce != SQUARES.OFFBOARD){
            if(pce != PIECES.EMPTY){
                if(PieceBishopQueen[pce] == true && PieceCol[pce] == side){
                    return true;
                }
                break;
            }
            t_sq += dir;
            pce = GameBoard.pieces[t_sq];
        }
    }
    
    // Här söker den efter om några kungar attackerar
    for(i = 0; i < 8; i++){
        pce = GameBoard.pieces[sq + KiDir[i]];
        if(pce != SQUARES.OFFBOARD && PieceCol[pce] == side && PieceKing[pce] == true){
            return true;
        }
    }
    // Hittar programmet inga pjäser som attackerar så kommer funktionen att returnera false
    return false;
}
