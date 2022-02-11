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

export const generateClients = (amount: number) => new Array(amount).fill(0).map((_, id) => ({
    id,
    name: aName() + " " + aLastName(),
    email: (aName() + "." + aLastName()).toLowerCase() + "@" + aCompany().toLowerCase() + ".com",
    companyDetails: {
        name: aCompany(),
        totalBilled: anAmount(3000, 10000, 5000)
    }
}));

export const generateInvoices = (amount: number) => new Array(amount).fill(0).map((_, id) => ({
    id,
    number: "Invoice#" + (Math.random() * 100000000).toFixed(0),
    company: aCompany(),
    value: anAmount(1000, 5000, 2000),
    dueDate: aDate('2020-01-01', '2021-01-01')
}));