import { renderHook, waitFor } from '@testing-library/react';
import { useDebounce } from './useDebounce.ts';

describe('useDebounce', () => {
    // Usamos timers falsos para controlar el tiempo
    beforeEach(() => {
        jest.useFakeTimers();
    });

    afterEach(() => {
        jest.runOnlyPendingTimers();
        jest.useRealTimers();
    });

    test('debería retornar el valor inicial inmediatamente', () => {
        const { result } = renderHook(() => useDebounce('inicial', 500));

        expect(result.current).toBe('inicial');
    });

    test('debería actualizar el valor después del delay', async () => {
        const { result, rerender } = renderHook(
            ({ value, delay }) => useDebounce(value, delay),
            { initialProps: { value: 'inicial', delay: 500 } }
        );

        // Valor inicial
        expect(result.current).toBe('inicial');

        // Cambiamos el valor
        rerender({ value: 'actualizado', delay: 500 });

        // El valor NO debe cambiar inmediatamente
        expect(result.current).toBe('inicial');

        // Avanzamos el tiempo 500ms
        jest.advanceTimersByTime(500);

        // Esperamos a que se actualice
        await waitFor(() => {
            expect(result.current).toBe('actualizado');
        });
    });

    test('debería cancelar el timeout anterior cuando el valor cambia rápido', async () => {
        const { result, rerender } = renderHook(
            ({ value, delay }) => useDebounce(value, delay),
            { initialProps: { value: 'primero', delay: 500 } }
        );

        // Cambio 1
        rerender({ value: 'segundo', delay: 500 });
        jest.advanceTimersByTime(200);

        // Cambio 2 (antes de que se complete el primer delay)
        rerender({ value: 'tercero', delay: 500 });
        jest.advanceTimersByTime(200);

        // El valor aún debe ser 'primero'
        expect(result.current).toBe('primero');

        // Completamos el delay del último cambio
        jest.advanceTimersByTime(100);

        await waitFor(() => {
            // Debe tener el último valor, no el intermedio
            expect(result.current).toBe('tercero');
        });
    });
});
