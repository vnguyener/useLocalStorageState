import { useState, useEffect } from "react";

const useLocalStorageState = (key, defaultValue) => {
  const [value, setValue] = useState(
    () => {
      const storedValue = typeof window !== 'undefined' && window.localStorage ? window.localStorage.getItem(key) : null;
      return storedValue === null ? defaultValue : JSON.parse(storedValue);
    }
  );
    
  useEffect(() => {
    const listener = (e) => {
      if (e.storageArea === localStorage && e.key === key) {
        setValue(JSON.parse(e.newValue));
      }
    };

    window.addEventListener("storage", listener);
    return () => {
      window.removeEventListener("storage", listener);
    };
  }, [key]);

  const setLocalStorageValue = (newValue) => {
    setValue((currentValue) => {
      const result = typeof newValue === "function" ? newValue(currentValue) : newValue;
      localStorage.setItem(key, JSON.stringify(result));
      return result;
    });
  };

  return [value, setLocalStorageValue]; 
};

export default useLocalStorageState;
