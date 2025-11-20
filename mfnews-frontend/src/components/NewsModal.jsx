import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, Stack, CircularProgress } from '@mui/material';
import { useFormik } from 'formik';
import * as Yup from 'yup';

const validationSchema = Yup.object({
  title: Yup.string().required('El título es obligatorio'),
  author: Yup.string().required('El autor es obligatorio'),
  image_url: Yup.string().url('Debe ser una URL válida').nullable(),
  body: Yup.string().required('El contenido es obligatorio').min(10, 'Muy corto'),
});

// Agregamos "isLoading" a las props que recibe el componente
export const NewsModal = ({ open, handleClose, onSubmit, initialValues, isLoading }) => {
  
  const formik = useFormik({
    initialValues: initialValues || { title: '', author: '', image_url: '', body: '' },
    enableReinitialize: true,
    validationSchema: validationSchema,
    onSubmit: (values, { resetForm }) => {
      // Pasamos resetForm para que el padre decida cuándo limpiar
      onSubmit(values, resetForm); 
    },
  });

  return (
    <Dialog open={open} onClose={!isLoading ? handleClose : undefined} maxWidth="sm" fullWidth>
      <DialogTitle>{initialValues ? 'Editar Noticia' : 'Nueva Noticia'}</DialogTitle>
      
      <form onSubmit={formik.handleSubmit}>
        <DialogContent>
          <Stack spacing={2}>
            <TextField
              fullWidth id="title" name="title" label="Título"
              disabled={isLoading} // Bloqueamos inputs mientras carga
              value={formik.values.title} onChange={formik.handleChange}
              error={formik.touched.title && Boolean(formik.errors.title)}
              helperText={formik.touched.title && formik.errors.title}
            />
            <TextField
              fullWidth id="author" name="author" label="Autor"
              disabled={isLoading}
              value={formik.values.author} onChange={formik.handleChange}
              error={formik.touched.author && Boolean(formik.errors.author)}
              helperText={formik.touched.author && formik.errors.author}
            />
            <TextField
              fullWidth id="image_url" name="image_url" label="URL Imagen" placeholder="https://..."
              disabled={isLoading}
              value={formik.values.image_url} onChange={formik.handleChange}
              error={formik.touched.image_url && Boolean(formik.errors.image_url)}
              helperText={formik.touched.image_url && formik.errors.image_url}
            />
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
          
          {/* BOTÓN CON SPINNER */}
          <Button 
            type="submit" 
            variant="contained" 
            color="primary"
            disabled={isLoading} // Evita doble click
            startIcon={isLoading ? <CircularProgress size={20} color="inherit" /> : null}
          >
            {isLoading ? 'Guardando...' : 'Guardar'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};