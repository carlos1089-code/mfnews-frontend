import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, Stack } from '@mui/material';
import { useFormik } from 'formik';
import * as Yup from 'yup';

// Esquema de validación (Reglas del formulario)
const validationSchema = Yup.object({
  title: Yup.string().required('El título es obligatorio'),
  author: Yup.string().required('El autor es obligatorio'),
  image_url: Yup.string().url('Debe ser una URL válida (http...)').nullable(),
  body: Yup.string().required('El contenido de la noticia es obligatorio').min(10, 'Muy corto'),
});

export const NewsModal = ({ open, handleClose, onSubmit, initialValues }) => {
  
  // Configuración de Formik
  const formik = useFormik({
    initialValues: initialValues || {
      title: '',
      author: '',
      image_url: '',
      body: '',
    },
    enableReinitialize: true, // Permite actualizar los datos si cambia initialValues (clave para Editar)
    validationSchema: validationSchema,
    onSubmit: (values, { resetForm }) => {
      onSubmit(values); // Ejecutamos la función que nos pasa el padre (POST o PUT)
      resetForm();
      handleClose();
    },
  });

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        {initialValues ? 'Editar Noticia' : 'Nueva Noticia'}
      </DialogTitle>
      
      <form onSubmit={formik.handleSubmit}>
        <DialogContent>
          <Stack spacing={2}>
            {/* Campo Título */}
            <TextField
              fullWidth
              id="title"
              name="title"
              label="Título"
              value={formik.values.title}
              onChange={formik.handleChange}
              error={formik.touched.title && Boolean(formik.errors.title)}
              helperText={formik.touched.title && formik.errors.title}
            />

            {/* Campo Autor */}
            <TextField
              fullWidth
              id="author"
              name="author"
              label="Autor"
              value={formik.values.author}
              onChange={formik.handleChange}
              error={formik.touched.author && Boolean(formik.errors.author)}
              helperText={formik.touched.author && formik.errors.author}
            />

            {/* Campo URL Imagen */}
            <TextField
              fullWidth
              id="image_url"
              name="image_url"
              label="URL de la Imagen"
              placeholder="https://..."
              value={formik.values.image_url}
              onChange={formik.handleChange}
              error={formik.touched.image_url && Boolean(formik.errors.image_url)}
              helperText={formik.touched.image_url && formik.errors.image_url}
            />

            {/* Campo Contenido (Body) */}
            <TextField
              fullWidth
              multiline
              rows={4}
              id="body"
              name="body"
              label="Contenido de la noticia"
              value={formik.values.body}
              onChange={formik.handleChange}
              error={formik.touched.body && Boolean(formik.errors.body)}
              helperText={formik.touched.body && formik.errors.body}
            />
          </Stack>
        </DialogContent>
        
        <DialogActions>
          <Button onClick={handleClose} color="inherit">Cancelar</Button>
          <Button type="submit" variant="contained" color="primary">
            Guardar
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};