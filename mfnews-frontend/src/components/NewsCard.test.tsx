import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import userEvent from '@testing-library/user-event';
import { NewsCard } from './NewsCard.tsx';
import type { News } from '../types/index.ts';

// Mock de useNavigate
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: () => mockNavigate,
}));

// Helper para renderizar con Router
const renderWithRouter = (component: React.ReactElement) => {
    return render(<BrowserRouter>{component}</BrowserRouter>);
};

// Datos de prueba
const mockNews: News = {
    id: '123',
    title: 'Noticia de Prueba',
    author: 'Carlos Test',
    body: 'Este es el contenido de la noticia de prueba que debe ser truncado si es muy largo para verificar que la función truncate funciona correctamente.',
    image_url: 'https://example.com/image.jpg',
    date: '2024-01-15',
};

describe('NewsCard', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('debería renderizar correctamente todos los elementos', () => {
        renderWithRouter(<NewsCard news={mockNews} />);

        // Verificar que se muestra el título
        expect(screen.getByText('Noticia de Prueba')).toBeInTheDocument();

        // Verificar que se muestra el autor
        expect(screen.getByText('Carlos Test')).toBeInTheDocument();

        // Verificar que se muestra la fecha formateada
        const formattedDate = new Date('2024-01-15').toLocaleDateString();
        expect(screen.getByText(formattedDate)).toBeInTheDocument();

        // Verificar que la imagen tiene el src correcto
        const image = screen.getByRole('img', { name: 'Noticia de Prueba' });
        expect(image).toHaveAttribute('src', 'https://example.com/image.jpg');
    });

    test('debería truncar el contenido largo a 100 caracteres', () => {
        renderWithRouter(<NewsCard news={mockNews} />);

        // El body tiene más de 100 caracteres, debe estar truncado
        const truncatedText = screen.getByText(/Este es el contenido de la noticia de prueba/);
        expect(truncatedText.textContent).toMatch(/\.\.\.$/); // Debe terminar con "..."
        // La función truncate corta en n-1 + "..." = 99 + 3 = 102 caracteres
        expect(truncatedText.textContent!.length).toBeLessThanOrEqual(102);
    });

    test('debería navegar a la página de detalle al hacer click', async () => {
        const user = userEvent.setup();
        renderWithRouter(<NewsCard news={mockNews} />);

        // Hacer click en la card
        const card = screen.getByRole('button');
        await user.click(card);

        // Verificar que se llamó a navigate con la URL correcta
        expect(mockNavigate).toHaveBeenCalledWith('/news/123');
        expect(mockNavigate).toHaveBeenCalledTimes(1);
    });

    test('debería usar imagen placeholder si no hay image_url', () => {
        const newsWithoutImage: News = {
            ...mockNews,
            image_url: '',
        };

        renderWithRouter(<NewsCard news={newsWithoutImage} />);

        const image = screen.getByRole('img');
        expect(image).toHaveAttribute('src', 'https://via.placeholder.com/300');
    });

    test('debería manejar contenido corto sin truncar', () => {
        const newsWithShortBody: News = {
            ...mockNews,
            body: 'Contenido corto',
        };

        renderWithRouter(<NewsCard news={newsWithShortBody} />);

        const bodyText = screen.getByText('Contenido corto');
        expect(bodyText.textContent).not.toMatch(/\.\.\.$/);
    });

    test('debería formatear la fecha correctamente cuando no hay fecha', () => {
        const newsWithoutDate: News = {
            ...mockNews,
            date: undefined as any,
        };

        renderWithRouter(<NewsCard news={newsWithoutDate} />);

        // Debe usar Date.now() como fallback
        const todayFormatted = new Date(Date.now()).toLocaleDateString();
        expect(screen.getByText(todayFormatted)).toBeInTheDocument();
    });
});
