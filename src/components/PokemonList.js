import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Grid, Card, CardContent, Typography, CircularProgress } from '@mui/material';

const PokemonList = () => {
  const [pokemonData, setPokemonData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPageUrl, setCurrentPageUrl] = useState("https://pokeapi.co/api/v2/pokemon");
  const [nextPageUrl, setNextPageUrl] = useState("");
  const [prevPageUrl, setPrevPageUrl] = useState("");

  useEffect(() => {
    setLoading(true);
    setError(null);
    let cancel;
    axios.get(currentPageUrl, {
      cancelToken: new axios.CancelToken(c => cancel = c)
    }).then(response => {
      setLoading(false);
      setNextPageUrl(response.data.next);
      setPrevPageUrl(response.data.previous);
      setPokemonData(response.data.results);
    }).catch(e => {
      if (axios.isCancel(e)) return;
      setError(e);
      setLoading(false);
    });

    return () => cancel();
  }, [currentPageUrl]);

  if (loading) return <CircularProgress />;
  if (error) return <Typography variant="h6">Error loading Pokémon!</Typography>;

  return (
    <Grid container spacing={2}>
      {pokemonData.map(pokemon => (
        <Grid item xs={12} sm={6} md={4} key={pokemon.name}>
          <Card>
            <CardContent>
              <Typography variant="h5">{pokemon.name}</Typography>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
};

export default PokemonList;
