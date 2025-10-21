import { AttackAction, BefriendAction , UserWarrior, Enemy} from "./classes"

export type LivingBeing = {
    name: string,
    hp: number,
    receiveDamage(damage: number): number,
    isFriendly?: boolean
    attackingStat?: number
}

export type ActionType<U extends LivingBeing & {attackingStat: number}, T extends LivingBeing> = {
    act: AttackAction<U, T> | BefriendAction
}

export type hasName = {
    name: string
} 
//type completeCharacter

export type UserClasses = UserWarrior;
export type EnemyClasses = Enemy;
//add other user classes in the future