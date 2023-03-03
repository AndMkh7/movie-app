import React, { useState, useEffect } from 'react';
import s from './App.module.css'
import { Route, Routes, BrowserRouter } from 'react-router-dom';
import FavouritesList from './components/FavouritesList/FavouritesList';
import HomePage from './components/HomePage/HomePage';
import NaviBar from './components/Navigation/NaviBar';
import Login from './components/Login/Login';
import Signup from './components/SignUp/Signup';
import MoviePage from './components/MoviePage/MoviePage';
import NotFound from './components/NotFound/NotFound';
import { db, auth } from './firebase-config';
import { doc, updateDoc, arrayUnion , arrayRemove } from 'firebase/firestore';


const API_URL = 'https://api.themoviedb.org/3/movie/popular?api_key=41c7736fada50851ecd6e23d73e02ef4';
const API_SEARCH = 'https://api.themoviedb.org/3/search/movie?api_key=41c7736fada50851ecd6e23d73e02ef4&language=en-US&page=1&include_adult=false&query';
const GENRE_API = 'https://api.themoviedb.org/3/genre/movie/list?api_key=41c7736fada50851ecd6e23d73e02ef4&language=en-US';


function App () {

    const [movies, setMovies] = useState ([]);
    const [searchText, setSearchText] = useState ('');
    const [genres, setGenres] = useState ([]);
    const [filtered, setFiltered] = useState ([]);
    const [activeGenreId, setActiveGenreId] = useState (0);
    const [filterByYearValue, setFilterByYearValue] = useState ('all');
    const [loading, setLoading] = useState (false);
    const [isLoggedIn, setIsLoggedIn] = useState (false);
    const [favourites, setFavourites] = useState ([]);


    useEffect (() => {
        fetch (API_URL)
            .then ((res) => res.json ())
            .then (data => {
                setMovies (data.results);
                setLoading (true);
            })
    }, []);


    useEffect (() => {
        const timeoutId = setTimeout (() => {
            setLoading (true)
            fetch (GENRE_API)
                .then ((res) => res.json ())
                .then (data => {
                    console.log ('Genres', data);
                    setGenres (data.genres);
                    setLoading (false)
                })
            clearTimeout (timeoutId);
        }, 1200);


    }, []);


    const searchMovie = async (event) => {
        event.preventDefault ();
        console.log ('Searching');
        try {
            const url = API_SEARCH + '=' + searchText;
            const searchRes = await fetch (url);
            const searchData = await searchRes.json ();
            console.log ('search data', searchData);
            if ( searchData.results.length === 0 ) {
                console.log ('No data with your searching text')
            } else {
                setMovies (searchData.results);
                console.log ('searchText,', searchText)
                setSearchText ('');
            }

        } catch (error) {
            console.log (error);
            setSearchText ('');

        } finally {
            setSearchText ('');

        }
    };


    const changeHandler = (e) => {
        setSearchText (e.target.value);
    };


    const addFavouriteMovie = async (movie) => {


        try {

            const currentUser = auth.currentUser;

            const uid = currentUser.uid;


            const userRef = doc (db, 'users', `${uid}`);

            await updateDoc (userRef, {
                favourites: arrayUnion (
                    {
                        id: `${movie.id}`,
                        title: `${movie.title}`,
                        poster_path: `${movie.poster_path}`,
                        vote_average: `${movie.vote_average}`,
                        release_date: `${movie.release_date}`,
                    })
            });


            setFavourites (favourites);


            console.log ('Added to FavouritesList');

        } catch (error) {
            console.error (error);
        }
    };

    const removeFavouriteMovie = async (movieId) => {
        try {
            const currentUser = auth.currentUser;
            const uid = currentUser.uid;
            const userRef = doc(db, 'users', `${uid}`);
            await updateDoc(userRef, {
                favourites: arrayRemove({ id: movieId }),
            });
            console.log('Removed from FavouritesList');
        } catch (error) {
            console.error(error);
        }
    };


    return (


        <BrowserRouter>


            <div className={s.App} style={{maxWidth: '1920px', minWidth: '300px'}}>

                <div>
                    <NaviBar searchMovie={searchMovie} changeHandler={changeHandler}
                             isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn}/>
                </div>
                <div>
                    <Routes>
                        <Route index path="/" element={<Login setIsLoggedIn={setIsLoggedIn}/>}/>


                        <Route path="/home" element={<HomePage movies={movies} genres={genres} filtered={filtered}
                                                               searchText={searchText}
                                                               loading={loading} setFiltered={setFiltered}
                                                               activeGenreId={activeGenreId}
                                                               setActiveGenreId={setActiveGenreId}
                                                               filterByYearValue={filterByYearValue}
                                                               setFilterByYearValue={setFilterByYearValue}
                                                               changeHandler={changeHandler}
                                                               searchMovie={searchMovie} API_URL={API_URL}
                                                               addFavouriteMovie={addFavouriteMovie}
                        />}

                        />
                        <Route path="/trending" element={<HomePage movies={movies} genres={genres} filtered={filtered}
                                                                   searchText={searchText}
                                                                   loading={loading} setFiltered={setFiltered}
                                                                   activeGenreId={activeGenreId}
                                                                   setActiveGenreId={setActiveGenreId}
                                                                   filterByYearValue={filterByYearValue}
                                                                   setFilterByYearValue={setFilterByYearValue}
                                                                   changeHandler={changeHandler}
                                                                   searchMovie={searchMovie} API_URL={API_URL}
                                                                   addFavouriteMovie={addFavouriteMovie}
                        />}
                        />

                        <Route path="/favourites" element={<FavouritesList isLoggedIn={isLoggedIn}
                                                                           favourites={favourites}
                                                                           API_URL={API_URL}/>}
                               removeFavouriteMovie={removeFavouriteMovie}/>
                        <Route path="/login" element={<Login setIsLoggedIn={setIsLoggedIn}/>}/>
                        <Route path="/signup"
                               element={<Signup setIsLoggedIn={setIsLoggedIn} favourites={favourites}/>}/>
                        <Route path="/movie/:id" element={<MoviePage/>}/>
                        <Route path="*" element={<NotFound/>}/>
                    </Routes>
                </div>

            </div>
        </BrowserRouter>


    );
}


export default App;
