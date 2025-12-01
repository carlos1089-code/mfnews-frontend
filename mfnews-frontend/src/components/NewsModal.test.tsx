import { render, screen, waitFor } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { NewsModal } from './NewsModal.tsx';
import { NewsService } from '../api/newsService.ts';
import type { News } from '../types/index.ts';

// Mock del NewsService
jest.mock('../api/newsService.ts', () => ({
    NewsService: {
        create: jest.fn(),
        update: jest.fn(),
    },
}));

// Mock de toast
jest.mock('sonner', () => ({
    toast: {
        success: jest.fn(),
        error: jest.fn(),
    },
}));

const mockHandleClose = jest.fn();
const mockOnSuccess = jest.fn();

describe('NewsModal', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('Modo Creación', () => {
        test('debería mostrar el título "Nueva Noticia" cuando no hay initialValues', () => {
            render(
                <NewsModal
                    open={true}
                    handleClose={mockHandleClose}
                    initialValues={null}
                />
            );

            expect(screen.getByText('Nueva Noticia')).toBeInTheDocument();
        });

        test('debería tener todos los campos vacíos inicialmente', () => {
            render(
                <NewsModal
                    open={true}
                    handleClose={mockHandleClose}
                    initialValues={null}
                />
            );

            expect(screen.getByLabelText('Título')).toHaveValue('');
            expect(screen.getByLabelText('Autor')).toHaveValue('');
            expect(screen.getByLabelText('URL de Imagen')).toHaveValue('');
            expect(screen.getByLabelText('Contenido')).toHaveValue('');
        });

        test('debería crear una noticia exitosamente', async () => {
            const user = userEvent.setup();
            (NewsService.create as jest.Mock).mockResolvedValue({});

            render(
                <NewsModal
                    open={true}
                    handleClose={mockHandleClose}
                    onSuccess={mockOnSuccess}
                />
            );

            // Llenar el formulario
            await user.type(screen.getByLabelText('Título'), 'Nueva Noticia Test');
            await user.type(screen.getByLabelText(/Subtítulo/i), 'Mi subtítulo');
            await user.type(screen.getByLabelText('Autor'), 'Carlos');
            await user.type(screen.getByLabelText('URL de Imagen'), 'https://example.com/img.jpg');
            await user.type(screen.getByLabelText('Contenido'), 'Este es el contenido de la noticia de prueba');

            // Enviar formulario
            const submitButton = screen.getByRole('button', { name: /guardar/i });
            await user.click(submitButton);

            // Verificar que se llamó al servicio
            await waitFor(() => {
                expect(NewsService.create).toHaveBeenCalled();
            }, { timeout: 10000 });

            // Verificar que se cerraron los callbacks
            expect(mockHandleClose).toHaveBeenCalled();
            expect(mockOnSuccess).toHaveBeenCalled();
        }, 15000); // Timeout de 15 segundos para este test

        test('debería mostrar errores de validación para campos requeridos', async () => {
            const user = userEvent.setup();

            render(
                <NewsModal
                    open={true}
                    handleClose={mockHandleClose}
                />
            );

            // Intentar enviar sin llenar campos
            const submitButton = screen.getByRole('button', { name: /guardar/i });
            await user.click(submitButton);

            // Verificar errores de validación
            await waitFor(() => {
                expect(screen.getByText('El título es obligatorio')).toBeInTheDocument();
                expect(screen.getByText('El autor es obligatorio')).toBeInTheDocument();
                expect(screen.getByText('El contenido es obligatorio')).toBeInTheDocument();
            });

            // No debe llamar al servicio
            expect(NewsService.create).not.toHaveBeenCalled();
        });
    });

    describe('Modo Edición', () => {
        const mockExistingNews: News = {
            id: '456',
            title: 'Noticia Existente',
            subtitle: 'Un subtítulo de ejemplo',
            author: 'Autor Original',
            body: 'Contenido original de la noticia',
            image_url: 'https://example.com/original.jpg',
            date: '2024-01-15',
        };

        test('debería mostrar el título "Editar Noticia" cuando hay initialValues', () => {
            render(
                <NewsModal
                    open={true}
                    handleClose={mockHandleClose}
                    initialValues={mockExistingNews}
                />
            );

            expect(screen.getByText('Editar Noticia')).toBeInTheDocument();
        });

        test('debería prellenar los campos con los valores existentes', () => {
            render(
                <NewsModal
                    open={true}
                    handleClose={mockHandleClose}
                    initialValues={mockExistingNews}
                />
            );

            expect(screen.getByLabelText('Título')).toHaveValue('Noticia Existente');
            expect(screen.getByLabelText('Autor')).toHaveValue('Autor Original');
            expect(screen.getByLabelText('URL de Imagen')).toHaveValue('https://example.com/original.jpg');
            expect(screen.getByLabelText('Contenido')).toHaveValue('Contenido original de la noticia');
        });

        test('debería actualizar una noticia exitosamente', async () => {
            const user = userEvent.setup();
            (NewsService.update as jest.Mock).mockResolvedValue({});

            render(
                <NewsModal
                    open={true}
                    handleClose={mockHandleClose}
                    initialValues={mockExistingNews}
                    onSuccess={mockOnSuccess}
                />
            );

            // Modificar el título
            const titleField = screen.getByLabelText('Título');
            await user.clear(titleField);
            await user.type(titleField, 'Actualizado');

            // Enviar formulario
            const submitButton = screen.getByRole('button', { name: /guardar/i });
            await user.click(submitButton);

            // Verificar que se llamó al servicio de actualización
            await waitFor(() => {
                expect(NewsService.update).toHaveBeenCalled();
            }, { timeout: 10000 });

            expect(mockHandleClose).toHaveBeenCalled();
            expect(mockOnSuccess).toHaveBeenCalled();
        });
    });

    describe('Interacción con Modal', () => {
        test('debería cerrar el modal al hacer click en Cancelar', async () => {
            const user = userEvent.setup();

            render(
                <NewsModal
                    open={true}
                    handleClose={mockHandleClose}
                />
            );

            const cancelButton = screen.getByRole('button', { name: /cancelar/i });
            await user.click(cancelButton);

            expect(mockHandleClose).toHaveBeenCalled();
        });

        test('no debería renderizar cuando open es false', () => {
            const { container } = render(
                <NewsModal
                    open={false}
                    handleClose={mockHandleClose}
                />
            );

            // El modal no debe estar visible
            expect(container.querySelector('[role="dialog"]')).not.toBeInTheDocument();
        });
    });
});
