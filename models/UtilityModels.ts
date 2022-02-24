export type MapType<T> = {
  [id: string]: T;
};


export const MapTypeFill = <T extends any>(elements:string[], value:T):MapType<T> => Object.assign({}, ...elements.map(i=> ({[i]: value})))
