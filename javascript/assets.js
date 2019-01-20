// loads assets
var image_library = {
	"white_king": create_image("assets/white_king.png"),
	"white_queen": create_image("assets/white_queen.png"),
	"white_rook": create_image("assets/white_rook.png"),
	"white_bishop": create_image("assets/white_bishop.png"),
	"white_knight": create_image("assets/white_knight.png"),
	"white_pawn": create_image("assets/white_pawn.png"),
	"black_king": create_image("assets/black_king.png"),
	"black_queen": create_image("assets/black_queen.png"),
	"black_rook": create_image("assets/black_rook.png"),
	"black_bishop": create_image("assets/black_bishop.png"),
	"black_knight": create_image("assets/black_knight.png"),
	"black_pawn": create_image("assets/black_pawn.png"),
}

function create_image(path) 
{
	var image = document.createElement("IMG");
	image.src = path;

	return image;
}