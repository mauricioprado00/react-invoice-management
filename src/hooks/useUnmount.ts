import { MapType } from "models/UtilityModels";
import { useEffect, useState } from "react";
import internal from "stream";

type UnmountState = {
  items: MapType<() => void>,
  id: number,
  add: (item:() => void) => string,
  remove: (id:string) => void,
}
const initialState:UnmountState = {
  items: {},
  id: 0,
  add: function (item) {
    const id = 'cb' + this.id++;
    this.items[id] = item;
    return id;
  },
  remove: function (id) {
    delete this.items[id];
  }
}

const useUnmount = () => {
  const [state] = useState(() => Object.assign({}, initialState));

  useEffect(() => {
    return () => {
      Object.values(state.items).forEach(val => val());
    };
  }, [state]);

  return {
    add: state.add.bind(state),
    remove: state.remove.bind(state),
  };
};

export default useUnmount;
