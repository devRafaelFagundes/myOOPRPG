"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const readline = __importStar(require("node:readline"));
const classes_1 = require("./classes");
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});
const gameConfig = new Map();
gameConfig.set('difficulty', {
    easy: () => {
        gameConfig.set('EnemyHp', 3);
    },
    medium: () => {
        gameConfig.set('EnemyHp', 5);
    },
    hard: () => {
        gameConfig.set('EnemyHp', 7);
    }
});
gameConfig.get('difficulty').medium();
const descriptionChoices = new Map();
descriptionChoices.set('hp', 'number');
descriptionChoices.set('name', 'string');
descriptionChoices.set('menu', ['1', '2', '3']);
descriptionChoices.set('fightOptions', ['1', '2', '3', '4']);
descriptionChoices.set('play', ['yes', 'no']);
function question(query) {
    return new Promise((resolve) => {
        rl.question(query, (answer) => resolve(answer));
    });
}
async function authQuestion(query, possibleChoices) {
    let response;
    const isArray = Array.isArray(possibleChoices);
    while (true) {
        response = await question(query);
        if (!isArray) {
            response = possibleChoices === 'number' ? parseInt(response) : response;
            if ((possibleChoices === 'number' && !isNaN(response)) || (possibleChoices === 'string' && isNaN(parseInt(response)))) {
                break;
            }
        }
        else {
            if (possibleChoices.includes(response)) {
                break;
            }
        }
        console.log("Invalid Input, please try again.");
    }
    return response;
}
async function insertProperties(properties) {
    if (properties.length === 1)
        return await authQuestion(`What is the value of ${properties[0]}?\n=> `, descriptionChoices?.get(properties[0]));
    const response = await authQuestion(`What is the value of ${properties[0]}?\n=> `, descriptionChoices?.get(properties[0]));
    properties.shift();
    return [response].concat(await insertProperties(properties));
}
async function createCharacter(ClassRef, ...properties) {
    if (!ClassRef)
        return null;
    const propertiesForCharacter = await insertProperties(properties);
    const newCharacter = new ClassRef(...propertiesForCharacter);
    return newCharacter;
}
async function startGame() {
    const playGame = await authQuestion("Do you want to play the game? (yes/no)\n=> ", descriptionChoices.get('play'));
    if (playGame === 'no') {
        console.log("Maybe next time!");
        rl.close();
        process.exit(0);
        return;
    }
    let warrior = await createCharacter(classes_1.UserWarrior, 'name');
    console.log(`Welcome, ${warrior.name}! Your adventure begins now.`);
}
async function tutorial() {
    console.log('Well, first things first, let me show you how to fight.');
    await new Promise(resolve => setTimeout(resolve, 500));
    const enemy = new classes_1.Enemy('Goblin', gameConfig.get('EnemyHp'));
    console.log(`A wild ${enemy.name} appears with ${enemy.hp} HP!`);
    await new Promise(resolve => setTimeout(resolve, 500));
    console.log('When you encounter an enemy, you will have several options to choose from.');
}
async function main() {
    await startGame();
    await tutorial();
}
main();
//# sourceMappingURL=game.js.map