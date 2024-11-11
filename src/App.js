import './App.css'
import React, { useState } from 'react';
import Comics from './components/Comics';
import Info from './components/Info';
import Favoritos from './components/Favoritos';
import './styles/Marvel.css';

function App() {
  const [comicId, setComicId] = useState(null);
  const [displayFavorites, setDisplayFavorites] = useState(false);

  const handleAddToFavorites = (selectedComic) => {
    const storedFavorites = JSON.parse(localStorage.getItem('favorites')) || [];
    const isAlreadyFavorite = storedFavorites.find((favComic) => favComic.id === selectedComic.id);

    if (!isAlreadyFavorite) {
      const updatedFavorites = [...storedFavorites, selectedComic];
      localStorage.setItem('favorites', JSON.stringify(updatedFavorites));
    }

    setDisplayFavorites(true);
  };

  const handleShowFavorites = () => {
      setDisplayFavorites(true);
      setComicId(null);
    };

  const handleShowComics = () => {
    setDisplayFavorites(false);
    setComicId(null);
  };

  return (
    <div className="App">
      <div className='container'>
        <h1 className="titulo">Comics</h1>
        
        {displayFavorites ? (
            <>
              <h2 className="favorites-title">Comics Favoritos</h2>
              <Favoritos />
            </>
          ) : comicId ? (
            <Info comicId={comicId} onFavoriteToggle={handleAddToFavorites} onBackToComics={handleShowComics} />
          ) : (
            <Comics onComicSelect={setComicId} />
          )
        }
        
        {displayFavorites ? (
            <button onClick={handleShowComics} className="boton">Volver</button>
          ) : (
            <button onClick={handleShowFavorites} className="boton">Ver Favoritos</button>
          )
        }
      </div>
    </div>
  );
}export default App;