import { useState } from "react";

function isFunction(functionToCheck) {
  return (
    (functionToCheck &&
      {}.toString.call(functionToCheck) === "[object Function]") ||
    (functionToCheck &&
      {}.toString.call(functionToCheck) === "[object AsyncFunction]")
  );
}

export default function useStickyState(key, initialState) {
  const storedState = localStorage.getItem(key);
  const [tempState, setTempState] = useState(storedState ?? initialState);
  function setStickyState(newState) {
    if (isFunction(newState)) {
      setTempState((previousState) => {
        const tempNewState = newState(previousState);
        if (tempNewState) {
          localStorage.setItem(key, tempNewState);
        } else {
          localStorage.removeItem(key);
        }
        return tempNewState;
      });
    } else {
      if (newState) {
        localStorage.setItem(key, newState);
      } else localStorage.removeItem(key, newState);
      setTempState(newState);
    }
  }
  return [tempState, setStickyState];
}