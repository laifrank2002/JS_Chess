var mouse_handler = (
	function()
	{
		var initialized = false;
		
		return {
			initialize: function()
			{
				Engine.log("Initializing Mouse Handler...");
				mouse_handler.activate();
			},
			
			activate: function()
			{
				document.addEventListener("mousedown", Engine.handle_click, false);
				document.addEventListener("contextmenu", Engine.handle_click, false);
			},
			
			deactivate: function()
			{
				document.removeEventListener("mousedown", Engine.handle_click, false);
				document.removeEventListener("contextmenu", Engine.handle_click, false);
			},
		}
	}
)();