import { useState } from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  Button, TextField, Stack, CircularProgress
} from '@mui/material';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { toast } from 'sonner';
import { NewsService } from '../api/newsService.ts';

import { type News,type  CreateNewsDto } from '../types/index.ts';

// 1. Definimos qué props recibe el Modal
interface NewsModalProps {
    open: boolean;
    handleClose: () => void;
    initialValues?: News | null; // Puede ser una noticia o null/undefined
    onSuccess?: () => void;
}

// 2. Definimos la estructura de los valores del formulario
interface FormValues {
    id: string | null;
    title: string;
    author: string;
    image_url: string;
    body: string;
}

// Esquema de validación (se mantiene igual)
const validationSchema = Yup.object().shape({
  title: Yup.string().trim().required('El título es obligatorio').max(100),
  author: Yup.string().trim().required('El autor es obligatorio').max(50),
  image_url: Yup.string().trim().url('URL inválida').nullable(),
  body: Yup.string().trim().required('El contenido es obligatorio').min(10).max(5000),
});

export const NewsModal = ({ open, handleClose, initialValues, onSuccess }: NewsModalProps) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // 3. Tipamos useFormik con la interfaz FormValues
  const formik = useFormik<FormValues>({
    initialValues: {
      // Prioridad: _id (Mongo) > id (Genérico) > null
      id: initialValues?.id || initialValues?.id || null,
      title: initialValues?.title || '',
      author: initialValues?.author || '',
      image_url: initialValues?.image_url || '',
      body: initialValues?.body || ''
    },

    enableReinitialize: true,
    validationSchema: validationSchema,

    onSubmit: async (values, { resetForm }) => {
      setIsLoading(true);

      try {
        const idToEdit = values.id; // Tomamos el ID directamente del form state

        console.log("Procesando formulario. ID:", idToEdit);

        // Preparamos el DTO (Data Transfer Object)
        // Omitimos el ID porque ese va en la URL, no en el cuerpo
        const dataToSend: CreateNewsDto = {
          title: values.title,
          author: values.author,
          body: values.body,
          image_url: values.image_url
        };

        if (idToEdit) {
          // Actualizar
          await NewsService.update(idToEdit, dataToSend);
          toast.success('¡Noticia actualizada correctamente!');
        } else {
          // Crear
          await NewsService.create(dataToSend);
          toast.success('¡Noticia creada con éxito!');
        }

        resetForm();
        handleClose();
        if (onSuccess) onSuccess();

      } catch (error: any) { // Usamos any aquí para poder acceder a response.data libremente
        console.error('Error al guardar:', error);

        const serverMessage = error.response?.data?.message;
        if (serverMessage) {
          toast.error(Array.isArray(serverMessage) ? serverMessage[0] : serverMessage);
        } else {
          toast.error('Hubo un problema al guardar la noticia.');
        }

      } finally {
        setIsLoading(false);
      }
    },
  });

  return (
    <Dialog open={open} onClose={!isLoading ? handleClose : undefined} maxWidth="sm" fullWidth>
      <DialogTitle>
        {/* Usamos formik.values.id para decidir el título, es más reactivo */}
        {formik.values.id ? 'Editar Noticia' : 'Nueva Noticia'}
      </DialogTitle>

      <form onSubmit={formik.handleSubmit}>
        <DialogContent>
          <Stack spacing={2}>

            {/* TÍTULO */}
            <TextField
              fullWidth id="title" name="title" label="Título"
              disabled={isLoading}
              value={formik.values.title} onChange={formik.handleChange}
              error={Boolean(formik.touched.title && formik.errors.title)}
              helperText={formik.touched.title && formik.errors.title}
            />

            {/* AUTOR */}
            <TextField
              fullWidth id="author" name="author" label="Autor"
              disabled={isLoading}
              value={formik.values.author} onChange={formik.handleChange}
              error={Boolean(formik.touched.author && formik.errors.author)}
              helperText={formik.touched.author && formik.errors.author}
            />

            {/* IMAGEN URL */}
            <TextField
              fullWidth id="image_url" name="image_url" label="URL de Imagen"
              placeholder="https://ejemplo.com/foto.jpg"
              disabled={isLoading}
              value={formik.values.image_url} onChange={formik.handleChange}
              error={Boolean(formik.touched.image_url && formik.errors.image_url)}
              helperText={formik.touched.image_url && formik.errors.image_url}
            />

            {/* CONTENIDO (BODY) */}
            <TextField
              fullWidth multiline rows={4} id="body" name="body" label="Contenido"
              disabled={isLoading}
              value={formik.values.body} onChange={formik.handleChange}
              error={Boolean(formik.touched.body && formik.errors.body)}
              helperText={formik.touched.body && formik.errors.body}
            />

          </Stack>
        </DialogContent>

        <DialogActions>
          <Button onClick={handleClose} color="inherit" disabled={isLoading}>
            Cancelar
          </Button>

          <Button
            type="submit"
            variant="contained"
            disabled={isLoading}
            startIcon={isLoading ? <CircularProgress size={20} color="inherit" /> : null}
          >
            {isLoading ? 'Guardando...' : 'Guardar'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};