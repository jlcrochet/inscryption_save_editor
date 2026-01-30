type List = {
    $type: string,
    $rlength: number,
    $rcontent: object[]
}

export function typeNameWithAssembly(type: string): string {
    let assembly: string

    if (type.startsWith('System.'))
        assembly = 'mscorlib'
    else if (type.startsWith('UnityEngine.'))
        assembly = 'UnityEngine.CoreModule'
    else
        assembly = 'Assembly-CSharp'

    return `${type}, ${assembly}`
}

export function listNew(type: string): List {
    return {
        $type: `System.Collections.Generic.List\`1[[${typeNameWithAssembly(type)}]], mscorlib`,
        $rlength: 0,
        $rcontent: []
    }
}

export function listAdd(list: List, value: any) {
    list.$rcontent.push(value)
    list.$rlength += 1
}

export function listRemove(list: List, index: number) {
    list.$rcontent.splice(index, 1)
    list.$rlength -= 1
}

export function listSwap(list: List, indexA: number, indexB: number) {
    if (list === null || list === undefined) return
    if (indexA === indexB) return
    const content = list.$rcontent
    if (indexA < 0 || indexB < 0 || indexA >= content.length || indexB >= content.length) return
    ;[content[indexA], content[indexB]] = [content[indexB], content[indexA]]
}

export function listClear(list: List) {
    list.$rcontent.splice(0)
    list.$rlength = 0
}

export function listClone(list: List): List {
    if (list === null || list === undefined)
        return list
    else
        return {
            $type: list.$type,
            $rlength: list.$rlength,
            $rcontent: [...list.$rcontent]
        }
}

export function cloneMod(mod: any): any {
    return {
        $type: mod.$type,
        nameReplacement: mod.nameReplacement,
        attackAdjustment: mod.attackAdjustment,
        healthAdjustment: mod.healthAdjustment,
        abilities: listClone(mod.abilities),
        negateAbilities: listClone(mod.negateAbilities),
        bloodCostAdjustment: mod.bloodCostAdjustment,
        bonesCostAdjustment: mod.bonesCostAdjustment,
        energyCostAdjustment: mod.energyCostAdjustment ?? 0,
        nullifyGemsCost: mod.nullifyGemsCost ?? false,
        addGemCost: listClone(mod.addGemCost),
        gemify: mod.gemify ?? false,
        specialAbilities: listClone(mod.specialAbilities),
        fromCardMerge: mod.fromCardMerge ?? false,
        deathCardInfo: mod.deathCardInfo ? {
            $type: mod.deathCardInfo.$type,
            headType: mod.deathCardInfo.headType,
            mouthIndex: mod.deathCardInfo.mouthIndex,
            eyesIndex: mod.deathCardInfo.eyesIndex,
            lostEye: mod.deathCardInfo.lostEye
        } : null,
        decalIds: listClone(mod.decalIds)
    }
}
