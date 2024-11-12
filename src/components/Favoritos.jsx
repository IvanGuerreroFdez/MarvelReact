import React, { useEffect, useState } from 'react';
import '../styles/Marvel.css';

function Favoritos ({onComicSelect})  {
  const [favorites, setFavorites] = useState([]); //favs stado

  useEffect(() => {
    const savedFavorites = JSON.parse(localStorage.getItem('favorites')) || []; //load favs 
    setFavorites(savedFavorites);
  }, []);

  const removeFromFavorites = (comicId) => {
    const updatedFavorites = favorites.filter((comic) => comic.id !== comicId); //remove fav

    setFavorites(updatedFavorites);

    localStorage.setItem('favorites', JSON.stringify(updatedFavorites)); //update favs
  };

  return (
    <div className="favs">
      {favorites.length > 0 ? (
        favorites.map((comic) => (
          <div key={comic.id} className="favs-detallado">
            <img src={`${comic.thumbnail.path}.${comic.thumbnail.extension}`} alt={comic.title} />

            <h3 className="nombres">{comic.title}</h3>

            <button onClick={() => removeFromFavorites(comic.id)} className="boton">Eliminar de favoritos</button>
            
            <button onClick={() => onComicSelect(comic.id)} className="boton">Detalles</button>
          </div>
        ))
      ) : (
        <p className="cargando">Agrega a Favoritos tus comics preferidos!!!</p>
      )}
    </div>
  );
};export default Favoritos;