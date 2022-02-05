export const isType = (component: any, names: Array<string>): boolean => {
    let type = component.type;
    if (typeof type === 'object') {
        type = type.name;
    }
    console.log(names);
    return names.some(name => name === type);
}


export const randomItem = (items: Array<any>) => items[Math.floor(Math.random() * items.length)]
export const aCompany = (): string => randomItem(['Acme', 'Ibm', 'HP', 'Google', 'Ferry', 'Rempel', 'Sawayn'])
export const aName = (): string => randomItem(["Jane", "Anna", "Laura", "Loretta"])
export const aLastName = (): string => randomItem(["Smith", "Gomez", "Krombacher"])
export const anAmount = (minimum: number, maximum: number, center: number): number => parseInt(((Math.random() * (maximum - minimum) * ((center - minimum) / (maximum - minimum))) + minimum).toFixed(0))
export const aDate = (from: string, to: string): string => {
    let sFrom = (new Date(from)).getTime()
    let sTo = (new Date(to)).getTime()
    let date = new Date(anAmount(sFrom, sTo, (sFrom + sTo) / 2))
    return date.toISOString().substring(0, 10)
}
