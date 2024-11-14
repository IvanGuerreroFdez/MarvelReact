import React, { useEffect, useState } from 'react';
import axios from 'axios';
import md5 from 'md5';
import '../styles/Marvel.css';

const publicKey = 'b513e6ca226166db85d570f258cb0737';
const privateKey = 'e1ee2f956b5401fc6dac804a5ecd9a4fd3de8d9f';

const ts = new Date().getTime();
const hash = md5(ts + privateKey + publicKey);

function Info ({comicId, onFavoriteToggle, onBackToComics})  {
  const [comic, setComic] = useState(null); //comic estado
  const [error, setError] = useState(null);
  const [characterDetails, setCharacterDetails] = useState([]); // personajes estado

  useEffect(() => {
    const fetchComicDetail = async () => {
      try {
        const response = await axios.get(
          `https://gateway.marvel.com/v1/public/comics/${comicId}?ts=${ts}&apikey=${publicKey}&hash=${hash}`
        );

        setComic(response.data.data.results[0]); //set comic
      } 
      catch (error) {
        console.error("Informacion del comic no obtenida", error);
        setError("No se pudo acceder al comic");
      }
    };
    fetchComicDetail();
  }, [comicId]);

  useEffect(() => {
    const fetchCharacterDetails = async () => {
      if (comic && comic.characters.items.length > 0) {
        const promises = comic.characters.items.map((character) =>
          axios.get(`${character.resourceURI}?ts=${ts}&apikey=${publicKey}&hash=${hash}`)
        );
        
        try {
          const results = await Promise.all(promises);
          const charactersData = results.map((res) => res.data.data.results[0]);
          setCharacterDetails(charactersData); // guardar detalles de personajes
        } catch (error) {
          console.error("Error al obtener detalles de personajes:", error);
        }
      }
    };

    fetchCharacterDetails();
  }, [comic]);

  if (error) return <p>{error}</p>;

  if (!comic) return <p className='cargando'>Cargando detalles, Por favor espere!</p>;

  const { title, description, thumbnail, pageCount, prices, dates} = comic; //comic data
  const price = prices.length > 0 ? `$${prices[0].price}` : "Precio no disponible";
  const publishDate = dates.find((date) => date.type === "onsaleDate");
  const formattedDate = publishDate ? new Date(publishDate.date).toLocaleDateString() : "Fecha no disponible";

  return (
    <div className="comic-info">
      <h2 className="nombres">{title}</h2>

      <img src={`${thumbnail.path}.${thumbnail.extension}`} alt={title} />

      <p className='info'>{description || "Descripcion no disponible"}</p>

      <p className="info">
        {pageCount ? `Numero de paginas: ${pageCount}` : "Numero de paginas no disponible"}
      </p>

      <p className='info'>Precio: {price || "Precio no disponible"}</p>

      <p className="info">Fecha de publicacion: {formattedDate}</p>

      <h3 className="personajes-gen">Personajes</h3>

      <div className="chars-list">
        {characterDetails.length > 0 ? (
          characterDetails.map((character, index) => (
            <div key={index} className="char">
              <img
                src={`${character.thumbnail.path}.${character.thumbnail.extension}`}
                alt={character.name}
                className="character-image"
              />
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