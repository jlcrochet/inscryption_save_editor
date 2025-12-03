export function listNew(type, assembly) {
    return {
        $type: `System.Collections.Generic.List\`1[[${type}, ${assembly ?? "Assembly-CSharp"}]], mscorlib`,
        $rcontent: [],
        $rlength: 0
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
