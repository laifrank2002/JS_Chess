/*function Piece(type, x, y)
{
	this.type = type;
	this.x = x;
	this.y = y;
}*/

// define pieces 
var pieces = {
    NONE :          {name: "None",          image: null}, 
    WHITE_KING :    {name: "White King",    image: "white_king"}, 
    WHITE_QUEEN :   {name: "White Queen",   image: "white_queen"}, 
    WHITE_ROOK :    {name: "White Rook",    image: "white_rook"}, 
    WHITE_BISHOP :  {name: "White Bishop",  image: "white_bishop"}, 
    WHITE_KNIGHT :  {name: "White Knight",  image: "white_knight"}, 
    WHITE_PAWN :    {name: "White Pawn",    image: "white_pawn"}, 
    BLACK_KING :    {name: "Black King",    image: "black_king"}, 
    BLACK_QUEEN :   {name: "Black Queen",   image: "black_queen"}, 
    BLACK_ROOK :    {name: "Black Rook",    image: "black_rook"}, 
    BLACK_BISHOP :  {name: "Black Bishop",  image: "black_bishop"}, 
    BLACK_KNIGHT :  {name: "Black Knight",  image: "black_knight"}, 
    BLACK_PAWN :    {name: "Black Pawn",    image: "black_pawn"}, 
};