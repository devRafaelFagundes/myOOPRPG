import * as readline from 'node:readline';
import { UserWarrior, Enemy, Interaction, AttackAction, BefriendAction, Befriendable } from './classes';
import { writeHeapSnapshot } from 'node:v8';
import { parse } from 'node:path';
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
})

const gameConfig = new Map()
gameConfig.set('EnemyHp', 5)

const descriptionChoices = new Map()
descriptionChoices.set('hp', 'number')
descriptionChoices.set('name', 'string')
descriptionChoices.set('menu', [1, 2, 3])

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
    const filtered = propertiesForCharacter.filter((v: any) => v !== '')
    const newCharacter = new ClassRef(...propertiesForCharacter) as T
    return newCharacter
}
let warrior: UserWarrior
createCharacter<UserWarrior>(UserWarrior, 'name', 'hp').then((userWarrior) => {warrior = userWarrior!; console.log(warrior) })

