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
gameConfig.set('EnemyHp', 5);
const descriptionChoices = new Map();
descriptionChoices.set('hp', 'number');
descriptionChoices.set('name', 'string');
descriptionChoices.set('menu', [1, 2, 3]);
function question(query) {
    return new Promise((resolve) => {
        // Provide explicit callback type for readline.question
        rl.question(query, (answer) => resolve(answer));
    });
}
async function authQuestion(query, possibleChoices) {
    let response;
    do {
        response = await question(query);
    } while (typeof response !== possibleChoices && !Array.isArray(possibleChoices?.includes(response)));
    return response;
}
async function insertProperties(...properties) {
    if (properties.length === 0)
        return null;
    const response = await authQuestion(`What is the value of ${properties[0][0]}?\n=> `, descriptionChoices?.get(properties[0][0]));
    properties.shift();
    return [response, await insertProperties(properties)];
}
async function createCharacter(ClassRef, ...properties) {
    if (!ClassRef)
        return null;
    const propertiesForCharacter = await insertProperties(properties);
    const filtered = propertiesForCharacter.filter((v) => v !== '');
    const newCharacter = new ClassRef(...filtered);
    return newCharacter;
}
let warrior;
createCharacter(classes_1.UserWarrior, 'name', 'hp').then((userWarrior) => { warrior = userWarrior; console.log(warrior); });
//# sourceMappingURL=game.js.map