import fetch from 'node-fetch';
import {client} from '../index';
import { Channel, EmbedBuilder, TextChannel } from 'discord.js';
import { Planets } from '../planets/Planets';
import { FissureResponse } from './interfaces';
import { roles } from '../roles/Roles';
export default class FissureService {
    private readonly _fissureUrl = "https://api.warframestat.us/pc/fissures";

    private allAxiFissuresEtas: number[] = [];
    private allNeoFissuresEtas: number[] = [];
    private allMesoFissuresEtas: number[] = [];
    private allLithFissuresEtas: number[] = [];
    private allRequiemFissuresEtas: number[] = [];
    private allLowestFissureTimes: number[] = [];

    private relicTypes: string[] = ['Axi','Neo', 'Meso', 'Lith', 'axi','neo','meso', 'lith', 'Requiem', 'requiem'];
    private missionTypoes: string[] = ['Survival', 'Interception', 'Disruption', 'Excavation', 'survival', 'interception', 'disruption', 'excavation'];
    public async getFissures() {
        
        const response = await fetch(this._fissureUrl);
        const responseData = await response.json();

        if(Array.isArray(responseData)) {
            const fissures: any[] = responseData;
            console.log(process.env.hostingChannel)
            const channel = await client.channels.fetch(process.env.hostingChannel) as TextChannel | undefined;
            //get a list of all the channels in the server
            console.log(channel)
            let currentTimeRemaining: string = "";
            let currentMissionTypes: string = "";
            let currentResources: string = "";
    
    
            //creating embed to send to channel
            const embed = new EmbedBuilder();
    
            //setting embed title
            embed.setTitle("Current Fissures");
    
            //looping through reponses to see which are steel path mission
            for (const fissure of fissures){
                if(!fissure['isStorm'] && fissure['isHard']) {

                    if(fissure['tier'] === 'Axi') {
                        this.allAxiFissuresEtas.push(this.getTimeFromFissure(fissure));
                    }
               
                    if(fissure['tier'] === 'Meso') {
                        this.allMesoFissuresEtas.push(this.getTimeFromFissure(fissure));
                    }
               
                    if(fissure['tier'] === 'Neo') {
                        this.allNeoFissuresEtas.push(this.getTimeFromFissure(fissure));
                    }
               
                    if(fissure['tier'] === 'Lith') {
                        this.allLithFissuresEtas.push(this.getTimeFromFissure(fissure));
                    }
                      
                    if(fissure['tier'] === 'Requiem') {
                        this.allRequiemFissuresEtas.push(this.getTimeFromFissure(fissure));
                    }

                    if(fissure['missionKey'] === 'Survival' || fissure['missionKey'] ===  'Excavation' || fissure['missionKey'] ===  'Disruption' ||  fissure['missionKey'] ===  'Interception' ) 
                    {
                      let currentPlanet = Planets.find(planets => fissure['nodeKey'].includes(planets.getPlanetName()));
                      currentMissionTypes += '' + fissure['tier'] + ' ' + fissure['missionKey'] + '\n';
                      currentResources += "[" + currentPlanet.getPlanetName() +"]("+currentPlanet.getPlanetWikiLink()+" '" + currentPlanet.getResources() + "')\n";
                      currentTimeRemaining += this.getTimeFromFissure(fissure);
                     }
                }
            }

            const nextFissureMessage = 
            '\n\nNext Axi fissure ' + this.convertSecsToTimestamp(Math.min(...this.allAxiFissuresEtas)) + 
            'Next Neo fissure ' + this.convertSecsToTimestamp(Math.min(...this.allNeoFissuresEtas)) +
            'Next Meso fissure ' + this.convertSecsToTimestamp(Math.min(...this.allMesoFissuresEtas)) +
            'Next Lith fissure ' + this.convertSecsToTimestamp(Math.min(...this.allLithFissuresEtas)) +
            'Next Requim fissure ' + this.convertSecsToTimestamp(Math.min(...this.allRequiemFissuresEtas));

            const embedMessage: FissureResponse = this.checkIfFoundAnyFissures(currentMissionTypes, currentResources, currentTimeRemaining, nextFissureMessage);

            if(embedMessage.foundAnyFissures) {
                embed.addFields( 
                    {name: embedMessage.fieldNameOne, value: embedMessage.fieldOneValue, inline: true}, 
                    {name: embedMessage.fieldNameTwo, value: embedMessage.fieldTwoValue, inline: true}, 
                    {name: embedMessage.fieldThreeName, value: embedMessage.fieldThreeValue , inline: true} , 
                    {name: embedMessage.fieldFourName, value: embedMessage.fieldFourValue});
                 
            } else {
                //if no fissures were found
                embed.addFields(
                    {name: embedMessage.fieldOneValue, value: embedMessage.fieldOneValue, inline: true})
            }

            //get roles to ping
            const rolesToPing = this.getRolesToPing(currentMissionTypes);


            //get messages from channel
            //const messages = await channel.messages.fetch()

        
            // await channel.messages.fetch(process.env.fissureMessageId)
            // .then(currentMsg => {
            //     console.log(currentMsg)
            // //  currentMsg.forEach(msg => {
            // //   if(msg.author.bot && msg.embeds.length > 0) {
            // //     msg.edit({ embeds: [embed]});
            // //    }
            // //  })
            // })
            // .catch(console.error);
        }


        //return fissures;
    }

    public getTimeFromFissure(fissure: any): number {
        let hour: number = fissure['eta'].indexOf('h');
        let mins: number = fissure['eta'].indexOf('m');
        let secs: number = fissure['eta'].indexOf('s');
        let totalMins: string = "";
        let totalSecs: string = "";
        let minsReversed: string = "";
        let secsReversed: string = "";
        let ttlSecs: number = 0;
      
        if(hour > 0) {
          ttlSecs += 3600;
        }
      
        if(mins > 0) {
          for(let i: number = mins - 1; i >= 0; i--) {
            if(fissure['eta'].charAt(i) !== ' ' && fissure['eta'].charAt(i) !== 'h' && fissure['eta'].charAt(i) !== 'm'){
              totalMins += fissure['eta'].charAt(i);
            } else {
              break;
            }
          }
          for (let i: number = totalMins.length - 1; i >= 0; i--) {
            minsReversed += totalMins[i];
          }
          ttlSecs += parseFloat(minsReversed) * 60;
        }
      
        if(secs > 0) {
          for(let i: number = secs - 1; i >= 0; i--) {
            if(fissure['eta'].charAt(i) !== ' ' && fissure['eta'].charAt(i) !== 'h' && fissure['eta'].charAt(i) !== 'm'){
              totalSecs += fissure['eta'].charAt(i);
            } else {
              break;
            }
          }
      
          for (let i: number = totalSecs.length - 1; i >= 0; i--) {
            secsReversed += totalSecs[i];
          }
          ttlSecs += parseFloat(secsReversed);
        }
      
        return ttlSecs;
      }

      private getRolesToPing(currentMissionTypes: string): string {
        let resultString = "";
        roles.forEach(roles => {
          if(currentMissionTypes.toLowerCase().includes(roles.getMissionType().toLowerCase()) && !resultString.includes(roles.getMissionType())) {
            resultString += roles.getRoleId() + ' ';
          }
        })
      
        return resultString;
      }

      private convertSecsToTimestamp(timeInSecs: number): string {
        let newDate = new Date();
        newDate.setSeconds(newDate.getSeconds() + timeInSecs);
        return 'is <t:' + Math.floor(newDate.getTime() / 1000) + ':R>\n';
      }

      private checkIfFoundAnyFissures(currentMissionTypes: string, currentResources: string,
         currentTimeRemaining: string, nextFissureMessage: string): FissureResponse {
            {
                if (currentMissionTypes === "" || currentResources === "" || currentTimeRemaining === "") {
                  return {
                    foundAnyFissures: false,
                    fieldOneName: 'No Endless Fissures Found',
                    fieldOneValue: nextFissureMessage
                  };
                } else {
                  return {
                    foundAnyFissures: true,
                    fieldNameOne: "Mission Type",
                    fieldOneValue: currentMissionTypes,
                    fieldNameTwo: "Planet",
                    fieldTwoValue: currentResources,
                    fieldThreeName: "Time Left",
                    fieldThreeValue: currentTimeRemaining,
                    fieldFourName: 'Times are below of next fissures that should pop',
                    fieldFourValue: nextFissureMessage
                  };
                }
            }
    }

}


