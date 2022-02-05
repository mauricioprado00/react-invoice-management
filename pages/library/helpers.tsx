export const isType = (component: any, names: Array<string>): boolean => {
    let type = component.type;
    if (typeof type === 'object') {
      type = type.name;
    }
    console.log(names);
    return names.some(name => name === type);
  }
  