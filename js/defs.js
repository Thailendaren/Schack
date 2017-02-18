//  *********************************************************************************
//  * defs = Defenitions så i denna fil defineras många stora variablar och arrayer *
//  *********************************************************************************



// Här defineras alla spelpjäser
// På varje ruta så kommer det stå ett nummer mellan 0 och 12 vilket då representerar olika pjäser eller en tom ruta
// P = Pawn (bonde)
// N = kNight (häst)
// B = Bishop (präst)
// R = Rook (torn)
// Q = Queen (drottning)
// K = King (kung)
var PIECES =  { EMPTY : 0,                                              // 0 betyder att rutan är TOM
               wP : 1, wN : 2, wB : 3,wR : 4, wQ : 5, wK : 6,           // Denna rad innehåller VITA pjäser (w = White)
               bP : 7, bN : 8, bB : 9, bR : 10, bQ : 11, bK : 12  };    // Denna rad innehåller SVARTA pjäser (b = Black)



// Här defineras alla rutor på spelplanen
// Anledningen till varför det är 120 rutor istället för 64 som på ett vanligt schackbräde förklaras i _____
var BRD_SQ_NUM = 120;   // BRD_SQ_NUM = Board Square Number



// Här defineras alla rader och kolumner
// I schackprogrammering brukar man kalla rader för "ranks" och kolumner för "files"
//
var FILES =  { FILE_A:0, FILE_B:1, FILE_C:2, FILE_D:3, FILE_E:4, FILE_F:5, FILE_G:6, FILE_H:7, FILE_NONE:8 };   // Denna rad är alltså alla kolumner
var RANKS =  { RANK_1:0, RANK_2:1, RANK_3:2, RANK_4:3, RANK_5:4, RANK_6:5, RANK_7:6, RANK_8:7, RANK_NONE:8 };   // Denna rad är alltså alla rader



// Här defineras färgerna
var COLOURS = { WHITE:0, BLACK:1, BOTH:2 };



//
var CASTLEBIT = { WKCA : 1, WQCA : 2, BKCA : 4, BQCA : 8 };



// Här defineras några viktiga rutor på planen
// Anledningen till varför dessa rutor är vikitiga förklaras i _____
var SQUARES = {A1:21, B1:22, C1:23, D1:24, E1:25, F1:26, G1:27, H1:28,  // Detta är den ÖVERSTA raden på spelplanen
               A8:91, B8:92, C8:93, D8:94, E8:95, F8:96, G8:97, H8:98,  // Detta är den NEDERSTA raden på spelplanen
               NO_SQ:99, OFFBOARD:100};                                 // Rutor som inte är med på spelplanen



// Max antal ___ definitioner
var MAXGAMEMOVES = 2048;    // Här säger jag åt programmet att det kan inte vara fler än 2048 drag per match. Enligt wikipedia så var det längsta officiella spelet 269 drag så 2048 är mer än nog
var MAXPOSITIONMOVES = 256; // Här säger jag åt programmet att det kan inte finnas fler än 256 olika drag man kan göra för varje position
var MAXDEPTH = 64;          // Här säger jag åt programmet att det ändast är 64 rutor som den ska analyzera för framtida drag



//
var FilesBrd = new Array(BRD_SQ_NUM);
var RanksBrd = new Array(BRD_SQ_NUM);

function FR2SQ(f,r) {
 	return ( (21 + (f) ) + ( (r) * 10 ) );
}

var PieceBig = [false, false, true, true, true, true, true, false, true, true, true, true, true];
var PieceMaj = [false, false, false, false, true, true, true, false, false, false, true, true, true];
var PieceMin = [false, false, true, true, false, false, false, false, true, true, false, false, false];
var PieceVal = [0, 100, 325, 325, 550, 1000, 50000, 100, 325, 325, 550, 1000, 50000];
var PieceCol = [COLOURS.BOTH, COLOURS.WHITE, COLOURS.WHITE, COLOURS.WHITE, COLOURS.WHITE, COLOURS.WHITE, COLOURS.WHITE, COLOURS.BLACK, COLOURS.BLACK, COLOURS.BLACK, COLOURS.BLACK, COLOURS.BLACK, COLOURS.BLACK];
	
var PiecePawn = [false, true, false, false, false, false, false, true, false, false, false, false, false];	
var PieceKnight = [false, false, true, false, false, false, false, false, true, false, false, false, false];
var PieceKing = [false, false, false, false, false, false, true, false, false, false, false, false, true];
var PieceRookQueen = [false, false, false, false, true, true, false, false, false, false, true, true, false];
var PieceBishopQueen = [false, false, false, true, false, true, false, false, false, true, false, true, false];
var PieceSlides = [false, false, false, true, true, true, false, false, false, true, true, true, false];

var PieceKeys = new Array(14 * 120);
var SideKey;
var CastleKeys = new Array(16);

var Sq120ToSq64 = new Array(BRD_SQ_NUM);
var Sq64ToSq120 = new Array(64);

// I denna funktion generaras random nummer bland de 32 bitar som programmet har att jobba med. De tre första flyttas även åt vänster olika långt
function RAND_32() {
	return (Math.floor((Math.random()*255)+1) << 23) | (Math.floor((Math.random()*255)+1) << 16) | (Math.floor((Math.random()*255)+1) << 8) | Math.floor((Math.random()*255)+1);
}

function SQ64(sq120){
    return Sq120ToSq64[(sq120)];
}

function SQ120(sq64){
    return Sq64ToSq120[(sq64)];
}
