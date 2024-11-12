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
  const [filteredComics, setFilteredComics] = useState([]);
  const [filters, setFilters] = useState({ price: '', pages: '', character: '', date: '' });

  useEffect(() => {
    const fetchComics = async () => {
      try {
        const response = await axios.get(
          `https://gateway.marvel.com/v1/public/comics?orderBy=modified&ts=${ts}&apikey=${publicKey}&hash=${hash}`
        );
        
        setComics(response.data.data.results); //guardado de resultados
        setFilteredComics(response.data.data.results); //implementacion de filtros
      } 
      catch (error) {
        console.error("Informacion del comic no obtenida", error);
        setError("No se pudo acceder al comic");
      }
    };

    fetchComics();
  }, []); 

  if (error) return <p className="cargando">{error}</p>;

  const handleFilterChange = (e) => {
    const { name, value } = e.target;

    setFilters((prevFilters) => ({
      ...prevFilters,
      [name]: value,
    }));
  };

  const applyFilters = () => {
    const filtered = comics.filter((comic) => {
      const price = comic.prices[0]?.price || 0;
      const pages = comic.pageCount || 0;
      const date = new Date(comic.dates.find(d => d.type === 'onsaleDate')?.date).getFullYear(); //formato de fecha
      const characterNames = comic.characters.items.map(c => c.name.toLowerCase()); //filtrar personajes en minuscula

      return (
        (filters.price ? price <= parseFloat(filters.price) : true) &&
        (filters.pages ? pages >= parseInt(filters.pages) : true) &&
        (filters.date ? date === parseInt(filters.date) : true) &&
        (filters.character ? characterNames.includes(filters.character.toLowerCase()) : true)
      );
    });

    setFilteredComics(filtered);
    setCurrentIndex(0);
  }; //aplicar filtros

  const handleNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % filteredComics.length);
  };

  const handlePrevious = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + filteredComics.length) % filteredComics.length);
  };

  const currentComic = filteredComics[currentIndex];

  return (
    <div className="comics">
      <h2 className="cargando">¡Encuentra lo que buscas!</h2>

      <div className="filter-container">
        <input className='filtro'
          type="number"
          name="price"
          placeholder="Max Precio"
          value={filters.price}
          onChange={handleFilterChange}
        />

        <input className='filtro'
          type="number"
          name="pages"
          placeholder="Min Paginas"
          value={filters.pages}
          onChange={handleFilterChange}
        />

        <br></br>

        <input className='filtro'
          type="text"
          name="character"
          placeholder="Nombre Personaje"
          value={filters.character}
          onChange={handleFilterChange}
        />

        <input className='filtro'
          type="number"
          name="date"
          placeholder="Año Publicación"
          value={filters.date}
          onChange={handleFilterChange}
        />

        <br></br>

        <button onClick={applyFilters} className="boton-filtros">Aplicar Filtros</button>
      </div>

      {filteredComics.length > 0 ? (
        <div className="comics-detallado">
          <img src={`${currentComic.thumbnail.path}.${currentComic.thumbnail.extension}`} alt={currentComic.title} />
          
          <h3 className="nombres">{currentComic.title}</h3>
          
          <p className="info">Precio: ${currentComic.prices[0]?.price || "No disponible"}</p>
          
          <p className="info">
            {currentComic.pageCount ? `Número de páginas: ${currentComic.pageCount}` : "Número de páginas no disponible"}
          </p>

          <p className="info">Fecha de Publicación: {new Date(currentComic.dates.find(d => d.type === 'onsaleDate')?.date).toLocaleDateString() || "N/A"}</p>
          
          <div className="comic-navigation">
            <button onClick={handlePrevious} className="boton">Prev</button>
            <button onClick={() => onComicSelect(currentComic.id)} className="boton">Detalles</button>
            <button onClick={handleNext} className="boton">Next</button>
          </div>
        </div>
      ) : (
        <p className="cargando">No se encontraron comics con los filtros aplicados</p>
      )}
    </div>
  );
};export default Comics;