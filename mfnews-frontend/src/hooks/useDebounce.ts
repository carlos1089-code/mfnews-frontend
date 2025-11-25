import { useState, useEffect } from 'react';

// <T> significa que este hook puede recibir un string, un number, etc.
export function useDebounce<T>(value: T, delay: number): T {
  
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    // Configuramos el timer
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // Limpiamos el timer si el valor cambia antes de que termine el delay
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}
