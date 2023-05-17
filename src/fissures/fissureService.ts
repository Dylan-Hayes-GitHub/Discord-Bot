import fetch from 'node-fetch';
import {client} from '../index';
import { Channel, EmbedBuilder, Message, TextChannel } from 'discord.js';
import { Planets } from '../planets/Planets';
import { roles } from '../roles/Roles';
import { channel } from '../events/ready';
import { FissureResponse } from './interfaces';
import { get, getDatabase, push, ref } from 'firebase/database';
export default class FissureService {
    private readonly _fissureUrl = "https://api.warframestat.us/pc/fissures/?language=en";

    private allAxiFissuresEtas: number[] = [];
    private allNeoFissuresEtas: number[] = [];
    private allMesoFissuresEtas: number[] = [];
    private allLithFissuresEtas: number[] = [];
    private allRequiemFissuresEtas: number[] = [];
    private allLowestFissureTimes: number[] = [];

    private relicTypes: string[] = ['Axi','Neo', 'Meso', 'Lith', 'axi','neo','meso', 'lith', 'Requiem', 'requiem'];
    private missionTypes: string[] = ['Survival', 'Interception', 'Disruption', 'Excavation', 'survival', 'interception', 'disruption', 'excavation'];
    public async getFissures(discordChannel: TextChannel) {
        try {
          const response = await fetch(this._fissureUrl);
          const responseData = await response.json();
  
          if(Array.isArray(responseData) && response.status === 200) {
              const fissures: any[] = responseData;
              const allHardFissureData: any[] = [];
              // const channel = client.channels.cache.get('1013907131902210133');
              // await channel.delete("1106676523899027546")  
            //get a list of all the channels in the server
              let currentTimeRemaining: string = "";
              let currentMissionTypes: string = "";
              let rolesForPinging: string[] = [];
              let currentResources: string = "";
              let currentMissionNodes: string = "";
      
      
              //creating embed to send to channel
              const embed = new EmbedBuilder();

              //setting embed title
              embed.setTitle("Active endless fissures");
                //save to firebase

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
                        allHardFissureData.push(fissure);

                        let currentPlanet = Planets.find(planets => fissure['nodeKey'].includes(planets.getPlanetName()));
                        currentMissionTypes += '' + fissure['tier'] + ' ' + fissure['missionKey'] + " - "+ fissure['node'] + '\n';
                        currentResources += "[" + currentPlanet.getPlanetName() +"]("+currentPlanet.getPlanetWikiLink()+" '" + currentPlanet.getResources() + "')\n";
                        currentMissionNodes += "" + fissure['node'] + "\n";
                        if(!rolesForPinging.includes('' + fissure['tier'] + fissure['missionKey'])){
                          rolesForPinging.push('' + fissure['tier'] + fissure['missionKey']);
                        }
                        currentTimeRemaining += this.convertSecondsToTimeStamp(this.getTimeFromFissure(fissure));
                      }
                  }
              }

              //save fissure data to firebase

              const db = getDatabase();
              push(ref(db, 'fissureData'), allHardFissureData);
              const relicSubscriptionsForPinging: string[] = await this.getUsersToPingFromFirebase(rolesForPinging);
              
              const nextFissureMessage = 
              '\n\nNext Axi fissure ' + this.convertSecsToTimestamp(Math.min(...this.allAxiFissuresEtas)) + 
              'Next Neo fissure ' + this.convertSecsToTimestamp(Math.min(...this.allNeoFissuresEtas)) +
              'Next Meso fissure ' + this.convertSecsToTimestamp(Math.min(...this.allMesoFissuresEtas)) +
              'Next Lith fissure ' + this.convertSecsToTimestamp(Math.min(...this.allLithFissuresEtas)) +
              'Next Requim fissure ' + this.convertSecsToTimestamp(Math.min(...this.allRequiemFissuresEtas));
  
              const embedMessage: FissureResponse = this.checkIfFoundAnyFissures(currentMissionTypes, currentResources, currentTimeRemaining, currentMissionNodes, nextFissureMessage);

              if(embedMessage.foundAnyFissures) {
                embed.addFields( 
                  { name: embedMessage.missionType, value: embedMessage.currentMissionTypes, inline: true }, 
                  { name: embedMessage.planet, value: embedMessage.currentPlanetResources, inline: true }, 
                  { name: embedMessage.timeLeft, value: embedMessage.currentTimesLeft, inline: true },
                  { name: embedMessage.upComingFissures, value: embedMessage.nextFissureMessage, inline: false }
                );
              } else {
                  //if no fissures were found
                  embed.addFields(
                      {name: embedMessage.noActiveEndlessFissure, value: embedMessage.nextFissureMessage, inline: true})
              }
  
              //get roles to ping
              const rolesToPing = this.getRolesToPing(currentMissionTypes);
              console.log(currentMissionTypes);
              if(relicSubscriptionsForPinging.length > 0) {
                const joinedRolesToPing = relicSubscriptionsForPinging.join(' ');
                console.log(joinedRolesToPing);
                const rolePingMessage = await discordChannel.send(joinedRolesToPing);
                rolePingMessage.delete();
              }
              
              //send message to channel
              await channel.messages.fetch(process.env.embedId)
              .then(currentMsg => {
                if(currentMsg.author.id === client.user.id){
                  currentMsg.edit({embeds: [embed]});
                } else {
                  channel.send({embeds: [embed]});
                }
              })
              .catch((error) => {
                console.log(error)
                channel.send({embeds: [embed]});
              }
          );
  
  
  
              //store the smallest value in each relic tier into array
              this.allLowestFissureTimes.push(Math.min(...this.allAxiFissuresEtas));
              this.allLowestFissureTimes.push(Math.min(...this.allNeoFissuresEtas));
              this.allLowestFissureTimes.push(Math.min(...this.allMesoFissuresEtas));
              this.allLowestFissureTimes.push(Math.min(...this.allLithFissuresEtas));
              this.allLowestFissureTimes.push(Math.min(...this.allRequiemFissuresEtas));
  
              const dealyedTimeBeforeStartingLoopAgain = this.getDelayTimeBeforeStartingLoopAgain(this.allLowestFissureTimes);
              
  
              //clear all arrays
              this.allAxiFissuresEtas = [];
              this.allNeoFissuresEtas = [];
              this.allMesoFissuresEtas = [];
              this.allLithFissuresEtas = [];
              this.allRequiemFissuresEtas = [];
              this.allLowestFissureTimes = [];
  
              setTimeout(() => {
              this.getFissures(channel);
              }, dealyedTimeBeforeStartingLoopAgain);
          } 
        } catch (error) {
          console.log(error)
          setTimeout(() => {
            this.getFissures(channel);
            }, 30000);
        }
        //return fissures;
    }
  async getUsersToPingFromFirebase(rolesForPinging: string[]): Promise<string[]> {
    const db = getDatabase();

    const usersToPing: Set<string> = new Set();
    for(let i =0; i < rolesForPinging.length; i++) {
      const usersRef = ref(db, 'subscriptions/' + rolesForPinging[i]);
      const relicsForPinging = await get(usersRef);
      
      if(relicsForPinging.exists()) {
        const users = relicsForPinging.val();
        const userIDs: string[] = Object.values(users);
        for (let j = 0; j < userIDs.length; j++) {
          usersToPing.add("<@" + userIDs[j] + ">");
        }
  
      }
    }
    return Array.from(usersToPing);
  }
  getDelayTimeBeforeStartingLoopAgain(allLowestFissureTimes: number[]) {
    const lowestTimeInSeconds = Math.min(...allLowestFissureTimes);
    const delayTimeInMilliseconds = (lowestTimeInSeconds * 1000) + 10000;
    return delayTimeInMilliseconds;
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
        return ttlSecs + 120;
      }

      private convertSecondsToTimeStamp(timeInSecs: number): string { 
        const newDate = new Date();
        newDate.setSeconds(newDate.getSeconds() + timeInSecs + 120);
        return 'Ends <t:' + Math.floor(newDate.getTime() / 1000) + ':R>\n';
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


      private checkIfFoundAnyFissures(
        currentMissionTypes: string,
        currentResources: string,
        currentTimeRemaining: string,
        currentMissionNodes: string,
        nextFissureMessage: string
      ): FissureResponse {
        if(currentMissionTypes === "") {
          return {
            foundAnyFissures: false,
            missionType: "Mission Type",
            currentMissionTypes: currentMissionTypes,
            planet: "Planet",
            currentPlanetResources: currentResources,
            timeLeft: "Time Left",
            currentTimesLeft: currentTimeRemaining,
            missionNode: "Mission Node",
            nodeName: currentMissionNodes,
            upComingFissures: "Times are below of next fissures that should pop up",
            nextFissureMessage: nextFissureMessage,
            noActiveEndlessFissureMessage: "No active endless fissures found",
            noActiveEndlessFissure: "No Endless Fissures Found"
          }
        } else {
          return {
            foundAnyFissures: true,
            missionType: "Mission Type",
            currentMissionTypes: currentMissionTypes,
            planet: "Planet",
            currentPlanetResources: currentResources,
            timeLeft: "Time Left",
            currentTimesLeft: currentTimeRemaining,
            missionNode: "Mission Node",
            nodeName: currentMissionNodes,
            upComingFissures: "Times are below of next fissures that should pop up",
            nextFissureMessage: nextFissureMessage,
            noActiveEndlessFissureMessage: "No active endless fissures found",
            noActiveEndlessFissure: "No Endless Fissures Found"
          }
        }
  }
}


