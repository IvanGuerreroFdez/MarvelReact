import React, { useEffect, useState } from 'react';
import axios from 'axios';
import md5 from 'md5';
import '../styles/Marvel.css';

const publicKey = 'b513e6ca226166db85d570f258cb0737';
const privateKey = 'e1ee2f956b5401fc6dac804a5ecd9a4fd3de8d9f';

const ts = new Date().getTime();
const hash = md5(ts + privateKey + publicKey); //hash de verificacion

function Comics ({onComicSelect})  {
  const [comics, setComics] = useState([]);
  const [error, setError] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0); //indice del comic actual

  useEffect(() => {
    const fetchComics = async () => {
      try {
        const response = await axios.get(
          `https://gateway.marvel.com/v1/public/comics?orderBy=modified&ts=${ts}&apikey=${publicKey}&hash=${hash}`
        );
        
        setComics(response.data.data.results); //guardado de resultados
      } 
      catch (error) {
        console.error("Informacion del comic no obtenida", error);
        setError("No se pudo acceder al comic");
      }
    };

    fetchComics();
  }, []); 

  const handleNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % comics.length); //next comic
  };

  const handlePrevious = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + comics.length) % comics.length); //prev comic
  };

  const currentComic = comics[currentIndex];

  if (error) return <p className="cargando">{error}</p>;

  return (
    <div className="comics">
      {comics.length > 0 ? (
        <div className="comics-detallado">
          <img src={`${currentComic.thumbnail.path}.${currentComic.thumbnail.extension}`} alt={currentComic.title} />
          
          <h3 className="nombres">{currentComic.title}</h3>

          <p className='info'>{currentComic.description || "Sin descripción disponible"}</p>
          
          <div className="comic-navigation">
            <button onClick={handlePrevious} className="boton">Prev</button>

            <button onClick={() => onComicSelect(currentComic.id)} className="boton">Detalles</button>

            <button onClick={handleNext} className="boton">Next</button>
          </div>
        </div>
      ) : (
        <p className="cargando">Cargando comics, Por favor espere!</p>
      )}
    </div>
  );
};export default Comics;