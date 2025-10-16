import { AttackAction, BefriendAction } from "./classes"

export type LivingBeing = {
    name: string,
    hp: number,
    receiveDamage(damage: number): number,
    isFriendly?: boolean
}

export type ActionType<U extends LivingBeing & {attackingStat: number}, T extends LivingBeing> = {
    act: AttackAction<U, T> | BefriendAction
}

export type hasName = {
    name: string
} 
//type completeCharacter