import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Grid, Card, CardContent, Typography, CircularProgress, Button, ButtonGroup, Dialog, DialogTitle, DialogContent, DialogContentText, TextField, Slider } from '@mui/material';
import '../styles.css';

const PokemonList = () => {
    const [pokemonData, setPokemonData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [allPokemon, setAllPokemon] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(6);
    const [open, setOpen] = useState(false);
    const [selectedPokemon, setSelectedPokemon] = useState({});
    const [searchQuery, setSearchQuery] = useState("");

    const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
    const [selectedLetter, setSelectedLetter] = useState("");

    useEffect(() => {

        setLoading(true);
        setError(null);

        const fetchAllPokemon = async () => {
            try {
                const totalResponse = await axios.get("https://pokeapi.co/api/v2/pokemon/?limit=1");
                const totalCount = totalResponse.data.count;

                const response = await axios.get(`https://pokeapi.co/api/v2/pokemon/?limit=${totalCount}`);
                // order by name
                response.data.results.sort((a, b) => a.name.localeCompare(b.name));
                setAllPokemon(response.data.results);
            } catch (error) {
                setError(error);
            } finally {
                setLoading(false);
            }
        };

        fetchAllPokemon();

    }, []);

    if (loading) return <CircularProgress />;
    if (error) return <Typography variant="h6">Error loading Pokémon!</Typography>;

    const indexOfLastPokemon = currentPage * itemsPerPage;
    const indexOfFirstPokemon = indexOfLastPokemon - itemsPerPage;
    let currentPokemons = allPokemon.slice(indexOfFirstPokemon, indexOfLastPokemon);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);



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

    const pageCount = Math.ceil(allPokemon.length / itemsPerPage);

    // Function to handle going to the next page
    const gotoNextPage = () => {
        setCurrentPage((prev) => (prev < pageCount ? prev + 1 : prev));
    };

    // Function to handle going to the previous page
    const gotoPrevPage = () => {
        setCurrentPage((prev) => (prev > 1 ? prev - 1 : prev));
    };

    const marks = alphabet.map((letter, index) => ({
        value: index,
        label: letter
    }));

    const filteredPokemonData = selectedLetter
        ? allPokemon.filter(pokemon => pokemon.name.toUpperCase().startsWith(selectedLetter))
        : allPokemon;

    // Then apply the search query filter if necessary
    const finalPokemonData = filteredPokemonData.filter(pokemon => pokemon.name.toLowerCase().startsWith(searchQuery.toLowerCase()));

    currentPokemons = finalPokemonData.slice(indexOfFirstPokemon, indexOfLastPokemon);


    return (
        
        <div style={{ display: 'flex' }}>
            <div style={{ minWidth: '50px', height: '100%', marginRight: '20px' }}>
      <Typography id="alphabet-slider" gutterBottom>
        Alphabet Slider
      </Typography>
      <Slider
        orientation="vertical"
        marks={marks}
        valueLabelDisplay="on"
        step={null}
        value={typeof selectedLetter === 'string' ? alphabet.indexOf(selectedLetter) : 0}
        onChange={(event, newValue) => setSelectedLetter(alphabet[newValue])}
        aria-labelledby="alphabet-slider"
        min={0}
        max={25}
      />
    </div>
    <div style= {{ flexGrow: 1, width: '100%' }}>
            <TextField
                label="Search Pokémon"
                variant="outlined"
                fullWidth
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{ marginBottom: '20px' }}
            />

            <Grid container spacing={2} style={{ }}>
                {currentPokemons
                    .filter(pokemon => pokemon.name.toLowerCase().includes(searchQuery.toLowerCase()))
                    .map(pokemon => (
                        <Grid item xs={12} sm={6} md={4} key={pokemon.name} >
                            <Card onClick={() => fetchPokemonDetails(pokemon.url)} className='pokemon-card'>
                                <CardContent className='card-content'>
                                    <Typography variant="h5" style={{ color: '#FFE66D' }}>{pokemon.name}</Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                    ))}
            </Grid>
            <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
                <Button className="button" disabled={currentPage === 1} onClick={gotoPrevPage}>Previous</Button>
                <Button className="button" disabled={currentPage === pageCount} onClick={gotoNextPage}>Next</Button>
            </div>
            <Dialog style={{borderColor: 'black'}} open={open} onClose={() => setOpen(false)}>
                <DialogTitle>{selectedPokemon.name}</DialogTitle>
                <DialogContent>
                    <DialogContentText>
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
        </div>
        </div>
    );



};

export default PokemonList;
