import React, {useState} from "react";
import './App.css';
import backGroundImage from "./images/spacetheme.jpg";
import Instructions from "./Instructions";
import GameBoard from './GameBoard';
import Pelinappula1 from './images/pelinappula1.png';
import Pelinappula2 from './images/pelinappula2.png';
import Pelinappula3 from './images/pelinappula3.png';
import Pelinappula4 from './images/pelinappula4.png';
import Pelinappula5 from './images/pelinappula5.png';
import Pelinappula6 from './images/pelinappula6.png';
import Pelinappula7 from './images/pelinappula7.png';
import Pelinappula8 from './images/pelinappula8.png';
import { playMusic } from './PlaySound';

function FrontPage(){

    const [playerCount, setPlayerCount] = useState(0);
    const [playerCharacters, setPlayerCharacters] = useState<number[]>([0,1,2,3]);
    const [playerNames, setPlayerNames] = useState<string[]>([]);
    const [view, setView] = useState('frontPage');

    const [images, setImages] = useState<HTMLImageElement[]>([]);

    images[0] = new Image();
    images[0].src = Pelinappula1;
    images[1] = new Image();
    images[1].src = Pelinappula2;
    images[2] = new Image();
    images[2].src = Pelinappula3;
    images[3] = new Image();
    images[3].src = Pelinappula4;
    images[4] = new Image();
    images[4].src = Pelinappula5;
    images[5] = new Image();
    images[5].src = Pelinappula6;
    images[6] = new Image();
    images[6].src = Pelinappula7;
    images[7] = new Image();
    images[7].src = Pelinappula8;

    const handlePlayerCountChange = (event:any) => {
      const count = parseInt(event.target.value);
      setPlayerCount(count);
      setPlayerNames(Array(count).fill(""));
    }

    const handlePlayerCharacterChange = (index:any, increment:number) => {
      let new_value = playerCharacters[index] + increment;

      if(new_value > 7)
      {
        new_value = 0;
      }

      if(new_value < 0)
      {
        new_value = 7;
      }
      
      let new_array: any = [];

      let value0 = playerCharacters[0];
      let value1 = playerCharacters[1];
      let value2 = playerCharacters[2];
      let value3 = playerCharacters[3];

      switch(index)
      {
        case 0:
          new_array = [new_value,value1,value2,value3];
          break;

        case 1:
          new_array = [value0,new_value,value2,value3];
          break;

        case 2:
          new_array = [value0,value1,new_value,value3];
          break;

        case 3:
          new_array = [value0,value1,value2,new_value];
          break;
      }

      setPlayerCharacters(new_array);
    }

    const renderPlayerNameInputs = () => {
      const inputs = [];

      for (let i = 0; i < playerCount; i++) {
        inputs.push(
          <div key={i}>
            <label htmlFor={`player-name-${i}`}>Pelaaja {i+1}:</label>
            <button onClick={(e) => handlePlayerCharacterChange(i, -1)} >&lt;</button>
            <img src={images[playerCharacters[i]].src} id={"1"} />
            <button onClick={(e) => handlePlayerCharacterChange(i, 1)} >&gt;</button>
          </div>
        );
      }

      return inputs;
    }

    const startGame = () => {

      let canStart = true;

      for(let i=0; i<playerCount; i++)
      {
        for(let z=0; z<playerCount; z++)
        {
          if(i != z && playerCharacters[i] == playerCharacters[z])
          {
            alert("valitkaa erilaiset pelihahmot");
            return;
          }
        }
      }

      let r = document.getElementById("root");

      if(r != null)
      {
        r.className = playerCount.toString() + playerCharacters[0].toString() + playerCharacters[1].toString() + playerCharacters[2].toString() + playerCharacters[3].toString();
      }

      if(canStart)
      {
		    playMusic();
        setView('gameBoard');
      }
    };

    return(
      <>
      {view === 'gameBoard' ? (
        <>
        <Instructions />
        <GameBoard />
        </>
      ) : (
        
      <div className="container" style={{ backgroundImage:`url(${backGroundImage})`,
      backgroundRepeat: 'no-repeat',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      width: '100vw',
      height: '100vh'
      }}>
        
      <h1 className="peliOtsikko">Tervetuloa avaruuspeliin!</h1>
      <h2 className="peliAlaOtsikko">Valitse pelaajien määrä:</h2>
      <button className="playerAmountButton" value="2" onClick={handlePlayerCountChange}>Kaksi</button>
      <button className="playerAmountButton" value="3" onClick={handlePlayerCountChange}>Kolme</button>
      <button className="playerAmountButton" value="4" onClick={handlePlayerCountChange}>Neljä</button>
      {playerCount > 0 && (
      
      <div className="playerNameInput">
        <h2>Valitse pelaajien hahmot:</h2>
        {renderPlayerNameInputs()}
        <button className="startGame" onClick={() => startGame()}>Aloita peli!</button>
        </div>
      
    )}
      </div>
      )}
      </> 
    );
}

export default FrontPage;