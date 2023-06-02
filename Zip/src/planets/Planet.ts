export default class Planet {
    plan
    planetWiki: string;
    planetName: string;
    resources: string[];
    constructor(planetWiki, planetName, resources = []){
        this.planetWiki = planetWiki;
        this.planetName = planetName;
        this.resources = resources;
    }

    getPlanetWikiLink(){
        return this.planetWiki;
    }

    getPlanetName() {
        return this.planetName;
    }

    getResources() {
        return this.resources;
    }
}