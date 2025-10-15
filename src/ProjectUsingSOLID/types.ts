import { AtackAction, BefriendAction } from "./classes"

export type LivingBeing = {
    name: string,
    hp: number
}

export type ActionType  = {
    act: AtackAction | BefriendAction
}

//type completeCharacter