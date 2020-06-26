const RPC = require("discord-rpc"); 

const clientId = YOUR_CLIENT_ID

const client = new RPC.Client({ transport: 'ipc' });

let releaseTimes = {
    1593187200000: {
        app: "SDS"
    },
    1593188100000: {
        app: "SGD"
    },
    1593189000000: {
        app: "SSG"
    },
    1593197100000: {
        app: "LD"
    }
}

/**
 * 
 * @param {Number} time 
 */
function dateString(time) {
    let dateObject = new Date(time);

    let a1 = dateObject.toLocaleString("nl-NL", {weekday: "long", timeZone: "Europe/London"}); // Monday
    let a2 = dateObject.toLocaleString("nl-NL", {month: "numeric", timeZone: "Europe/London"}); // December
    let a3 = dateObject.toLocaleString("nl-NL", {day: "numeric", timeZone: "Europe/London"}); // 9
    let a4 = dateObject.toLocaleString("nl-NL", {year: "numeric", timeZone: "Europe/London"}); // 2019
    let a5 = dateObject.toLocaleString("nl-NL", {hour: "numeric", timeZone: "Europe/London"}); // 10 AM
    let a6 = dateObject.toLocaleString("nl-NL", {minute: "numeric", timeZone: "Europe/London"}); // 30
    let a7 = dateObject.toLocaleString("nl-NL", {second: "numeric", timeZone: "Europe/London"}); // 15
    let a8 = dateObject.toLocaleString("nl-NL", {timeZoneName: "short", timeZone: "Europe/London"}); // 12/9/2019, 10:30:15 AM CST

    return `${a5}:${(a6 < 10 ? "0" + a6 : a6)} BST ${a3}/${a2}/${a4}`
}

function getNextApp() {
    let keys = Object.keys(releaseTimes);
    let sorted = keys.sort((a,b) => +a-+b);
    
    let date = new Date();
    for(let index in sorted) {
        let time = sorted[index];
        if(+time > +date.getDate()) return {time: +time, result: releaseTimes[time]};
    }
}

function updateRPC() {
    let nextApp = getNextApp();

    if(!nextApp) {
        client.setActivity({
            details: `Congrats to everyone `,
            state: `who passed!`,
            largeImageKey: "scr",
            instance: false
        }).then(promise => {
        }).catch(err => {
            console.error(err)
        })
        return;
    }
    let time = nextApp["time"];
    client.setActivity({
        details: `${dateString(time)}`,
        state: `Hype on! Next app: ${nextApp["result"]["app"]}`,
        endTimestamp: 1593187200000,
        largeImageKey: "scr",
        instance: false
    }).then(promise => {
    }).catch(err => {
        console.error(err)
    })
}

client.on('ready', () => {
   updateRPC();
   setTimeout(() => {
       updateRPC();
   }, 1000*60);
});

  // Log in to RPC with client id
client.login({ clientId}).then(promise => {
    console.log("Login successfull")
}).catch(err => {
    console.error(err)
});