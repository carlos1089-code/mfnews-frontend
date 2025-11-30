import { renderHook, waitFor } from '@testing-library/react';
import { useNews } from './useNews.ts';
import { NewsService } from '../api/newsService.ts';
import type { News } from '../types/index.ts';

// Mock completo del módulo newsService
jest.mock('../api/newsService.ts', () => ({
    NewsService: {
        getAll: jest.fn(),
    },
}));

// Datos de prueba
const mockNews: News[] = [
    {
        id: '1',
        title: 'Noticia 1',
        author: 'Autor 1',
        body: 'Contenido 1',
        image_url: 'https://example.com/1.jpg',
        date: '2024-01-01',
    },
    {
        id: '2',
        title: 'Noticia 2',
        author: 'Autor 2',
        body: 'Contenido 2',
        image_url: 'https://example.com/2.jpg',
        date: '2024-01-02',
    },
    {
        id: '3',
        title: 'Noticia 3',
        author: 'Autor 3',
        body: 'Contenido 3',
        image_url: 'https://example.com/3.jpg',
        date: '2024-01-03',
    },
    {
        id: '4',
        title: 'Noticia 4',
        author: 'Autor 4',
        body: 'Contenido 4',
        image_url: 'https://example.com/4.jpg',
        date: '2024-01-04',
    },
    {
        id: '5',
        title: 'Noticia 5',
        author: 'Autor 5',
        body: 'Contenido 5',
        image_url: 'https://example.com/5.jpg',
        date: '2024-01-05',
    },
];

describe('useNews', () => {
    // Limpiamos los mocks antes de cada test
    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('debería cargar noticias exitosamente', async () => {
        // Configuramos el mock para que retorne nuestras noticias de prueba
        (NewsService.getAll as jest.Mock).mockResolvedValue(mockNews);

        const { result } = renderHook(() => useNews());

        // Al inicio debe estar en loading
        expect(result.current.loading).toBe(true);
        expect(result.current.news).toEqual([]);
        expect(result.current.error).toBe(null);

        // Esperamos a que se carguen las noticias
        await waitFor(() => {
            expect(result.current.loading).toBe(false);
        });

        // Verificamos que las noticias se cargaron correctamente
        expect(result.current.news).toEqual(mockNews);
        expect(result.current.error).toBe(null);
        expect(NewsService.getAll).toHaveBeenCalledWith('');
    });

    test('debería manejar errores al cargar noticias', async () => {
        // Configuramos el mock para que falle
        (NewsService.getAll as jest.Mock).mockRejectedValue(new Error('Error de red'));

        const { result } = renderHook(() => useNews());

        // Esperamos a que termine la carga
        await waitFor(() => {
            expect(result.current.loading).toBe(false);
        });

        // Verificamos que se manejó el error
        expect(result.current.error).toBe('Error al cargar noticias');
        expect(result.current.news).toEqual([]);
    });

    test('debería dividir las noticias correctamente (heroNews, sideNews, gridNews)', async () => {
        (NewsService.getAll as jest.Mock).mockResolvedValue(mockNews);

        const { result } = renderHook(() => useNews());

        await waitFor(() => {
            expect(result.current.loading).toBe(false);
        });

        // heroNews debe ser la primera noticia
        expect(result.current.heroNews).toEqual(mockNews[0]);

        // sideNews debe ser las noticias 2, 3 y 4 (índices 1, 2, 3)
        expect(result.current.sideNews).toEqual(mockNews.slice(1, 4));

        // gridNews debe ser desde la noticia 5 en adelante (índice 4+)
        expect(result.current.gridNews).toEqual(mockNews.slice(4));
    });

    test('debería buscar noticias con searchTerm', async () => {
        (NewsService.getAll as jest.Mock).mockResolvedValue(mockNews);

        const searchTerm = 'React';
        renderHook(() => useNews(searchTerm));

        await waitFor(() => {
            expect(NewsService.getAll).toHaveBeenCalledWith(searchTerm);
        });
    });

    test('debería refrescar las noticias cuando se llama a refetch', async () => {
        (NewsService.getAll as jest.Mock).mockResolvedValue(mockNews);

        const { result } = renderHook(() => useNews());

        // Esperamos la carga inicial
        await waitFor(() => {
            expect(result.current.loading).toBe(false);
        });

        // Verificamos que se llamó una vez
        expect(NewsService.getAll).toHaveBeenCalledTimes(1);

        // Llamamos a refetch
        result.current.refetch();

        // Esperamos a que se vuelva a cargar
        await waitFor(() => {
            expect(NewsService.getAll).toHaveBeenCalledTimes(2);
        });
    });
});
