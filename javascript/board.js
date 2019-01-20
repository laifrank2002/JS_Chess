// to do
// promote
// en passant
// castling
// attacks
// movement when "taking" a piece
var Board = (
	function()
	{
		var width = 8;
		var height = 8;
		
		var map = [];
		return {
			get width() { return width },
			get height() { return height },
			
			get map() { return map },
			
			initialize: function()
			{
				Engine.log("Initializing board...");
				for (var x = 0; x < width; x++)
				{
					var column = [];
					for (var y = 0; y < height; y++)
					{
						column.push({piece:pieces.NONE});
					}
					map.push(column);
					
				}
				
				// init setup
				map[0][0].piece = pieces.WHITE_ROOK;
				map[1][0].piece = pieces.WHITE_KNIGHT;
				map[2][0].piece = pieces.WHITE_BISHOP;
				map[3][0].piece = pieces.WHITE_QUEEN;
				map[4][0].piece = pieces.WHITE_KING;
				map[5][0].piece = pieces.WHITE_BISHOP;
				map[6][0].piece = pieces.WHITE_KNIGHT;
				map[7][0].piece = pieces.WHITE_ROOK;
				
				map[0][1].piece = pieces.WHITE_PAWN;
				map[1][1].piece = pieces.WHITE_PAWN;
				map[2][1].piece = pieces.WHITE_PAWN;
				map[3][1].piece = pieces.WHITE_PAWN;
				map[4][1].piece = pieces.WHITE_PAWN;
				map[5][1].piece = pieces.WHITE_PAWN;
				map[6][1].piece = pieces.WHITE_PAWN;
				map[7][1].piece = pieces.WHITE_PAWN;
				
				map[0][6].piece = pieces.BLACK_PAWN;
				map[1][6].piece = pieces.BLACK_PAWN;
				map[2][6].piece = pieces.BLACK_PAWN;
				map[3][6].piece = pieces.BLACK_PAWN;
				map[4][6].piece = pieces.BLACK_PAWN;
				map[5][6].piece = pieces.BLACK_PAWN;
				map[6][6].piece = pieces.BLACK_PAWN;
				map[7][6].piece = pieces.BLACK_PAWN;
				
				map[0][7].piece = pieces.BLACK_ROOK;
				map[1][7].piece = pieces.BLACK_KNIGHT;
				map[2][7].piece = pieces.BLACK_BISHOP;
				map[3][7].piece = pieces.BLACK_QUEEN;
				map[4][7].piece = pieces.BLACK_KING;
				map[5][7].piece = pieces.BLACK_BISHOP;
				map[6][7].piece = pieces.BLACK_KNIGHT;
				map[7][7].piece = pieces.BLACK_ROOK;
			},
			
			get_piece_legal_move: function(x,y)
			{
				var legal_tiles = [];
				var piece = map[x][y].piece;
				if (piece === pieces.WHITE_KING || piece === pieces.BLACK_KING)
				{
					var possible_tiles = [{x:x-1,y:y}
						,{x:x-1,y:y+1}
						,{x:x,y:y+1}
						,{x:x+1,y:y+1}
						,{x:x+1,y:y}
						,{x:x+1,y:y-1}
						,{x:x,y:y-1}
						,{x:x-1,y:y-1}];
					legal_tiles = possible_tiles.filter(tile => Board.is_legal_move(tile.x,tile.y))
				}
				else if (piece === pieces.WHITE_QUEEN || piece === pieces.BLACK_QUEEN)
				{
					var possible_tiles = [];
					possible_tiles = possible_tiles.concat(Board.search_linear(x,y));
					possible_tiles = possible_tiles.concat(Board.search_diagonal(x,y));
					legal_tiles = possible_tiles.filter(tile => Board.is_legal_move(tile.x,tile.y))
				}
				else if (piece === pieces.WHITE_ROOK || piece === pieces.BLACK_ROOK)
				{
					var possible_tiles = [];
					possible_tiles = possible_tiles.concat(Board.search_linear(x,y));
					legal_tiles = possible_tiles.filter(tile => Board.is_legal_move(tile.x,tile.y))
				}
				else if (piece === pieces.WHITE_BISHOP || piece === pieces.BLACK_BISHOP)
				{
					var possible_tiles = [];
					possible_tiles = possible_tiles.concat(Board.search_diagonal(x,y));
					legal_tiles = possible_tiles.filter(tile => Board.is_legal_move(tile.x,tile.y))
				}
				else if (piece === pieces.WHITE_KNIGHT || piece === pieces.BLACK_KNIGHT)
				{
					var possible_tiles = [{x:x+1,y:y+2}
						,{x:x+2,y:y+1}
						,{x:x+2,y:y-1}
						,{x:x+1,y:y-2}
						,{x:x-1,y:y-2}
						,{x:x-2,y:y-1}
						,{x:x-2,y:y+1}
						,{x:x-1,y:y+2}];
					legal_tiles = possible_tiles.filter(tile => Board.is_legal_move(tile.x,tile.y))
				}
				else if (piece === pieces.WHITE_PAWN)
				{
					var possible_tiles = [];
					// check if in front we're empty
					if (Board.is_empty_tile(x,y+1))
					{
						possible_tiles.push({x:x,y:y+1});
						if (Board.is_empty_tile(x,y+2))
						{
							if (y === 1)
							{
								// check if nothing is in front of it
								if (map[x][y+1].piece === pieces.NONE)
								{
									possible_tiles.push({x:x,y:y+2})
								}
							}
						}
					}
					// diagonal attack
					if (!Board.is_empty_tile(x+1,y+1)) possible_tiles.push({x:x+1,y:y+1});
					if (!Board.is_empty_tile(x-1,y+1)) possible_tiles.push({x:x-1,y:y+1});

					legal_tiles = possible_tiles.filter(tile => Board.is_legal_move(tile.x,tile.y))
				}
				else if (piece === pieces.BLACK_PAWN)
				{
					var possible_tiles = [{x:x,y:y-1}];
					if (y === 6)
					{
						// check if nothing is in front of it
						if (map[x][y-1].piece === pieces.NONE)
						{
							possible_tiles.push({x:x,y:y-2})
						}
					}

					legal_tiles = possible_tiles.filter(tile => Board.is_legal_move(tile.x,tile.y))
				}
				return legal_tiles;
			},
			
			is_legal_move: function(x,y)
			{
				if (x < 0 || y < 0 || x > width - 1 || y > height - 1) return false;
				if (!(Engine.player === Board.get_piece_belong_to(x,y)) || Board.get_piece_belong_to(x,y) === "none")
				{
					return true;
				}	
				return false;
			},
			
			is_empty_tile: function(x,y)
			{
				if (x < 0 || y < 0 || x > width - 1 || y > height - 1) return false;
				if (map[x][y].piece === pieces.NONE)
				{
					return true;
				}
				else 
				{
					return false;
				}
			},
			
			/* searches a ray from a point excluding (x,y) until it reaches either the end of the board or a blockage
			  delta_x and delta_y being the increment value
			  x++, y++ for searching 45deg standard pos 
			  x++, y-- for searching 315deg standard pos 
			 */
			search_ray: function(x, y, delta_x, delta_y)
			{
				var x_index = x;
				var y_index = y;
				
				var possible_tiles = [];
				
				while (x_index < width && y_index < height && x_index >= 0 && y_index >= 0)
				{
					x_index += delta_x;
					y_index += delta_y;
					if (Board.is_empty_tile(x_index, y_index))
					{
						possible_tiles.push({x:x_index,y:y_index});
					}
					else 
					{
						possible_tiles.push({x:x_index,y:y_index}); // it's possible alright
						break;
					}
				}
				
				return possible_tiles;
			},
			
			// taking an x and a y, searchs the horizontal space for legal moves 
			search_linear: function(x,y)
			{
				var possible_tiles = [];
				// do hor/vert by searching 
				possible_tiles = possible_tiles.concat(Board.search_ray(x,y,+1,0));
				possible_tiles = possible_tiles.concat(Board.search_ray(x,y,-1,0));
				possible_tiles = possible_tiles.concat(Board.search_ray(x,y,0,+1));
				possible_tiles = possible_tiles.concat(Board.search_ray(x,y,0,-1));

				return possible_tiles;
			},
			
			
			
			search_diagonal: function(x,y)
			{
				var possible_tiles = [];
				// do diagonal by searching - inefficient, but works for our purposes.
				possible_tiles = possible_tiles.concat(Board.search_ray(x,y,+1,+1));
				possible_tiles = possible_tiles.concat(Board.search_ray(x,y,+1,-1));
				possible_tiles = possible_tiles.concat(Board.search_ray(x,y,-1,+1));
				possible_tiles = possible_tiles.concat(Board.search_ray(x,y,-1,-1));
				
				return possible_tiles;
			},
			
			get_piece_belong_to: function(x,y)
			{
				if (Board.map[x][y].piece === pieces.WHITE_KING
					||	Board.map[x][y].piece === pieces.WHITE_QUEEN
					||	Board.map[x][y].piece === pieces.WHITE_ROOK
					||	Board.map[x][y].piece === pieces.WHITE_BISHOP
					||	Board.map[x][y].piece === pieces.WHITE_KNIGHT
					||	Board.map[x][y].piece === pieces.WHITE_PAWN)
				{
					return "white";
				}
				else if (Board.map[x][y].piece === pieces.BLACK_KING
					||	Board.map[x][y].piece === pieces.BLACK_QUEEN
					||	Board.map[x][y].piece === pieces.BLACK_ROOK
					||	Board.map[x][y].piece === pieces.BLACK_BISHOP
					||	Board.map[x][y].piece === pieces.BLACK_KNIGHT
					||	Board.map[x][y].piece === pieces.BLACK_PAWN)
				{
					return "black";
				}
				return "none";
			},
			
			move_piece: function(sx,sy,dx,dy)
			{
				if (Board.is_legal_move(dx,dy))
				{
					map[dx][dy].piece = map[sx][sy].piece;
					map[sx][sy].piece = pieces.NONE;
					return true;	
				}
				return false;
			},
		}
	}
)();
