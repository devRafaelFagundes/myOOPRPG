
class Character {
    #hp
    constructor(username, hp) {
        this.username = username
        this.#hp = hp
    }
    get hp() {
        return this.#hp
    }
    set hp(value) {
        this.#hp = value  
    }
    recieveDamage(damage) {
        const lifeRemaining = this.#hp - damage
        this.#hp = lifeRemaining 
        if(this.#hp < 1) {
            this.#hp = 0;
        }
    }
    atack(enemy, atackValue) {
        enemy.recieveDamage(atackValue)
    }
}

class Warrior extends Character {
    #aditionalAtack
    constructor(username, hp) {
        super(username, hp)
        this.#aditionalAtack = 2;
    }
    atack(enemy, atackValue) {
        atackValue += this.aditionalAtack
        enemy.recieveDamage(atackValue)
        this.#aditionalAtack = 2
    }
    set incrementAditionalAtack(diceValue){
        if(diceValue > 3) {
            this.#aditionalAtack *= 2
        }
    }
    get aditionalAtack(){
        return this.#aditionalAtack
    }
}

class Enemy extends Character{}

module.exports = {Enemy, Warrior}