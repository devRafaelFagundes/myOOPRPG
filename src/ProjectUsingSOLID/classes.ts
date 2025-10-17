import type { LivingBeing } from "./types"

export abstract class Character implements LivingBeing {
    name: string
    #hp: number = 10
    constructor(name: string) {
        this.name = name  
    }
    get hp(){
        return this.#hp
    }
    receiveDamage(damage: number) {
        if(damage < 0) return -1;
        this.#hp -= damage
        return this.hp
    }
}

export class UserWarrior extends Character {
    #attackingStat: number = 3
    constructor(name: string) {
        super(name)
    }
    get attackingStat (){
        return this.#attackingStat    
    }
}

export class Enemy extends Character {
    constructor(name: string) {
        super(name)
    }
    //ememy things
}

export abstract class Interaction<U extends LivingBeing, T extends LivingBeing>{
    //instead of any, it will be the completeCharacter type
    user: U
    target: T
    constructor(user: U, target: T) {
        this.user = user
        this.target = target
    }
    abstract action(): void | string | object | number
}

export class AttackAction<U extends (LivingBeing & {attackingStat: number}), T extends LivingBeing> extends Interaction<U, T>{
    constructor(user: U, target: T){
        super(user, target)        
    }
    action() {
        if(this.user.isFriendly) return;
        return this.target.receiveDamage(this.user.attackingStat)
    }
}

export class BefriendAction extends Interaction<LivingBeing, LivingBeing>{
    befriend: any
    constructor(user: LivingBeing, target: LivingBeing, befriend: any){
        super(user, target)        
        this.befriend = befriend
    }
    action() {
        const randomNumber = Math.floor(Math.random() * 5) + 1;
        if(randomNumber !== 5) return;
        return Befriendable(this.user)
    }

} 

export function Befriendable<U extends LivingBeing>(obj: U) {
    obj.isFriendly = true
    return obj
}