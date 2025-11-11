import mongoose from "mongoose";
import dotenv from "dotenv";
import axios from "axios";
import Pokemon from "../models/Pokemon.js";

dotenv.config();

const seedPokemon = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ MongoDB connected");

    // Original 151 Pokémon
    const names = [
      "bulbasaur","ivysaur","venusaur","charmander","charmeleon","charizard",
      "squirtle","wartortle","blastoise","caterpie","metapod","butterfree",
      "weedle","kakuna","beedrill","pidgey","pidgeotto","pidgeot","rattata",
      "raticate","spearow","fearow","ekans","arbok","pikachu","raichu",
      "sandshrew","sandslash","nidoran-f","nidorina","nidoqueen","nidoran-m",
      "nidorino","nidoking","clefairy","clefable","vulpix","ninetales","jigglypuff",
      "wigglytuff","zubat","golbat","oddish","gloom","vileplume","paras","parasect",
      "venonat","venomoth","diglett","dugtrio","meowth","persian","psyduck","golduck",
      "mankey","primeape","growlithe","arcanine","poliwag","poliwhirl","poliwrath",
      "abra","kadabra","alakazam","machop","machoke","machamp","bellsprout","weepinbell",
      "victreebel","tentacool","tentacruel","geodude","graveler","golem","ponyta",
      "rapidash","slowpoke","slowbro","magnemite","magneton","farfetchd","doduo",
      "dodrio","seel","dewgong","grimer","muk","shellder","cloyster","gastly","haunter",
      "gengar","onix","drowzee","hypno","krabby","kingler","voltorb","electrode",
      "exeggcute","exeggutor","cubone","marowak","hitmonlee","hitmonchan","lickitung",
      "koffing","weezing","rhyhorn","rhydon","chansey","tangela","kangaskhan",
      "horsea","seadra","goldeen","seaking","staryu","starmie","mr-mime","scyther",
      "jynx","electabuzz","magmar","pinsir","tauros","magikarp","gyarados","lapras",
      "ditto","eevee","vaporeon","jolteon","flareon","porygon","omanyte","omastar",
      "kabuto","kabutops","aerodactyl","snorlax","articuno","zapdos","moltres",
      "dratini","dragonair","dragonite","mewtwo","mew"
    ];

    const pokemonData = [];

    for (let name of names) {
      try {
        const res = await axios.get(`https://pokeapi.co/api/v2/pokemon/${name}`);
        const sprite = res.data.sprites.front_default;
        pokemonData.push({ name, sprite });
      } catch (err) {
        console.log(`Failed to fetch ${name}: ${err.message}`);
      }
    }

    // Clear old data and insert new
    await Pokemon.deleteMany({});
    await Pokemon.insertMany(pokemonData);

    console.log("✅ Seeded Pokémon with sprites");
    mongoose.disconnect();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

seedPokemon();
