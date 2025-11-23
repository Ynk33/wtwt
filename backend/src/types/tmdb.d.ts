export type TMDBMovie = {
  id: number;
  title: string;
  overview: string;
  poster_path: string;
  genre_ids: number[];
  release_date: string;
  original_language: string;
  original_title: string;
  backdrop_path: string;
  popularity: number;
  vote_average: number;
  vote_count: number;
  adult: boolean;
  video: boolean;
};

export type TMDBMovieDetails = TMDBMovie & {
  status: string;
  tagline: string;
  runtime: number;
  genres: TMDBGenre[];
  production_countries: [
    {
      iso_3166_1: string;
      name: string;
    },
  ];
};

export type TMDBMovieCredits = {
  id: number;
  cast: TMDBMovieCast[];
  crew: TMDBMovieCrew[];
};

export type TMDBMovieCast = {
  id: number;
  name: string;
  original_name: string;
  gender: number;
  character: string;
  known_for_department: string;
  popularity: number;
  profile_path: string;
  cast_id: number;
  credit_id: string;
  adult: boolean;
};

export type TMDBMovieCrew = {
  id: number;
  adult: boolean;
  gender: number;
  known_for_department: string;
  name: string;
  original_name: string;
  popularity: number;
  profile_path: string;
  credit_id: string;
  department: string;
  job: string;
};

export type TMDBGenres = {
  genres: TMDBGenre[];
};

export type TMDBGenre = {
  id: number;
  name: string;
};

export type TMDBExternalIds = {
  id: number;
  imdb_id: string | null;
  wikidata_id: string | null;
  facebook_id: string | null;
  instagram_id: string | null;
  twitter_id: string | null;
};

export type TMDBMovieSearchResult = {
  page: number;
  results: TMDBMovie[];
  total_pages: number;
  total_results: number;
};

export type TMDBCountry = {
  iso_3166_1: string;
  english_name: string;
  native_name: string;
};
