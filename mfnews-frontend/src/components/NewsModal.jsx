import { useState } from 'react';
import { 
  Dialog, DialogTitle, DialogContent, DialogActions, 
  Button, TextField, Stack, CircularProgress 
} from '@mui/material';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import newsApi from '../api/newsApi'; 
import {toast} from 'sonner';

// Esquema de validación (Corregido para ser más flexible con las imágenes)
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
    // Si llegan initialValues (edición) los usa, si no, empieza vacío (creación)
    initialValues: initialValues || { 
        title: '', 
        author: '', 
        image_url: '', 
        body: '' 
    },
    enableReinitialize: true, // Importante para cuando cargamos datos de edición
    validationSchema: validationSchema,
    
    onSubmit: async (values, { resetForm }) => {
      setIsLoading(true);
      try {
        if (initialValues?.id) {
            // --- MODO EDICIÓN (PATCH) ---
            await newsApi.patch(`//${initialValues.id}`, values);
            toast.success('¡Noticia actualizada correctamente!');
        } else {
            // --- MODO CREACIÓN (POST) ---
            await newsApi.post('/', values);
            toast.success('¡Noticia creada con éxito!');
        }

        // Si todo sale bien:
        resetForm();
        handleClose();       // 1. Cerramos el modal
        if (onSuccess) onSuccess(); // 2. Avisamos al padre (Navbar/Home) que refresque

      } catch (error) {
        console.error('Error al guardar:', error);
        toast.error('Hubo un problema al guardar la noticia.');
      } finally {
        setIsLoading(false);
      }
    },
  });

  return (
    // Bloqueamos el cierre del modal si está cargando (!isLoading)
    <Dialog open={open} onClose={!isLoading ? handleClose : undefined} maxWidth="sm" fullWidth>
      <DialogTitle>
        {initialValues ? 'Editar Noticia' : 'Nueva Noticia'}
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