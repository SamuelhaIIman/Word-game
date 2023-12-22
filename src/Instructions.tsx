import React, { useState } from 'react';
import './App.css';
import rocketImage from './images/rocket.gif';
import ufoImage from './images/ufo.png';
import ohjeAani from './sounds/ohjeAanitys.mp3';

function Instructions() {
  const [showInstructions, setShowInstructions] = useState(false);
  const ohje = new Audio(ohjeAani);

  const playOhje = () =>{
    ohje.currentTime = 0;
    ohje.play();
  }

  const stopOhje = () =>{
    ohje.pause();
    ohje.currentTime = 0;
  }

  const toggleInstructions = () => {
    setShowInstructions(!showInstructions);
  };

  return (
    <div>
      <button id='ohjeNappi' onClick={toggleInstructions}>
        {showInstructions ? 'Piilota ohjeet' : 'Näytä pelin ohjeet'}
      </button>
      {showInstructions && (
        <div className='ohjeet'>
          <h2>Pelin ohjeet</h2>
            <p>Pyöräytä noppaa ja etene pelilaudalla silmäluvun verran.</p>
            <p>Lue peliruudun kirjain ja keksi sillä alkava sana.</p>
            <p><img src={rocketImage} alt="Rocket"/>Rakettiruudussa pääset lentämään raketilla eteenpäin niin pitkään kuin raketissa riittää polttoainetta. Lisäksi tee 5 tasahyppyä.</p>
            <p><img src={ufoImage} alt="Ufo"/> Uforuudussa joudut menemään 1-3 peliruutua taaksepäin. Lisäksi kinkkaa ovelle.</p>
            <button id='ohjeNappi' onClick={playOhje}>Kuuntele ohje</button>
            <button id='ohjeNappi' onClick={stopOhje}>Pysäytä ohje</button>
        </div>
      )}
    </div>
  );
}

export default Instructions;