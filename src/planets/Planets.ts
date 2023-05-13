import Planet from "./Planet";
 
const planetArray: Planet[] = [];

  const Earth = new Planet("https://warframe.fandom.com/wiki/Earth", "Earth", ["Ferrite", "Rubedo", "Neurodes", "Detonite Ampule"]);
  const Lua = new Planet("https://warframe.fandom.com/wiki/Lua","Lua", ["Ferrite", "Rubedo", "Neurodes", "Detonite Ampule"]);
  const Venus = new Planet("https://warframe.fandom.com/wiki/Venus","Venus", ["Alloy Plate", "Polymer Bundle", "Circuits", "Fieldron Sample"]);
  const Mercury = new Planet("https://warframe.fandom.com/wiki/Mercury","Mercury", ["Morphics", "Ferrite", "Polymer Bundle", "Detonite Ampule"]);
  const Mars = new Planet("https://warframe.fandom.com/wiki/Mars","Mars", ["Morphics", "Salvage", "Gallium", "Fieldron Sample"]);
  const Ceres = new Planet("https://warframe.fandom.com/wiki/Ceres","Ceres", ["Alloy Plate", "Circuits", "Orokin Cell", "Detonite Ampule"]);
  const Jupiter = new Planet("https://warframe.fandom.com/wiki/Jupiter","Jupiter", ["Salvage", "Hexeneon", "Neural Sensor", "Alloy Plate"]);
  const Europa = new Planet("https://warframe.fandom.com/wiki/Europa","Europa", ["Morphics", "Rubedo", "Fieldron Sample", "Control Module"]);
  const Void = new Planet("https://warframe.fandom.com/wiki/Void","Void", ["Argon Crystal", "Orokin Cell", "Control Modules", "Ferrite"]);
  const Zariman = new Planet("https://warframe.fandom.com/wiki/Zariman_Ten_Zero","Zariman", ["Ferrite", "Alloy Plate", "Voidgel Orb", "Entrati Lanthorn"]);
  const Saturn = new Planet("https://warframe.fandom.com/wiki/Saturan","Saturn", ["Nano Spores", "Plastids", "Orokin Cell", "Detonite Ampule"]);
  const Uranus = new Planet("https://warframe.fandom.com/wiki/Uranus","Uranus", ["Polymer Bundle", "Plastids", "Gallium", "Detonite Ampule"]);
  const Neptune = new Planet("https://warframe.fandom.com/wiki/Neptune","Neptune", ["Nano Spores", "Ferrite", "Control Modules", "Fieldron Sample"]);
  const Pluto = new Planet("https://warframe.fandom.com/wiki/Pluto","Pluto", ["Rubedo", "Morphics", "Plastids", "Alloy Plate", "Fieldrone Sample"]);
  const Eris = new Planet("https://warframe.fandom.com/wiki/Eris","Eris", ["Nano Spores", "Plastids", "Neurodes", "Mutagen Sample"]);
  const Phobos = new Planet("https://warframe.fandom.com/wiki/Phobos","Phobos", ["Rubedo", "Morphics", "Plastids", "Alloy Plate"]);
  const Sedna = new Planet("https://warframe.fandom.com/wiki/Sedna","Sedna", ["Rubedo", "Alloy Plate", "Salvage", "Detonite Ampule"]);
  const KuvaFortress = new Planet("https://warframe.fandom.com/wiki/Kuva_Fortress","Kuva Fortress", ["Salvage", "Circuits", "Neural Sensors", "Detonite Ampule"]);

  planetArray.push(Earth);
  planetArray.push(Lua);
  planetArray.push(Venus);
  planetArray.push(Mercury);
  planetArray.push(Jupiter);
  planetArray.push(Ceres);
  planetArray.push(Mars);
  planetArray.push(Europa);
  planetArray.push(Void);
  planetArray.push(Zariman);
  planetArray.push(Saturn);
  planetArray.push(Uranus);
  planetArray.push(Neptune);
  planetArray.push(Pluto);
  planetArray.push(Eris);
  planetArray.push(Phobos);
  planetArray.push(Sedna);
  planetArray.push(KuvaFortress);

  export const Planets: Planet[] = planetArray;
