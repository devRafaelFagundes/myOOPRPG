import * as readline from 'node:readline';
import { UserWarrior, Enemy, Interaction, AttackAction, BefriendAction, Befriendable } from './classes';
import { EnemyClasses, LivingBeing, UserClasses } from './types';

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
})

const gameConfig = new Map()
gameConfig.set('difficulty', {
    easy: () => {
        gameConfig.set('EnemyHp', 3)
    },
    medium: () => {
        gameConfig.set('EnemyHp', 5)
    },
    hard: () => {
        gameConfig.set('EnemyHp', 7)
    }
})

gameConfig.get('difficulty').medium()

const descriptionChoices = new Map()
descriptionChoices.set('hp', 'number')
descriptionChoices.set('name', 'string')
descriptionChoices.set('menu', ['1', '2', '3'])
descriptionChoices.set('interactionOptions', ['1', '2', '3', '4'])
descriptionChoices.set('play', ['yes', 'no'])

function question(query: string): Promise<string> {
    return new Promise((resolve) => {
        rl.question(query, (answer: string) => resolve(answer))
    })
}

async function authQuestion(query: string, possibleChoices: (number | string)[] | string | boolean): Promise<string | number | boolean > {
    let response: string | number | boolean;
    const isArray = Array.isArray(possibleChoices); 
    while (true) {
        response = await question(query)
        if(!isArray){
            response = possibleChoices === 'number' ? parseInt(response) : response
            if((possibleChoices === 'number' && !isNaN(response as number)) || (possibleChoices === 'string' && isNaN(parseInt(response as string)))) {
                break;
            }
        }
        else {
            if (possibleChoices.includes(response)) {
                break;
            }
        }
    console.log("Invalid Input, please try again.")
    }
    return response
}

async function insertProperties(properties: any[]): Promise<any> {
    if(properties.length === 1) return await authQuestion(`What is the value of ${properties[0]}?\n=> `, descriptionChoices?.get(properties[0]));
    const response = await authQuestion(`What is the value of ${properties[0]}?\n=> `, descriptionChoices?.get(properties[0]))
    properties.shift()
    return [response].concat(await insertProperties(properties))
}

async function createCharacter<T>(ClassRef?: new (...args: any[]) => T,  ...properties: string[] ): Promise<T | null> {
    if (!ClassRef) return null
    const propertiesForCharacter = await insertProperties(properties)
    const newCharacter = new ClassRef(...propertiesForCharacter) as T
    return newCharacter
}
async function startGame() {
    const playGame = await authQuestion("Do you want to play the game? (yes/no)\n=> ", descriptionChoices.get('play')) as string
    if (playGame === 'no') {
        console.log("Maybe next time!")
        rl.close()
        process.exit(0)
    }
    let warrior: UserWarrior = await createCharacter<UserWarrior>(UserWarrior, 'name') as UserWarrior
    console.log(`Welcome, ${warrior.name}! Your adventure begins now.`)
}

async function tutorial() {
    await new Promise(resolve => setTimeout(resolve, 2000))
    console.log('Well, first things first, let me show you how to fight.')
    await new Promise(resolve => setTimeout(resolve, 1000))
    const enemy = new Enemy('Goblin', gameConfig.get('EnemyHp'))
    console.log(`A wild ${enemy.name} appears with ${enemy.hp} HP!`)
    await new Promise(resolve => setTimeout(resolve, 1000))
    console.log('When you encounter an enemy, you will have several options to choose from.')
}
async function attack(attacker: LivingBeing, target: LivingBeing) {
    const attackAction = new AttackAction(attacker as any, target as any)
    const result = attackAction.action()
    if (typeof result === 'string') {
        console.log(result)
    } else {
        console.log(`${target.name} received ${attacker.attackingStat} damage, remaining HP: ${result}`)
    }
}

async function Inter(user: LivingBeing, target: LivingBeing) {
    const interactionChoice = await authQuestion("Choose your action:\n1. Attack\n2. Befriend\n 3. Back to menu=> ", descriptionChoices.get('interactionOptions')) as string
    switch (interactionChoice) {
        case '1':
            await attack(user, target)
            break;
        case '2':
            if(!(target instanceof Befriendable)){
                console.log(`${target.name} cannot be befriended.`)
                break;
            }
            const befriendAction = new BefriendAction(user, target)
            const befriendResult = befriendAction.action()
            if(befriendResult) {
                console.log(`You have befriended ${target.name}!`)
            }
            else {
                console.log(`Befriending ${target.name} failed.`)
            }
            break;
        case '3':
            console.log("Returning to menu...")
            break;
        default:
            console.log("Invalid choice, returning to menu.")
            break;
    }
}
async function menu(user: UserClasses, enemies: EnemyClasses) {

}
async function main() {
    await startGame()
    await tutorial()
}

main()
