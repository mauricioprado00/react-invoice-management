export const isType = (component: any, types: {name: string}[]): boolean => {
    let type = component.type ? component.type.name : component.type;
    let typeNames = types.map(type => type.name)
    return typeNames.some(name => name === type);
}

export const segregate = (children:any[], rules:any[]):any[] => {
    const result:any[][] = (new Array(rules.length)).fill(1).map(x => [])
    const remaining:any[] = []
    children.forEach(child => {
        if (!child || Array.isArray(child) && child.length === 0) return;
        let added = rules.some((types: {name: string}[]|{name: string}, idx: number) => {
            if (isType(child, Array.isArray(types) ? types : [types])) {
                result[idx].push(child)
                return true
            }
            return false
        })
        if (!added) remaining.push(child)
    });

    // filter out the falsy values
    result.push(remaining.filter(e => e))

    return result
}

export type Unpacked<T> = T extends (infer U)[] ? U : T;