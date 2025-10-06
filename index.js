const readline = require('readline')
const {Enemy, Warrior} = require('./classes');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
})

let enemies = new Map()

//config
let firstPLay = 1
let finalRoom = 3
let room = 0;

function question(questionMessage) {
    return new Promise((resolve) => {
        rl.question(questionMessage, (response) => {
            resolve(response)
        })
    })
}

async function startAndEnd() {
    const message = firstPLay ? 'Howdy, do want to play a game?' : 'Do you want to continue playing?'
    let res
    do {
        res = await question(message + ' (y/n): ')
    } while (res !== 'y' && res !== 'n')
    if (res === 'n') {
        console.log('Thank you for playing')
        process.exit(0)
    }
    if (!firstPLay){
        finalRoom += 4;
    }
    firstPLay = 0
}

async function createPlayer() {
    let name
    let hp
    let invalidInput
    do {
        invalidInput = 0
        name = await question('Select your name: ')
        hp = await question('Select your initial HP: ')
        if(!name.trim() || !parseInt(hp)) {
            console.log('Invalid inputs')
            invalidInput = 1
        }
    } while (invalidInput)
    const newPlayer = new Warrior(name, hp)
    return newPlayer
}

async function generateRoom(){
    room++;
    if(room > finalRoom) {
        return
    }
    console.log(`Room ${room} started!`)
    const roomEnemies = await generateEnemies(room)
    roomEnemies.forEach(enemy => {
        enemies.set(enemy.username, enemy)
    })
}

async function generateEnemies(room, id = 1) {
    const enemy = new Enemy(`Enemy ${id}`, 2 * room)
    if(room == 1) {
        return [enemy]
    }
    const restEnemies = await generateEnemies(room - 1, id + 1)
    return [enemy, ...restEnemies]
}

async function chooseEnemy() {
    let res
    const ids = [...enemies.keys()].map((enemy => enemy.split(' ')[1]))
    do {
        console.log('SELECT YOU ENEMY BY ID')
        process.stdout.write('Enemies: ')
        for(const [key, value] of enemies) {
            process.stdout.write(`${key} (${value.hp}hp) `)
        }
        process.stdout.write('\n')
        res = await question('Choice: ')
    } while (!ids.includes(res.toString()))
    const username = `Enemy ${res}`
    return username
}

async function atackCharacter(atacker, target, playerTurn) {
    const randomDamageToDealt = randomDamage()
    if(playerTurn) {
        const enemyObj = enemies.get(target)
        atacker.atack(enemyObj, randomDamageToDealt)
        if(enemyObj.hp == 0) {
            enemies.delete(target)
        }
    }
    else {
        const enemyAtacker = enemies.get(atacker)
        enemyAtacker.atack(target, randomDamageToDealt)
        console.log(`${atacker} got ${randomDamageToDealt} life out of you, ${target.hp}hp left`)
    }
}
async function fightOptions(user) {
    let res
    const choices = ['ATK', '1', 'ROLL', '2']
    do {
        process.stdout.write('Enemies: ')
        for(const [key, value] of enemies) {
            process.stdout.write(`${key} (${value.hp}hp) `)
        }
        console.log('\natack (1) ||  roll the dice (2) || see user status (3)')
        res = await question('Choice: ')
        res = res.toUpperCase()
        if(res == '3' || res === 'status') {
            await displayStatus(user)
            continue;
        }
        if(!choices.includes(res)) {
            console.log('Invalid options, try again')
        }
    } while (!choices.includes(res))
    switch(res) {
        case 'ATK':
        case '1':
            const enemyTarget = await chooseEnemy()
            await atackCharacter(user, enemyTarget, 1)
            //last argument is if it is the player turn, truthy for yes, falsy for no
    
            const enemyObj = enemies.get(enemyTarget)
            //delete user from enemies if it killed him
            const message = (!enemyObj) ? `You killed ${enemyTarget}` : `${enemyTarget} has ${enemyObj.hp}hp left`
            console.log(message)

            break;
        case 'ROLL':
        case '2':
            const diceResult = Math.floor(Math.random() * 6) + 1
            const result = diceResult > 3 ? 'Congrats!' : 'What a shame!'
            console.log('You got ' + diceResult + ' on the dice. ' + result)
            user.incrementAditionalAtack = diceResult
            await displayStatus(user)
            break;
    }
}

async function displayStatus(user) {
    console.log('\n')
    console.log(`***** USERNAME: ${user.username} -- HP: ${user.hp} -- ADITIONAL ATACK: ${user.aditionalAtack} *****`)
    console.log('\n')
}

function randomDamage (){
    return Math.floor(Math.random() * 3) + 1
    //1, 2, 3
}

async function enemyTurnAction(player) {
    for (const [key, value] of enemies) {
        await atackCharacter(key, player, 0)
        if(player.hp === 0) break;
    }
}
async function battle(player) {
    while (true) {
        while(room <= finalRoom) {
            await fightOptions(player)
            await enemyTurnAction(player)
            if(player.hp == 0 || enemies.size == 0) break;
        }
        if(player.hp == 0) {
            console.log('You got killed, lol');
            break
        }
        else if (enemies.size == 0 && room <= finalRoom){
            console.log('ROOM CLEARED')
            await generateRoom()
        }
        else {
            console.log('YOU WON, CONGRATS')
            break
        }
    }
}

async function execGame () {
    await startAndEnd()
    let player = await createPlayer()
    await generateRoom()
    await battle(player)
    while (true) {
        await startAndEnd()
        if(player.hp == 0) {
            player = await createPlayer()
            room = 0;
            finalRoom = 3;
        }
        await generateRoom()
        await battle(player)
    }
}
execGame()