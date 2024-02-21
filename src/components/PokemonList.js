import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Grid, Card, CardContent, Typography, CircularProgress, Button, ButtonGroup, Dialog, DialogTitle, DialogContent, DialogContentText, TextField } from '@mui/material';

const PokemonList = () => {
    const [pokemonData, setPokemonData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentPageUrl, setCurrentPageUrl] = useState("https://pokeapi.co/api/v2/pokemon");
    const [nextPageUrl, setNextPageUrl] = useState("");
    const [prevPageUrl, setPrevPageUrl] = useState("");
    const [open, setOpen] = useState(false);
    const [selectedPokemon, setSelectedPokemon] = useState({});
    const [searchQuery, setSearchQuery] = useState("");

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

    const gotoNextPage = () => {
        setCurrentPageUrl(nextPageUrl);
    };

    const gotoPrevPage = () => {
        setCurrentPageUrl(prevPageUrl);
    };

    const fetchPokemonDetails = async (pokemonUrl) => {
        setLoading(true);
        try {
            const response = await axios.get(pokemonUrl);
            console.log(response.data)
            setSelectedPokemon(response.data);
            setOpen(true);

        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    }


    return (
        <div>
            {loading ? <CircularProgress /> : (
                <>
                    <TextField
                        label="Search Pokémon"
                        variant="outlined"
                        fullWidth
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        style={{ marginBottom: '20px' }}
                    />
                    <Grid container spacing={2}>
                        {pokemonData
                            .filter(pokemon => pokemon.name.toLowerCase().includes(searchQuery.toLowerCase()))
                            .map(pokemon => (
                            <Grid item xs={12} sm={6} md={4} key={pokemon.name}>
                                <Card onClick={() => fetchPokemonDetails(pokemon.url)} style={{ cursor: 'pointer' }} >
                                    <CardContent>
                                        <Typography variant="h5">{pokemon.name}</Typography>
                                    </CardContent>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>
                    <ButtonGroup variant="contained" color="primary" aria-label="contained primary button group">
                        {prevPageUrl && <Button onClick={gotoPrevPage}>Previous</Button>}
                        {nextPageUrl && <Button onClick={gotoNextPage}>Next</Button>}
                    </ButtonGroup>
                    <Dialog open={open} onClose={() => setOpen(false)}>
                        <DialogTitle>{selectedPokemon.name}</DialogTitle>
                        <DialogContent>
                            <DialogContentText>
                                {/* Display details here. Example: */}
                                Height: {selectedPokemon.height}
                                <br />
                                Weight: {selectedPokemon.weight}
                            </DialogContentText>
                            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: '20px' }}>
                                {selectedPokemon.sprites?.front_default && (
                                    <img src={selectedPokemon.sprites.front_default} alt="Front" style={{ marginRight: '10px' }} />
                                )}
                                {selectedPokemon.sprites?.back_default && (
                                    <img src={selectedPokemon.sprites.back_default} alt="Back" />
                                )}
                            </div>
                        </DialogContent>
                        <Button onClick={() => setOpen(false)}>Close</Button>
                    </Dialog>
                </>
            )}
        </div>
    );



};

export default PokemonList;
