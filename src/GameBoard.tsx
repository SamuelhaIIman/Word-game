import { useRef, useEffect } from 'react';
import {View, BoardItem} from './Classes.js';
import './App.css';
import startImage from './images/startImage.png';
import finishImage from './images/finishImage.png';
import gameTileImage from './images/gameTile.png';
import moonImage from './images/moon.png';
import rocket from './images/rocket.gif';
import ufo from './images/ufo.png';
import pelinappula1 from './images/pelinappula1.png';
import pelinappula2 from './images/pelinappula2.png';
import pelinappula3 from './images/pelinappula3.png';
import pelinappula4 from './images/pelinappula4.png';
import pelinappula5 from './images/pelinappula5.png';
import pelinappula6 from './images/pelinappula6.png';
import pelinappula7 from './images/pelinappula7.png';
import pelinappula8 from './images/pelinappula8.png';
import planet1 from './images/planet1.png';
import planet2 from './images/planet2.png';
import Dice from 'react-dice-roll';
import { playSound, ufoRuutu, rakettiRuutu, noppa, voitto } from './PlaySound';

// general variables
let chars = ['A','A','E','E','H','H','I','I','J','J','K','K','L','L','M','M','N','N','O','O','P','P','R','R','S','S','T','T','U','U','V','V','Y','Y','Ä','Ä','Ö','Ö'];
let gameStarted = false; // check if game started

const shuffleArray = (array: string[]): string[] =>			//heittää arrayn random järjestykseen
{
	for (let i = array.length - 1; i > 0; i--)
	{
		const j = Math.floor(Math.random() * (i + 1));
		const temp = array[i];
		array[i] = array[j];
		array[j] = temp;
	}
	return array;
}

const shuffledChars = shuffleArray(chars);

// rendering (drawing everything on canvas)
const size = 128; // how big the tiles should be
const gap = 128; // the gap between each tile
const scaleIndex = 5; // general scale
let scale = 1;
let playerSizeX = 32;
let playerSizeY = 54;

// view handling
const view = new View(0,0); // view object
let vOffsetX = 0;
let vOffsetY = 0;
let rotationAngle = 0;
let rotationSpeed = 0;
let hoverOffset = 0;

// Player movement
let dice = 0;
let playerPosition1 = 0;
let playerPosition2 = 0;
let playerPosition3 = 0;
let playerPosition4 = 0;
let currentPlayer = 0;
let gameWon = false;


// board
const boardLength = shuffledChars.length+2; // how many tiles should be in the board (including start and finish tiles)
let boardItems: BoardItem[] = [];

// for reference
let c: HTMLCanvasElement;
let ctx: CanvasRenderingContext2D;
let startImg = new Image();
let finishImg = new Image();
let moonImg = new Image();
let gameTileImg = new Image();
let rocketImg = new Image();
let ufoImg = new Image();
let planet1Img = new Image();
let planet2Img = new Image();
let pelinappula1Img = new Image();
let pelinappula2Img = new Image();
let pelinappula3Img = new Image();
let pelinappula4Img = new Image();

let images: any = [];

images[0] = new Image();
images[0].src = pelinappula1;
images[1] = new Image();
images[1].src = pelinappula2;
images[2] = new Image();
images[2].src = pelinappula3;
images[3] = new Image();
images[3].src = pelinappula4;
images[4] = new Image();
images[4].src = pelinappula5;
images[5] = new Image();
images[5].src = pelinappula6;
images[6] = new Image();
images[6].src = pelinappula7;
images[7] = new Image();
images[7].src = pelinappula8;

let playerCount = 0;
let playerCharacters = [0,0,0,0];
currentPlayer = playerCount;

function GameBoard()
{
	const canvasRef = useRef<HTMLCanvasElement>(null);

	useEffect(() => {
		const canvas = canvasRef.current;
		if (canvas == null) return;
		const context = canvas.getContext("2d");
		if (context == null) return;
		gameStarted = true;
		if(gameStarted) start(canvas);

		startImg.src = startImage;
		finishImg.src = finishImage;
		moonImg.src = moonImage;
		gameTileImg.src = gameTileImage;
		rocketImg.src = rocket;
		ufoImg.src = ufo;
		planet1Img.src = planet1;
		planet2Img.src = planet2;

	}, []);

	let r = document.getElementById("root");

	if(r != null)
	{
		let data = r.className;
		playerCount = parseInt(data.charAt(0));
		playerCharacters[0] = parseInt(data.charAt(1));
		playerCharacters[1] = parseInt(data.charAt(2));
		playerCharacters[2] = parseInt(data.charAt(3));
		playerCharacters[3] = parseInt(data.charAt(4));
		currentPlayer = playerCount;
	}

	return (
		<>
			<canvas ref={canvasRef} />
			<div className='dice' onClick={() => noppa()}>
			<Dice size={200} onRoll={(value) => {dice += value;}} />
			</div>
		</>
	);
}

function start(canvas: any)
{
	c = canvas; // set canvas to global reference c
	ctx= canvas.getContext("2d"); // set context to global reference ctx

	window.addEventListener("resize", canvas_resize); // set resize event to window

	canvas_resize();

	board_create();

	view.Target = boardItems[0];

	setInterval(update, 16); // set function update on 16ms interval == ~60fps
	//setInterval(test, 1000); // demo
}

function board_create()
{
	let prev = 0;

	for(let i=0; i<boardLength; i++)
	{
		let offset = Math.round(Math.random()*50)-25;

		boardItems[i] = new BoardItem(i * (size+gap),prev + offset);
		prev = boardItems[i].y;
	}
}

let announcement = "";

function drawAnnouncement() 
{
	if (announcement) 
	{
		ctx.save();
		ctx.font = (size/5.5*scale).toString() + "px Arial";
		ctx.fillStyle = "white";
		ctx.textAlign = "center";
		ctx.fillText(announcement, c.width/2, c.height/1.5);
		ctx.textAlign = "left";
		
		setTimeout(function() 
		{
			announcement = "";
		}, 3000);
		ctx.restore();
	}
}

function drawPlayer1()
{
	if (playerPosition1 >= boardItems.length) 
	{
		playerPosition1 = boardItems.length - 1;
	}
	let obj1 = boardItems[playerPosition1];
	let playerX1 = (obj1.x*scale) - vOffsetX;
	let playerY1 = (obj1.y*scale) - vOffsetY;
	pelinappula1Img.src = images[playerCharacters[0]].src;
	ctx.drawImage(pelinappula1Img, playerX1, playerY1, playerSizeX, playerSizeY);
}
function drawPlayer2()
{
	if (playerPosition2 >= boardItems.length) 
	{
		playerPosition2 = boardItems.length - 1;
	}
	let obj2 = boardItems[playerPosition2];
	let playerX2 = (obj2.x*scale) - vOffsetX;
	let playerY2 = (obj2.y*scale) - vOffsetY;
	pelinappula2Img.src = images[playerCharacters[1]].src;
	ctx.drawImage(pelinappula2Img, playerX2+ 30, playerY2+ 30, playerSizeX, playerSizeY);
}
function drawPlayer3()
{
	if (playerPosition3 >= boardItems.length) 
	{
		playerPosition3 = boardItems.length - 1;
	}
	let obj3 = boardItems[playerPosition3];
	let playerX3 = (obj3.x*scale) - vOffsetX;
	let playerY3 = (obj3.y*scale) - vOffsetY;
	pelinappula3Img.src = images[playerCharacters[2]].src;
	ctx.drawImage(pelinappula3Img, playerX3+ 60, playerY3+ 60, playerSizeX, playerSizeY);
}

function drawPlayer4()
{
	if (playerPosition4 >= boardItems.length) 
	{
		playerPosition4 = boardItems.length - 1;
	}
	let obj4 = boardItems[playerPosition4];
	let playerX4 = (obj4.x*scale) - vOffsetX;
	let playerY4 = (obj4.y*scale) - vOffsetY;
	pelinappula4Img.src = images[playerCharacters[3]].src;
	ctx.drawImage(pelinappula4Img, playerX4+ 90, playerY4+ 90, playerSizeX, playerSizeY);
}


function playerMovement()
{
	if (boardItems[dice] !== undefined)
	{
		// Here players turn changes
		for (let i = 1; i <= playerCount; i++) 
		{
			if (currentPlayer === i && dice > 0) 
			{
				if (playerCount === 2)
				{
					switch (i)
					{
					case 1:
						playerPosition2 += dice;
						if (playerPosition2 % 6 !== 0)
						{
							playSound(playerPosition2, shuffledChars);
						}
						break;
					case 2:
						playerPosition1 += dice;
						if (playerPosition1 % 6 !== 0)
						{
							playSound(playerPosition1, shuffledChars);
						}
						break;
					}
				}
				if (playerCount === 3)
				{
					switch (i)
					{
					case 1:
						playerPosition2 += dice;
						if (playerPosition2 % 6 !== 0)
						{
							playSound(playerPosition2, shuffledChars);
						}
						break;
					case 2:
						playerPosition3 += dice;
						if (playerPosition3 % 6 !== 0)
						{
							playSound(playerPosition3, shuffledChars);
						}
						break;
					case 3:
						playerPosition1 += dice;
						if (playerPosition1 % 6 !== 0)
						{
							playSound(playerPosition1, shuffledChars);
						}
						break;
					}
				}
				if (playerCount === 4)
				{
					switch (i)
					{
					case 1:
						playerPosition2 += dice;
						console.log(playerPosition2);
						if (playerPosition2 % 6 !== 0)
						{
							playSound(playerPosition2, shuffledChars);
						}
						break;
					case 2:
						playerPosition3 += dice;
						console.log(playerPosition3);
						if (playerPosition3 % 6 !== 0)
						{
							playSound(playerPosition3, shuffledChars);
						}
						break;
					case 3:
						playerPosition4 += dice;
						console.log(playerPosition4);
						if (playerPosition4 % 6 !== 0)
						{
							playSound(playerPosition4, shuffledChars);
						}
						break;
					case 4:
						playerPosition1 += dice;
						console.log(playerPosition1);
						if (playerPosition1 % 6 !== 0)
						{
							playSound(playerPosition1, shuffledChars);
						}
						break;
					}
				}
				dice = 0;
				currentPlayer = i < playerCount ? i + 1 : 1;
				break;
			}
		}
		

		for (let i = 1; i <= playerCount; i++)
		{
			const playerPosition = eval("playerPosition" + i);
			if (playerPosition >= boardItems.length - 1 && !gameWon) 
			{
				gameWon = true;
				announcement = "Pelaaja " + i + " saapui Marsiin ja voitti!";
				voitto();
				setTimeout(function() 
				{
					window.location.reload();
				}, 5000);
			}
		}

		if(dice < boardLength-2)
		{
			if (playerCount === 2)
			{
				drawPlayer1();
				drawPlayer2();
			}
			if (playerCount === 3)
			{
				drawPlayer1();
				drawPlayer2();
				drawPlayer3();
			}
			if (playerCount === 4)
			{
				drawPlayer1();
				drawPlayer2();
				drawPlayer3();
				drawPlayer4();
			}
			drawAnnouncement();
			for (let i = 1; i <= playerCount; i++) 
			{
				if(currentPlayer === i)
				{
					let playerPosition = eval("playerPosition" + i);
					view.Target = boardItems[playerPosition];
				}
			}
			//erikoisruutulogiikka
			for (let i = 1; i <= playerCount; i++) 
			{
				let moveBack = Math.floor(Math.random() * 3) + 1;
				let moveForward = Math.floor(Math.random() * 3) + 1;
				let playerPosition = eval("playerPosition" + i);
				if (playerPosition !== 0 && playerPosition % 6 === 0 && playerPosition % 12 !== 0) 
				{
					eval("playerPosition" + i + " -= moveBack");
					ufoRuutu();
					
					if (eval("playerPosition" + i) < 0) eval("playerPosition" + i + " = 0");
					playSound(eval("playerPosition" +i), shuffledChars);
					
					
					if (moveBack !== 1)
					{
						announcement = "Uforuutu! Pelaaja " + i + " liikkui" + moveBack + " askelta taaksepäin. Kinkkaa lisäksi ovelle.";
					}
					if (moveForward === 1)
					{
						announcement = "Uforuutu! Pelaaja " + i + " liikkui yhden askeleen taaksepäin. Kinkkaa lisäksi ovelle.";
					}
				}
				if (playerPosition !== 0 && playerPosition % 12 === 0) 
				{
					eval("playerPosition" + i + " += moveForward");
					rakettiRuutu();
					if (eval("playerPosition" + i) > boardLength - 2) eval("playerPosition" + i + " = boardLength - 2");
					playSound(eval("playerPosition" +i), shuffledChars);
					
					if (moveForward !== 1)
					{
						announcement = "Rakettiruutu! Pelaaja " + i + " liikkui " + moveForward + " askelta eteenpäin. Tee viisi tasahyppyä.";
					}
					if (moveForward === 1)
					{
						announcement = "Rakettiruutu! Pelaaja " + i + " liikkui yhden askeleen eteenpäin. Tee viisi tasahyppyä.";
					}
				}
			}
		}
	}
}

function showResults()
{
	const totalHeight = 4 * playerSizeY;
	const x = c.width - playerSizeX - 20; // X-coordinate of the images
	let y = c.height - totalHeight - 20; 
	
	if (playerCount === 2)
	{
		pelinappula1Img.src = images[playerCharacters[0]].src;
		ctx.drawImage(pelinappula1Img, x, y, playerSizeX, playerSizeY);
		ctx.font = (size/5*scale).toString() + "px Arial";
		ctx.fillStyle = "white";
		ctx.fillText("Pelaaja 1: " + playerPosition1, c.width/1.15, y+25);
		
		y += playerSizeY;
		pelinappula2Img.src = images[playerCharacters[1]].src;
		ctx.drawImage(pelinappula2Img, x, y, playerSizeX, playerSizeY);
		ctx.fillText("Pelaaja 2: " + playerPosition2, c.width/1.15, y+25);
	}
	
	if (playerCount === 3)
	{
		pelinappula1Img.src = images[playerCharacters[0]].src;
		ctx.drawImage(pelinappula1Img, x, y, playerSizeX, playerSizeY);
		ctx.font = (size/5*scale).toString() + "px Arial";
		ctx.fillStyle = "white";
		ctx.fillText("Pelaaja 1: " + playerPosition1, c.width/1.15, y+25);
		
		y += playerSizeY;
		pelinappula2Img.src = images[playerCharacters[1]].src;
		ctx.drawImage(pelinappula2Img, x, y, playerSizeX, playerSizeY);
		ctx.fillText("Pelaaja 2: " + playerPosition2, c.width/1.15, y+25);

		y += playerSizeY;
		pelinappula3Img.src = images[playerCharacters[2]].src;
		ctx.drawImage(pelinappula3Img, x, y, playerSizeX, playerSizeY);
		ctx.fillText("Pelaaja 3: " + playerPosition3, c.width/1.15, y+25);
	}
	
	if (playerCount === 4)
	{
		pelinappula1Img.src = images[playerCharacters[0]].src;
		ctx.drawImage(pelinappula1Img, x, y, playerSizeX, playerSizeY);
		ctx.font = (size/5*scale).toString() + "px Arial";
		ctx.fillStyle = "white";
		ctx.fillText("Pelaaja 1: " + playerPosition1, c.width/1.15, y+25);
		
		y += playerSizeY;
		pelinappula2Img.src = images[playerCharacters[1]].src;
		ctx.drawImage(pelinappula2Img, x, y, playerSizeX, playerSizeY);
		ctx.fillText("Pelaaja 2: " + playerPosition2, c.width/1.15, y+25);

		y += playerSizeY;
		pelinappula3Img.src = images[playerCharacters[2]].src;
		ctx.drawImage(pelinappula3Img, x, y, playerSizeX, playerSizeY);
		ctx.fillText("Pelaaja 3: " + playerPosition3, c.width/1.15, y+25);
		
		y += playerSizeY;
		pelinappula4Img.src = images[playerCharacters[3]].src;
		ctx.drawImage(pelinappula4Img, x, y, playerSizeX, playerSizeY);
		ctx.fillText("Pelaaja 4: " + playerPosition4, c.width/1.15, y+25);
	}
}


function update()
{
	// calculate view stuff
	view.update();
	vOffsetX = (view.x*scale) - (c.width/2) + (size/2*scale);
	vOffsetY = (view.y*scale) - (c.height/2) + (size/2*scale);
	rotationAngle += 0.02; // Adjust the rotation speed
	hoverOffset = 5 * Math.sin(Date.now() * 0.002); // Adjust the hover amplitude and speed

	requestAnimationFrame( () => canvas_draw()); // request animation frame
}

function canvas_draw()
{
	canvas_clear();
	
	let planetX1 = c.width;
	let planetY1 = 0;
	let planetX2 = c.width * 2.5;
	let planetY2 = 0;
	let planetSpeed = 2;
	const backGroundSizeX1 = 1024;
	const backGroundSizeY1 = 528;
	const backGroundSizeX2 = 512;
	const backGroundSizeY2 = 512;
	const startSize = 256;
	const midSize = 128;
	const tileSize = 64;
	const extraSize = 32;
	ctx.font =  (size/2*scale).toString() + "px Arial";
	ctx.textAlign = "center";
	ctx.textBaseline = "middle";
	
	ctx.save();
	const offsetX = -vOffsetX * 0.2; // tausta liikkuu nopeammin kuin pelilauta
	const offsetY = vOffsetY * 0.2;
	ctx.translate(offsetX, offsetY);
	ctx.translate(offsetX, offsetY);
	// planeetta ilmestyy ruudulle vasta kun on liikuttu 30% pelilaudasta
	if (vOffsetX > boardItems.length * size * 0.3) 
	{
		planetX1 -= planetSpeed;
		if (planetX1 < 0) planetX1 = 0;
	}
	// planeetta 2 ilmestyy ruudulle vasta kun on liikuttu 70% pelilaudasta
	if (vOffsetX > boardItems.length * size * 0.7) 
	{
		planetX2 -= planetSpeed;
		if (planetX2 < 0) planetX2 = 0;
	}
	ctx.drawImage(planet1Img, planetX1, planetY1, backGroundSizeX1, backGroundSizeY1);
	ctx.drawImage(planet2Img, planetX2, planetY2, backGroundSizeX2, backGroundSizeY2);
	ctx.restore();

	// piirretään pelilauta
	for(let i=0; i<boardItems.length; i++)
	{
		let obj = boardItems[i];

		// piirrosten positiot
		let x = (obj.x*scale) - vOffsetX;
		let y = (obj.y*scale) - vOffsetY;

		ctx.fillStyle = "transparent";

		ctx.fillRect(x, y, (i === 0 ? startSize : size) * scale, (i === 0 ? startSize : size) * scale);

		ctx.fillStyle = "white";

		if(i === 0) 
		{	
			ctx.fillText("Lähtö", x + (size/3.2*scale), y + (size/0.6*scale))	
			const offsetX = size * scale * -0.7; 
			const offsetY = size * scale * -0.7;
			
			ctx.drawImage(startImg, x + offsetX, y + offsetY, (i === 0 ? startSize : size) * scale, (i === 0 ? startSize : size) * scale); 
		}
		else if(i === boardItems.length-1) 
		{
			ctx.fillText("Mars", x + (size/2*scale), y + (size/0.7*scale))
			ctx.drawImage(finishImg, x, y, (i === 0 ? midSize : size) * scale, (i === 0 ? midSize : size) * scale); 
		}
		else if (i > 0 && i < boardItems.length - 1) 
		{ 
			ctx.drawImage(gameTileImg, x, y, tileSize * scale, tileSize * scale);
			if (i % 6 !== 0) 
			{ // Check if i is not divisible by 6
				ctx.fillText(shuffledChars[i-1], x + (size/1.3*scale), y + (size/3.5*scale));
			}
			if (i % 6 === 0) 
			{
				ctx.save();
				const spaceShip = (i % 12 === 0) ? rocketImg : ufoImg;

				if (i % 12 === 0) 
				{
					ctx.save();
					const offsetY = extraSize * scale * 0.5;
					const offsetX = size * scale * 0.1;
					ctx.translate(x + (extraSize * scale) / 2 + offsetX, y + (extraSize * scale) / 2 + offsetY); // Move to the center of the game tile
					ctx.rotate(-rotationAngle); // raketti kiertää peliruutua
					ctx.translate(extraSize * scale * 1.5, 0); // kiertoradan etäisyys
					ctx.rotate(-rotationSpeed); // raketin oma rotaatio, jolla simuloidaan kiertorataliikettä
					ctx.drawImage(spaceShip, -extraSize * scale / 2, -extraSize * scale / 2, extraSize * scale, extraSize * scale); // raketin piirto
					ctx.restore(); // Restore the saved canvas context state
				} 
				else 
				{
				// ufo leijuu peliruudun yllä
					const offsetY = size * scale * 0.3;
					const offsetX = size * scale * -0.1;
					y -= hoverOffset + offsetY;
					x -= offsetX;
					ctx.save(); // Save the current canvas context state
					ctx.translate(x + (extraSize * scale) / 2, y + (extraSize * scale) / 2);
					ctx.rotate((15 * Math.PI) / 180); // pyöräytetään ufoa 15 astetta kellonsuuntaan, koska ufo-kuva on hieman vino
					ctx.drawImage(spaceShip, -extraSize * scale / 2, -extraSize * scale / 2, extraSize * scale, extraSize * scale); // piirretään ufo
					ctx.restore();
				}
			}
		}
	}
	playerMovement();
	showResults();
}



function canvas_clear()
{
	c.width= c.width; // this will clear canvas
}

function canvas_resize()
{
	c.width = window.innerWidth; // set canvas width to window width
	c.height = window.innerHeight; // set canvas height to window height

	// determine what scale should be (0...1)
	if((c.width/scaleIndex/size) < (c.height/scaleIndex/size)) scale = c.width/scaleIndex/size; else
	scale = c.height/scaleIndex/size;
}

export default GameBoard;
