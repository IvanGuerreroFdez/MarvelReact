import React, { useEffect, useState } from 'react';
import axios from 'axios';
import md5 from 'md5';
import '../styles/Marvel.css';

const publicKey = 'b513e6ca226166db85d570f258cb0737';
const privateKey = 'e1ee2f956b5401fc6dac804a5ecd9a4fd3de8d9f';

const ts = new Date().getTime();
const hash = md5(ts + privateKey + publicKey);

function Info ({comicId, onFavoriteToggle, onBackToComics})  {
  const [comic, setComic] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchComicDetail = async () => {
      try {
        const response = await axios.get(
          `https://gateway.marvel.com/v1/public/comics/${comicId}?ts=${ts}&apikey=${publicKey}&hash=${hash}`
        );

        setComic(response.data.data.results[0]);
      } 
      catch (error) {
        console.error("Informacion del comic no obtenida", error);
        setError("No se pudo acceder al comic");
      }
    };
    fetchComicDetail();
  }, [comicId]);

  if (error) return <p>{error}</p>;

  if (!comic) return <p className='cargando'>Cargando detalles, Por favor espere!</p>;

  return (
    <div className="comic-info">
      <h2 className="nombres">{comic.title}</h2>

      <img src={`${comic.thumbnail.path}.${comic.thumbnail.extension}`} alt={comic.title} />

      <p className='info'>{comic.description || "Descripción no disponible"}</p>

      <h3 className="personajes-gen">Personajes</h3>

      <div className="chars-list">
        {comic.characters.items.length > 0 ? (
          comic.characters.items.map((character, index) => (
            <div key={index} className="char">
              <p className="personajes-det">{character.name}</p>
            </div>
          ))
        ) : (
          <p className='info'>No hay personajes disponibles</p>
        )}
      </div>

      <button onClick={() => onFavoriteToggle(comic)} className="boton">Add Favs</button>
      <button onClick={onBackToComics} className="boton">Back</button>
    </div>
  );
};export default Info;