import React from 'react';
import  s from "./MovieCard.module.css";
import PropTypes from 'prop-types';


MovieCard.propTypes={
    title:PropTypes.string,
    poster_path:PropTypes.string,
    release_date:PropTypes.string,
    vote_average:PropTypes.number,

}

const API_IMG = "https://image.tmdb.org/t/p/w500" ;

function MovieCard ({title,poster_path,release_date,vote_average}) {
    return (

        <div className={s.movieCard}>
            <div className={s.movieCardData}>
                <div className={s.title}>{title}</div>
                <img className={s.img} src={API_IMG+poster_path}  alt={title}/>
                <div className={s.aboutMovie}>
                    <div className={s.date}>{release_date}</div>
                    <div className={vote_average>=7?s.rateAqua:s.rate} >{vote_average}</div>
                </div>
            </div>

        </div>
    )
}

export  default MovieCard;

