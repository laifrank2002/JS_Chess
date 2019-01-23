/** 
	Portable lightweight engine.
	@author Frank Lai 2002
	@version 2018-12-11
	https://github.com/laifrank2002
 */


 
var Engine = (
	function()
	{
		// debugging
		var _log = true;
		var _debug = true;
		
		var objects = [];		
		//sets keys pressed 
		var keys_pressed = [];
		
		//stores cursor's position from the top left corner; x corresponds to left-right; y corresponds to up-down
		var cursor = {
			x: 0,
			y: 0,
		};
		
		//for animation
		var last_time = null; 
		var lapse = 0;
		var paused = false;
		
		var frame_count = 0;
		
		// animation constants 
		var TILESIZE = 64;
		var board_offset = {x: 240, y: 40};
		var AXIS_TEXT_X = ["A","B","C","D","E","F","G","H"];
		var AXIS_TEXT_Y = ["1","2","3","4","5","6","7","8"];
		var FONT_SIZE = 30;
		var PRIMARY_COLOUR = "#ccddee";
		var SECONDARY_COLOUR = "#7799cc";
		var SELECTED_COLOUR = "green";
		var MOVEMENT_COLOUR = "yellow";
		var ATTACK_COLOUR = "red";
		
		// message box 
		var message_box = [];
		var message_box_scroll = 0;
		// game variables 
		var selected = {x:0,y:0};
		var last_selected = {x:0,y:0};
		
		var player = "white";
		var turns = 1;
		return {
			get cursor() { return cursor },
			get cursor_x() { return cursor.x },
			get cursor_y() { return cursor.y },
			
			get board_offset() { return board_offset },
			get tilesize() { return TILESIZE },
			get axis_text_x() { return AXIS_TEXT_X },
			get axis_text_y() { return AXIS_TEXT_Y },
			get font_size() { return FONT_SIZE },
			
			get selected_x() { return selected.x },
			get selected_y() { return selected.y },
			
			get primary_colour() { return PRIMARY_COLOUR },
			get secondary_colour() { return SECONDARY_COLOUR },
			get selected_colour() { return SELECTED_COLOUR },
			get movement_colour() { return MOVEMENT_COLOUR },
			get attack_colour() { return ATTACK_COLOUR },
			
			get player() { return player },
			get turns() { return turns },
			
			get message_box() { return message_box },
			
			does_selected_piece_belong_to_player: function()
			{
				if (player === "white")
				{
					
					if (Board.map[selected.x][selected.y].piece === pieces.WHITE_KING
						||	Board.map[selected.x][selected.y].piece === pieces.WHITE_QUEEN
						||	Board.map[selected.x][selected.y].piece === pieces.WHITE_ROOK
						||	Board.map[selected.x][selected.y].piece === pieces.WHITE_BISHOP
						||	Board.map[selected.x][selected.y].piece === pieces.WHITE_KNIGHT
						||	Board.map[selected.x][selected.y].piece === pieces.WHITE_PAWN)
					{
						return true;
					}
				}
				else if (player === "black")
				{
					
					if (Board.map[selected.x][selected.y].piece === pieces.BLACK_KING
						||	Board.map[selected.x][selected.y].piece === pieces.BLACK_QUEEN
						||	Board.map[selected.x][selected.y].piece === pieces.BLACK_ROOK
						||	Board.map[selected.x][selected.y].piece === pieces.BLACK_BISHOP
						||	Board.map[selected.x][selected.y].piece === pieces.BLACK_KNIGHT
						||	Board.map[selected.x][selected.y].piece === pieces.BLACK_PAWN)
					{
						return true ;
					}
				}
				return false;
			},
			
			does_last_selected_piece_belong_to_player: function()
			{
				if (player === "white")
				{
					
					if (Board.map[last_selected.x][last_selected.y].piece === pieces.WHITE_KING
						||	Board.map[last_selected.x][last_selected.y].piece === pieces.WHITE_QUEEN
						||	Board.map[last_selected.x][last_selected.y].piece === pieces.WHITE_ROOK
						||	Board.map[last_selected.x][last_selected.y].piece === pieces.WHITE_BISHOP
						||	Board.map[last_selected.x][last_selected.y].piece === pieces.WHITE_KNIGHT
						||	Board.map[last_selected.x][last_selected.y].piece === pieces.WHITE_PAWN)
					{
						return true;
					}
				}
				else if (player === "black")
				{
					
					if (Board.map[last_selected.x][last_selected.y].piece === pieces.BLACK_KING
						||	Board.map[last_selected.x][last_selected.y].piece === pieces.BLACK_QUEEN
						||	Board.map[last_selected.x][last_selected.y].piece === pieces.BLACK_ROOK
						||	Board.map[last_selected.x][last_selected.y].piece === pieces.BLACK_BISHOP
						||	Board.map[last_selected.x][last_selected.y].piece === pieces.BLACK_KNIGHT
						||	Board.map[last_selected.x][last_selected.y].piece === pieces.BLACK_PAWN)
					{
						return true ;
					}
				}
				return false;
			},
			
			initialize: function()
			{
				Engine.log("Initializing Engine...");
				Board.initialize();
				Canvas.initialize();
				
				//set up the mouse move event listeners
				document.onmousemove = function(event) {
					cursor.x = event.pageX;
					cursor.y = Canvas.canvas.height - event.pageY; // flip y!
				}
				mouse_handler.initialize();
				
				requestAnimationFrame(Engine.animate); // init animation when all is ready
			},
			
			log: function(message)
			{
				if (_log)
				{
					console.log(message);
				}
			},
			
			debug: function()
			{
				setInterval(function()
				{
					Engine.log(frame_count);
					frame_count = 0;
				}, 1000);
			},
			
			notify: function(message)
			{
				
				// add to on canvas message panel 
				message_box.push("Turn " + turns + ": " + message.toString());
				
				
				// delete first message if box is full 
				var MAX_MESSAGES = 7;
				if(message_box.length > MAX_MESSAGES)
				{
					message_box.shift();
				}
				
			},
			
			toggle_pause: function()
			{
				paused = !paused;
			},
			
			// animation
			animate: function(time)
			{
				if (last_time === null)
				{
					lapse = 0;
				}
				else 
				{
					lapse = time - last_time;
				}
				
				last_time = time;
				
				if(!paused) 
				{
					Engine.draw_frame(lapse);
				}
				
				if (_debug) frame_count++; // debugging
				requestAnimationFrame(Engine.animate);
			},
			
			draw_frame: function(lapse)
			{
				// call canvas handler
				Canvas.draw(lapse);
				
			},
			
			handle_click: function(event)
			{
				var canvas_x = (event.clientX - Canvas.canvas.getBoundingClientRect().left) - board_offset.x;
				var canvas_y = (event.clientY - Canvas.canvas.getBoundingClientRect().top) - board_offset.y;
				// check square clicked 
				if (canvas_x >= 0 && canvas_y >= 0 
					&& canvas_x < Board.width * TILESIZE && canvas_y < Board.height * TILESIZE)
				{
					var board_x = Math.floor(canvas_x/TILESIZE);
					var board_y = Board.height - Math.floor(canvas_y/TILESIZE) - 1;
					last_selected.x = selected.x;
					last_selected.y = selected.y;
					selected.x = board_x;
					selected.y = board_y;
					// if tis valid, make the move
					var legal_move = Board.get_piece_legal_move(last_selected.x,last_selected.y);
					legal_move.forEach(function(tile)
					{
						if (selected.x === tile.x
							&& selected.y === tile.y)
						{
							if(Engine.does_last_selected_piece_belong_to_player())
							{
								if(Board.move_piece(last_selected.x,last_selected.y
									,selected.x,selected.y))
								{
									// move message 
									Engine.notify("Moved " + Board.map[selected.x][selected.y].piece.name + " from " + AXIS_TEXT_X[last_selected.x] + AXIS_TEXT_Y[last_selected.y]
										+ " to " + AXIS_TEXT_X[selected.x] + AXIS_TEXT_Y[selected.y]);
									Engine.pass_turn();
								}
							}
						}
					});
					// if tis valid, attack too!
					//Engine.log("Mouse clicked at: " + AXIS_TEXT_X[board_x] + "," + AXIS_TEXT_Y[board_y] + " and selected: " + Board.map[board_x][board_y].piece.name);
					
					// god that's a monster method. give it to board.
				}
			},
			
			pass_turn: function()
			{
				Engine.switch_player();
				turns++;
			},
			
			switch_player: function()
			{
				if (player === "white") 
				{
					player = "black";
				}
				else 
				{
					player = "white";
				}
			},
		}
	}
)();