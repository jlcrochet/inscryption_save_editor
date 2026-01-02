export function typeNameWithAssembly(type) {
	let assembly

    if (type.startsWith('System.'))
        assembly = 'mscorlib'
    else if (type.startsWith('UnityEngine.'))
        assembly = 'UnityEngine.CoreModule'
    else
        assembly = 'Assembly-CSharp'

	return `${type}, ${assembly}`
}

export function listNew(type) {
    return {
        $type: `System.Collections.Generic.List\`1[[${typeNameWithAssembly(type)}]], mscorlib`,
        $rlength: 0,
        $rcontent: []
    }
}

export function listAdd(list, value) {
    list.$rcontent.push(value)
    list.$rlength += 1
}

export function listRemove(list, index) {
    list.$rcontent.splice(index, 1)
    list.$rlength -= 1
}

export function listClear(list) {
    list.$rcontent.splice(0)
    list.$rlength = 0
}

export function listClone(list) {
    if (list === null || list === undefined)
        return list
    else
        return {
            $type: list.$type,
            $rlength: list.$rlength,
            $rcontent: [...list.$rcontent]
        }
}
