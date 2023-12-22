import music from './sounds/ambient.mp3';
import ufo from './sounds/ufo.mp3';
import rocket from './sounds/rocket.mp3';
import dice from './sounds/dice.mp3';
import victory from './sounds/voitto.mp3';
import A from './sounds/aaa.mp3';
import E from './sounds/eee.mp3';
import H from './sounds/hoo.mp3';
import I from './sounds/iii.mp3';
import J from './sounds/jii.mp3';
import K from './sounds/koo.mp3';
import L from './sounds/lll.mp3';
import M from './sounds/mmm.mp3';
import N from './sounds/nnn.mp3';
import O from './sounds/ooo.mp3';
import P from './sounds/pee.mp3';
import R from './sounds/rrr.mp3';
import S from './sounds/sss.mp3';
import T from './sounds/tee.mp3';
import U from './sounds/uuu.mp3';
import V from './sounds/vee.mp3';
import Y from './sounds/yyy.mp3';
import Aa from './sounds/aa.mp3';
import Oo from './sounds/oo.mp3';

const soundMap: {[key: string]: string} = 
{
    'A': A,
    'E': E,
    'H': H,
    'I': I,
    'J': J,
    'K': K,
    'L': L,
    'M': M,
    'N': N,
    'O': O,
    'P': P,
    'R': R,
    'S': S,
    'T': T,
    'U': U,
    'V': V,
    'Y': Y,
    'Ä': Aa,
    'Ö': Oo
};

export function playSound(index: number, shuffledChars: any)
{
	const letter = shuffledChars[index - 1];
	console.log(index);
	console.log(letter);
	const soundFileName = soundMap[letter];
	console.log(soundFileName);
	const sound = new Audio(soundFileName);
	sound.play();
}

export function playMusic()
{
	const audio = new Audio(music);
	audio.volume = 0.1;
	audio.play();
}

export function ufoRuutu()
{
	const audio = new Audio(ufo);
	audio.volume = 0.2;
	audio.play();
}

export function rakettiRuutu()
{
	const audio = new Audio(rocket);
	audio.volume = 0.2;
	audio.play();
}

export function noppa()
{
	const audio = new Audio(dice);
	audio.volume = 0.2;
	audio.play();
}

export function voitto()
{
	const audio = new Audio(victory);
	audio.volume = 0.2;
	audio.play();
}
