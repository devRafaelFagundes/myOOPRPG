import type { LivingBeing } from "./types";
export declare abstract class Character implements LivingBeing {
    #private;
    name: string;
    constructor(name: string);
    get hp(): number;
    receiveDamage(damage: number): number;
}
export declare class UserWarrior extends Character {
    #private;
    constructor(name: string);
    get attackingStat(): number;
}
export declare class Enemy extends Character {
    constructor(name: string);
}
export declare abstract class Interaction<U extends LivingBeing, T extends LivingBeing> {
    user: U;
    target: T;
    constructor(user: U, target: T);
    abstract action(): void | string | object | number;
}
export declare class AttackAction<U extends (LivingBeing & {
    attackingStat: number;
}), T extends LivingBeing> extends Interaction<U, T> {
    constructor(user: U, target: T);
    action(): number | undefined;
}
export declare class BefriendAction extends Interaction<LivingBeing, LivingBeing> {
    befriend: any;
    constructor(user: LivingBeing, target: LivingBeing, befriend: any);
    action(): LivingBeing | undefined;
}
export declare function Befriendable<U extends LivingBeing>(obj: U): U;
//# sourceMappingURL=classes.d.ts.map