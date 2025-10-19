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
        // Provide explicit callback type for readline.question
        rl.question(query, (answer: string) => resolve(answer))
    })
}

async function authQuestion(query: string, possibleChoices: any): Promise<string | number | boolean > {
    let response: string | number | boolean;
    const isArray = Array.isArray(possibleChoices); 
    while (true) {
        response = await question(query)
        if(!isArray){
            response = possibleChoices === 'number' ? parseInt(response) : possibleChoices
            if(response || (possibleChoices === 'string' && isNaN(parseInt(response as string)))) {
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

async function insertProperties(...properties: any): Promise<any> {
    if(properties.length === 0) return null;
    const response = await authQuestion(`What is the value of ${properties[0][0]}?\n=> `, descriptionChoices?.get(properties[0][0]))
    properties.shift()
    return [response, await insertProperties(properties)]  
}

async function createCharacter<T>(ClassRef?: new (...args: any[]) => T,  ...properties: string[] ): Promise<T | null> {
    if (!ClassRef) return null
    const propertiesForCharacter = await insertProperties(properties)
    const filtered = propertiesForCharacter.filter((v: any) => v !== '')
    const newCharacter = new ClassRef(...filtered) as T
    return newCharacter
}
let warrior: UserWarrior
createCharacter<UserWarrior>(UserWarrior, 'name', 'hp').then((userWarrior) => {warrior = userWarrior!; console.log(warrior) })

