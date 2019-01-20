/** 
	Wrapper for canvas object. Does much of the animation.
	Some code taken from clocks-in-a-cooler.
	https://github.com/Clocks-in-a-Cooler
	@author Frank Lai 2002
	@version 2018-12-11
	https://github.com/laifrank2002
 */

var Canvas = (
	function()
	{
		// constants 
		var DEFAULT_CANVAS = "main_canvas";
		
		// private fields
		var canvas;
		var context;
		
		return {
			get canvas() {return canvas},
			
			initialize: function()
			{
				Engine.log("Initializing Canvas...");
				canvas = document.getElementById(DEFAULT_CANVAS);
				context = canvas.getContext("2d");
			},
			
			draw: function(lapse)
			{				
				//up to this point, nothing has been drawn yet!
				
				// clear and draw
				context.clearRect(0, 0, canvas.width, canvas.height);
				
				context.beginPath();
				context.rect(0,0,canvas.width, canvas.height);
				context.stroke();
				// draw the chess board 
				Canvas.draw_background();
				
				// draw selected 
				context.beginPath();
				context.fillStyle = Engine.selected_colour;
				context.rect(Engine.selected_x * Engine.tilesize + Engine.board_offset.x
					,(Board.height - 1 - Engine.selected_y) * Engine.tilesize + Engine.board_offset.y
					,Engine.tilesize,Engine.tilesize)
				context.fill();
				context.stroke();
				// draw movement points
				// ONLY IF SELECTED PIECE BELONGS TO PLAYER 
				if (Engine.does_selected_piece_belong_to_player())
				{
					var movement = Board.get_piece_legal_move(Engine.selected_x,Engine.selected_y);
					
					movement.forEach(function(tile)
					{
						context.fillStyle = Engine.movement_colour;
						if (!Board.is_empty_tile(tile.x,tile.y))
						{
							context.fillStyle = Engine.attack_colour;
						}
						context.beginPath();
						context.rect(tile.x * Engine.tilesize + Engine.board_offset.x
							,(Board.height - 1 - tile.y) * Engine.tilesize + Engine.board_offset.y
							,Engine.tilesize,Engine.tilesize)
						context.fill();
						context.stroke();
						
					});
				}
				// draw chess pieces
				var map = Board.map;
				for (var x = 0; x < Board.width; x++)
				{
					for (var y = 0; y < Board.height; y++)
					{
						// image null === no image
						if (map[x][y].piece["image"]) 
						{
							context.drawImage(image_library[map[x][y].piece["image"]]
								,x*Engine.tilesize + Engine.board_offset.x
								, (Board.height - y - 1)*Engine.tilesize  + Engine.board_offset.y
								, Engine.tilesize,Engine.tilesize);
						}
					}	
				}
				
				// draw information on top 
				Canvas.draw_infopanel();
			},
			
			draw_background: function()
			{
				var tile_size = Engine.tilesize || 64;
				var width = Board.width || 8;
				var height = Board.height || 8;
				
				var offset = Engine.board_offset || {x: 30, y: 30};
				var axis_text_x = Engine.axis_text_x;
				var axis_text_y = Engine.axis_text_y;
				var font_size = Engine.font_size;
				
				// background 
				for (var x = 0; x < width; x++)
				{
					for (var y = 0; y < height; y++)
					{
						context.beginPath();
						context.rect(x*tile_size + offset.x,y*tile_size + offset.y,tile_size,tile_size);
						if ((x + y) % 2 === 0)
						{
							context.fillStyle = Engine.primary_colour;
							
						}
						else 
						{
							context.fillStyle = Engine.secondary_colour;
							
						}
						context.fill();
						context.stroke();
					}	
				}
				// draw axis 
				context.fillStyle = "black";
				context.font = font_size+ "px Times New Roman";
				for (var x = 0; x < width; x++)
				{
					context.fillText(axis_text_x[x]
						, x*tile_size + offset.x - (font_size/2) + tile_size/2
						, height*tile_size + offset.y + font_size);
				}
				for (var y = 0; y < height; y++)
				{
					context.fillText(axis_text_y[y]
						, 0*tile_size + offset.x - font_size
						, (height-y)*tile_size + offset.y + (font_size/2) - tile_size/2);
				}
				context.stroke();
			},
			
			draw_infopanel: function()
			{
				context.beginPath();
				context.fillStyle = "brown";
				context.rect(0,0,200,600);
				context.fill();
				context.stroke();
				
				context.fillStyle = "white";
				// draw header 
				context.font = "30px Times New Roman";
				context.fillText("JS Chess",20,40);
				context.font = "15px Times New Roman";
				context.fillText("By Frank Lai",20,60);
				
				// information 
				context.font = "15px Times New Roman";
				context.fillText("Player: " + Engine.player,20,90);
				context.font = "15px Times New Roman";
				context.fillText("Turn: " + Engine.turns,20,105);
			},
		}
	}
)();