import './App.css'
import React, { useState } from 'react';
import Comics from './components/Comics';
import Info from './components/Info';
import Favoritos from './components/Favoritos';
import './styles/Marvel.css';

function App() {
  const [comicId, setComicId] = useState(null); //id de los comics
  const [displayFavorites, setDisplayFavorites] = useState(false);//favs si o no

  const handleAddToFavorites = (selectedComic) => {
    const storedFavorites = JSON.parse(localStorage.getItem('favorites')) || []; //load favs
    const isAlreadyFavorite = storedFavorites.find((favComic) => favComic.id === selectedComic.id); //es fav?

    if (!isAlreadyFavorite) {
      const updatedFavorites = [...storedFavorites, selectedComic];
      localStorage.setItem('favorites', JSON.stringify(updatedFavorites));
    }

    setDisplayFavorites(true);//redirigir a favs
  };

  const handleShowFavorites = () => {
      setDisplayFavorites(true);
      setComicId(null); //sin comic seleccionado
    };

  const handleShowComics = () => {
    setDisplayFavorites(false); //redirigir a comics
    setComicId(null);
  };

  const onComicSelect = (id) => {
    setComicId(id); //id del comic seleccionado
    setDisplayFavorites(false);
  };

  return (
    <div className="App">
      <div className='container'>
        <h1 className="titulo">Comics</h1>
        
        {displayFavorites ? (
            <>
              <h2 className="favorites-title">Comics Favoritos</h2>
              <Favoritos onComicSelect={onComicSelect}/>
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