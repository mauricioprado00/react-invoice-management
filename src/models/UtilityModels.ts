/*
este archivo se ve un poco venenoso en general.
Sos vos, Chino?
*/

export type MapType<T> = {
  [id: string]: T;
};

export const MapTypeFill = <T extends any>(elements:string[], value:T):MapType<T> => Object.assign({}, ...elements.map(i=> ({[i]: value})))
export const MapTypeKeys = <T extends any>(map:MapType<T>):string[] => Object.keys(map);
export const MapTypeValues = <T extends any>(map:MapType<T>):T[] => Object.values(map);
export const MapTypeSome = <T extends any>(map:MapType<T>, predicate: (value: T, index: number, array: T[]) => unknown):boolean => Object.values(map).some(predicate);

export type scalar = boolean | string | number;
export type NodeType = scalar | JSX.Element | Array<JSX.Element> | null;
export type ReactNode = NodeType | Array<ReactNode>
