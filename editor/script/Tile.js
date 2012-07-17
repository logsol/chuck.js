// Tile Class
function Tile(x, y, tile, rotation)
{
	this.x = x;
	this.y = y;
	this.tile = tile;
	this.rotation = rotation;
	
	this.toString = function()
	{
		if(this.rotation == 0)
		{
			return '<tile shape="' + this.tile + '" x="' + this.x + '" y="' + this.y + '" />';
		}
		else
		{
			return '<tile shape="' + this.tile + '" x="' + this.x + '" y="' + this.y + '" rotation="' + this.rotation + '" />';
		}
	};
}