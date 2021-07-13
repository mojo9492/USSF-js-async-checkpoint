#!/usr/bin/env node
/*I - text file
O - log string, log name: types ex. Charizard: flying, fire
C - use pokeAPI
E - no exceptions at this time*/
import fs from "fs";
import fetch from "node-fetch";

const pokemonFileName = process.argv[2];

const pokeTypeSearch = function (textFile) {
    //read file
    if (typeof textFile === 'string') {
        const pokemon = new Promise((resolve, reject) => {
            fs.readFile(textFile, 'utf-8', (error, pokemonList) => {
                if (error) {
                    reject(error);
                } else {
                    //each file line is a new pokemon
                    resolve(pokemonList.split('\n'));
                }
            })
        })

        pokemon.then(pokemonArray => {
            const pokemonPromiseArray = [];

            for (let i = 0; i < pokemonArray.length; i++) {
                pokemonPromiseArray.push(fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonArray[i]}`)
                    .then(res => res.json())
                    .catch(error => console.log('Check your file for correct spelling and if pokemon exists', error)))


            }

            return Promise.all(pokemonPromiseArray)
                .then(data => {
                    for (let i = 0; i < data.length; i++) {
                        const pokemon = data[i];

                        if (pokemon) {
                            const cap = pokemon.name[0].toUpperCase();
                            const rest = pokemon.name.split(pokemon.name[0]);

                            const pokeCapName = rest.join(cap);

                            if (pokemon.types[1]) {
                                console.log(`${pokeCapName}: ${pokemon.types[0].type.name}, ${pokemon.types[1].type.name} `)
                            }
                            else { console.log(`${pokeCapName}: ${pokemon.types[0].type.name}`) }
                        } else {
                            console.log('The pokemon on this line doensn\'t exist');
                        }
                    }
                });
        })
    } else {
        const errorMsg = new Error(`You need to create a file or use a the given test.txt file and type:
         node . <fileName>
          in order to run this function
          `)
        console.log(errorMsg);
    }
}


pokeTypeSearch(pokemonFileName)