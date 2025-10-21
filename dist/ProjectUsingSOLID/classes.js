"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BefriendAction = exports.AttackAction = exports.Interaction = exports.Enemy = exports.UserWarrior = exports.Character = exports.namedLivingBeing = void 0;
exports.Befriendable = Befriendable;
class namedLivingBeing {
    name;
    constructor(name) {
        this.name = name;
    }
}
exports.namedLivingBeing = namedLivingBeing;
class Character extends namedLivingBeing {
    #hp = 10;
    constructor(name, hp) {
        super(name);
        this.#hp = hp ?? this.#hp;
    }
    get hp() {
        return this.#hp;
    }
    receiveDamage(damage) {
        if (damage < 0)
            return -1;
        this.#hp -= damage;
        return this.hp;
    }
}
exports.Character = Character;
class UserWarrior extends Character {
    #attackingStat = 3;
    constructor(name) {
        super(name);
    }
    get attackingStat() {
        return this.#attackingStat;
    }
}
exports.UserWarrior = UserWarrior;
class Enemy extends Character {
    constructor(name, hp) {
        super(name, hp);
    }
}
exports.Enemy = Enemy;
class Interaction {
    //instead of any, it will be the completeCharacter type
    user;
    target;
    constructor(user, target) {
        this.user = user;
        this.target = target;
    }
}
exports.Interaction = Interaction;
class AttackAction extends Interaction {
    constructor(user, target) {
        super(user, target);
    }
    action() {
        if (this.user.isFriendly)
            return;
        return this.target.receiveDamage(this.user.attackingStat);
    }
}
exports.AttackAction = AttackAction;
class BefriendAction extends Interaction {
    befriend;
    constructor(user, target, befriend) {
        super(user, target);
        this.befriend = befriend;
    }
    action() {
        const randomNumber = Math.floor(Math.random() * 5) + 1;
        if (randomNumber !== 5)
            return;
        return Befriendable(this.user);
    }
}
exports.BefriendAction = BefriendAction;
function Befriendable(obj) {
    obj.isFriendly = true;
    return obj;
}
//# sourceMappingURL=classes.js.map