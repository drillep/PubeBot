require('dotenv').config()
const Discord = require('discord.js')
const fetch = require('node-fetch')

const AWS = require('aws-sdk');
AWS.config.update({ region: "eu-west-1" });

const SSM = require('aws-sdk/clients/ssm');
const ssm = new SSM()
const query = {
  "Names": ["APPSYNC_API_KEY", "APPSYNC_URL", "DISCORD_API_KEY"],
  "WithDecryption": false
}
let param = ssm.getParameters(query, (err, data) => {
  console.log('error = %o', err);
  console.log('raw data = %o', data);
})

console.log()
const client = new Discord.Client()

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`)
  let myArray = [
    ["Lee losing", { type: "WATCHING" }],
    ["Gary winning", { type: "WATCHING" }],
    ["Neil moaning", { type: "LISTENING" }],
    ["PUBEG", { type: "PLAYING" }],
    ["PornHub", { type: "WATCHING"}]
  ]
  let randomItem = myArray[Math.floor(Math.random() * myArray.length)]
  console.log(randomItem[0], randomItem[1])
  client.user.setActivity(randomItem[0], randomItem[1]) //("Lee losing", {type: "WATCHING"})

  client.guilds.forEach((channel) => {
    console.log(` = ${channel.name} ${channel.type} ${channel.id}`)
  })
  //general channel id 361579671508484096
  let generalChannel = client.channels.get('361579671508484096')
});

client.on('message', recievedMessage => {

  if(recievedMessage.content.startsWith('!')) {
    processCommand(recievedMessage)
  }  
});

const processCommand = (recievedMessage) => {
  let fullCommand = recievedMessage.content.substr(1)
  let splitCommand = fullCommand.split(' ')
  let primaryCommand = splitCommand[0]
  let arguments = splitCommand.slice(1)

  if(primaryCommand == 'help') {
     helpCommand(arguments, recievedMessage)
  } else if(primaryCommand == 'squad' || primaryCommand == 'Squad') {
    // getMatchStats(arguments, recievedMessage, primaryCommand)
    recievedMessage.channel.send(`Squad stats in development`)
  } else {
    try {
      getMatchStats(arguments, recievedMessage, primaryCommand)
    } catch (e) {
      console.log('could not fetch ', e)
    }
  }
}

const helpCommand = (arguments, recievedMessage) => {
  recievedMessage.channel.send({
    embed: {
      color: 15966740,
      title: `PubeBot help!`,
      fields: [{
        name: `Player stats`,
        value: `Enter a name \'!Drillep\' to query the stats for the last match played (case sensitive)`
      },
      {
        name: `Squad stats`,
        value: `Use \'!Squad\' to query the most recent squad stats`
      }]
    }
  })
}

const getMatchStats = (arguments, recievedMessage, primaryCommand) => {
  fetch(process.env.APPSYNC_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'x-api-key': process.env.APPSYNC_API_KEY },
    body: JSON.stringify({
      query: `{ matchData(playerName: \"${primaryCommand}\") { startedAt DBNOs assists boosts damageDealt deathType headshotKills heals killPlace killStreaks kills longestKill name playerId revives rideDistance roadKills swimDistance teamKills timeSurvived vehicleDestroys walkDistance weaponsAcquired winPlace } }`
    }),
  })
    .then(res => res.json())
    .then(res => {
      let startedAt = res.data.matchData.startedAt
      let startTime = startedAt.slice(-9, -4)
      let startDate = startedAt.substr(0, 10)
      let dArr = startDate.split("-");  // ex input "2010-01-18"
      startDate = dArr[2] + "/" + dArr[1] + "/" + dArr[0].substring(2);
      recievedMessage.channel.send({
      embed: {
        color: 3447003,
        // title: `${res.data.matchData.name} date and time`,
        fields: [{
          name: `${res.data.matchData.name} stats for ${startTime} ${startDate}`,
          value: "Kills: " + res.data.matchData.kills + "\n" +
            "Assists: " + res.data.matchData.assists + "\n" +
            "Headshot Kills: " + res.data.matchData.headshotKills + "\n" +
            "Kill Streaks: " + res.data.matchData.killStreaks + "\n" +
            "Longest Kill: " + res.data.matchData.longestKill.toFixed(2) + "\n" +
            "Team Kills: " + res.data.matchData.teamKills + "\n" +
            "Revives: " + res.data.matchData.revives + "\n" +
            "Time Survived: " + res.data.matchData.timeSurvived.toFixed(2) + "\n" +
            "Damage Dealt: " + res.data.matchData.damageDealt.toFixed(2) + "\n" +
            "Death Type: " + res.data.matchData.deathType + "\n" +
            "Kill Place: " + res.data.matchData.killPlace + "\n" +
            "Win Place: " + res.data.matchData.winPlace,
          inline: true
        }]
      }
    })
  })
}

client.login(process.env.DISCORD_API_KEY);