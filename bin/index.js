#!/usr/bin/env node
/*I - text file
O - log string, log name: types ex. Charizard: flying, fire
C - use pokeAPI
E - no exceptions at this time*/
import fs from "fs";
import fetch from "node-fetch";

const pokemonFileNameHandler = () => {
    let result;

    if (process.argv[2]) {
        result = process.argv[2];
    } else {
        console.log('\nNo file given as argument, defaulting to test.txt... \n' +
        'if you want to source your own file, type:\n node . <your file name here>\n to run the file\n');
        result = './test.txt';
    }
    return result;
}

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

                            let fileToWrite = '';

                            if (pokemon.types[1]) {
                                fileToWrite += `${pokeCapName}: ${pokemon.types[0].type.name}, ${pokemon.types[1].type.name}\n`;
                            } else {
                                fileToWrite += `${pokeCapName}: ${pokemon.types[0].type.name}\n`
                            }
                            console.log(fileToWrite)

                            fs.appendFile('./pokemonAttributes.txt', fileToWrite, (err) => {
                                if (err) {
                                    const errorMsg = new Error('Something went wrong')
                                    console.log(errorMsg);
                                } else {
                                    console.log('Successfully written file');
                                }
                            })
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

pokeTypeSearch(pokemonFileNameHandler())