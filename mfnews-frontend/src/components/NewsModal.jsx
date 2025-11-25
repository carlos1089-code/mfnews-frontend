import { useState } from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  Button, TextField, Stack, CircularProgress
} from '@mui/material';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { toast } from 'sonner';
import { NewsService } from '../api/newsService';
// Esquema de validación
const validationSchema = Yup.object().shape({
  title: Yup.string()
    .trim()
    .required('El título es obligatorio')
    .max(100, 'Máximo 100 caracteres'),
  author: Yup.string()
    .trim()
    .required('El autor es obligatorio')
    .max(50, 'Máximo 50 caracteres'),
  image_url: Yup.string()
    .trim()
    .url('Debe ser una URL válida (http://...)')
    .nullable(),
  body: Yup.string()
    .trim()
    .required('El contenido es obligatorio')
    .min(10, 'Mínimo 10 caracteres')
    .max(5000, 'Máximo 5000 caracteres'),
});

export const NewsModal = ({ open, handleClose, initialValues, onSuccess }) => {
  const [isLoading, setIsLoading] = useState(false);
  const formik = useFormik({

    initialValues: {
      id: initialValues?.id || null,
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
        const idToEdit = initialValues?.id;

        console.log("Procesando formulario. ID detectado:", idToEdit);

        const dataToSend = {
          title: values.title,
          author: values.author,
          body: values.body,
          image_url: values.image_url
        };

        if (idToEdit) {
          await NewsService.update(idToEdit, dataToSend);
          toast.success('¡Noticia actualizada correctamente!');
        } else {

          await NewsService.create(dataToSend);
          toast.success('¡Noticia creada con éxito!');
        }

        // 3. Finalización Exitosa
        resetForm();
        handleClose();
        if (onSuccess) onSuccess();

      } catch (error) {
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
        {initialValues?.id ? 'Editar Noticia' : 'Nueva Noticia'}
      </DialogTitle>

      <form onSubmit={formik.handleSubmit}>
        <DialogContent>
          <Stack spacing={2}>

            {/* TÍTULO */}
            <TextField
              fullWidth id="title" name="title" label="Título"
              disabled={isLoading}
              value={formik.values.title} onChange={formik.handleChange}
              error={formik.touched.title && Boolean(formik.errors.title)}
              helperText={formik.touched.title && formik.errors.title}
            />

            {/* AUTOR */}
            <TextField
              fullWidth id="author" name="author" label="Autor"
              disabled={isLoading}
              value={formik.values.author} onChange={formik.handleChange}
              error={formik.touched.author && Boolean(formik.errors.author)}
              helperText={formik.touched.author && formik.errors.author}
            />

            {/* IMAGEN URL */}
            <TextField
              fullWidth id="image_url" name="image_url" label="URL de Imagen"
              placeholder="https://ejemplo.com/foto.jpg"
              disabled={isLoading}
              value={formik.values.image_url} onChange={formik.handleChange}
              error={formik.touched.image_url && Boolean(formik.errors.image_url)}
              helperText={formik.touched.image_url && formik.errors.image_url}
            />

            {/* CONTENIDO (BODY) */}
            <TextField
              fullWidth multiline rows={4} id="body" name="body" label="Contenido"
              disabled={isLoading}
              value={formik.values.body} onChange={formik.handleChange}
              error={formik.touched.body && Boolean(formik.errors.body)}
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