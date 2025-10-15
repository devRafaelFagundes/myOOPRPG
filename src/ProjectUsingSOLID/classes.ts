import type { LivingBeing} from "./types"

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
    get atackingStat (){
        return this.#attackingStat    
    }
}
export abstract class Interaction {
    //instead of any, it will be the completeCharacter type
    user: any
    target: any
    constructor(user: any, target: any) {
        this.user = user
        this.target = target
    }
    action() {
        return `${this.user} interacted with ${this.target}`
    }
}


export class AtackAction extends Interaction{
    constructor(user: LivingBeing, target: LivingBeing){
        super(user, target)        
    }
    action() {
        return this.target.receiveDamage(this.user.attackingStat)
    }
}

export class BefriendAction extends Interaction {
    constructor(user: LivingBeing, target: LivingBeing){
        super(user, target)        
    }
    action() {
        return 'befriend thing to implement'   
    }

} 