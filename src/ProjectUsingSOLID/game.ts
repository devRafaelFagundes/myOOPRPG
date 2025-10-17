import * as readline from 'node:readline';
import { UserWarrior, Enemy, Interaction, AttackAction, BefriendAction, Befriendable } from './classes';
import { writeHeapSnapshot } from 'node:v8';
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
})

const gameConfig = new Map()
gameConfig.set('EnemyHp', 5)


function question(query: string) {
    return new Promise((resolve) => {
        rl.question(query, resolve)
    })
}

async function insertProperties(...properties: any): Promise<any> {
    if(properties.length === 0) return null;
    const response = await question(`What is the value of ${properties[0]}?\n=> `)
    properties.shift()
    return [response, await insertProperties(properties)]  
}

async function createCharacter<T>(ClassRef?: new (...args: any[]) => T, ...properties: any) {
    if (ClassRef) {
        const propertiesForCharacter = await insertProperties(properties)
        const newCharacter = new ClassRef(...propertiesForCharacter.filter(Boolean))
    }
}
