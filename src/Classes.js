export class Point
{
	x: number;
	y: number;

	constructor(x, y)
	{
		this.x = x;
		this.y = y;
	}
}

export class GameObject extends Point
{
	constructor(x, y)
	{
		super(x, y);
	}
}

export class View extends GameObject
{
	target: GameObject;

	constructor(x, y, width, height)
	{
		super(x ,y);
		this.x = x;
		this.y = y;
		this.width = width;
		this.height = height;
		this.lastX = x;
	}

	update()
	{
		if(this.target == undefined)
		{
			return;
		}

		this.x += (this.target.x-this.x) * 0.03;
		this.y += (this.target.y-this.y) * 0.03;
	}

	get Target()
	{
		return this.target;
	}

	set Target(value)
	{
		this.target = value;
	}
	
}

export class Player extends GameObject
{
	id: number;

	constructor(x, y, id)
	{
		super(x, y);

		this.id = id;
	}
}

export class BoardItem extends GameObject
{
	animState: number;

	constructor(x, y)
	{
		super(x, y);
	}
}

export class Planet 
{
	
}