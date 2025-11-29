import { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Stack,
  CircularProgress,
} from "@mui/material";
import { useFormik } from "formik";
import * as Yup from "yup";
import { toast } from "sonner";
import { NewsService } from "../api/newsService.ts";

import { type News, type CreateNewsDto } from "../types/index.ts";

interface NewsModalProps {
  open: boolean;
  handleClose: () => void;
  initialValues?: News | null;
  onSuccess?: () => void;
}

interface FormValues {
  id: string | null;
  title: string;
  author: string;
  image_url: string;
  body: string;
}

const validationSchema = Yup.object().shape({
  title: Yup.string().trim().required("El título es obligatorio").max(100),
  author: Yup.string().trim().required("El autor es obligatorio").max(50),
  image_url: Yup.string().trim().url("URL inválida").nullable(),
  body: Yup.string()
    .trim()
    .required("El contenido es obligatorio")
    .min(10)
    .max(5000),
});

export const NewsModal = ({
  open,
  handleClose,
  initialValues,
  onSuccess,
}: NewsModalProps) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const formik = useFormik<FormValues>({
    initialValues: {
      id: initialValues?.id || null,
      title: initialValues?.title || "",
      author: initialValues?.author || "",
      image_url: initialValues?.image_url || "",
      body: initialValues?.body || "",
    },

    enableReinitialize: true,
    validationSchema: validationSchema,

    onSubmit: async (values, { resetForm }) => {
      setIsLoading(true);

      try {
        const idToEdit = values.id;

        console.log("Procesando formulario. ID:", idToEdit);

        const dataToSend: CreateNewsDto = {
          title: values.title,
          author: values.author,
          body: values.body,
          image_url: values.image_url,
        };

        if (idToEdit) {
          await NewsService.update(idToEdit, dataToSend);
          toast.success("¡Noticia actualizada correctamente!");
        } else {
          // Crear
          await NewsService.create(dataToSend);
          toast.success("¡Noticia creada con éxito!");
        }

        resetForm();
        handleClose();
        if (onSuccess) onSuccess();
      } catch (error: unknown) {
        console.error("Error al guardar:", error);

        const serverMessage = (error as any)?.response?.data?.message;
        if (serverMessage) {
          toast.error(
            Array.isArray(serverMessage) ? serverMessage[0] : serverMessage
          );
        } else {
          toast.error("Hubo un problema al guardar la noticia.");
        }
      } finally {
        setIsLoading(false);
      }
    },
  });

  return (
    <Dialog
      open={open}
      onClose={!isLoading ? handleClose : undefined}
      maxWidth="sm"
      fullWidth
    >
      <DialogTitle>
        {formik.values.id ? "Editar Noticia" : "Nueva Noticia"}
      </DialogTitle>

      <form onSubmit={formik.handleSubmit}>
        <DialogContent>
          <Stack spacing={2}>
            <TextField
              fullWidth
              id="title"
              name="title"
              label="Título"
              disabled={isLoading}
              value={formik.values.title}
              onChange={formik.handleChange}
              error={Boolean(formik.touched.title && formik.errors.title)}
              helperText={formik.touched.title && formik.errors.title}
            />

            <TextField
              fullWidth
              id="author"
              name="author"
              label="Autor"
              disabled={isLoading}
              value={formik.values.author}
              onChange={formik.handleChange}
              error={Boolean(formik.touched.author && formik.errors.author)}
              helperText={formik.touched.author && formik.errors.author}
            />

            <TextField
              fullWidth
              id="image_url"
              name="image_url"
              label="URL de Imagen"
              placeholder="https://ejemplo.com/foto.jpg"
              disabled={isLoading}
              value={formik.values.image_url}
              onChange={formik.handleChange}
              error={Boolean(
                formik.touched.image_url && formik.errors.image_url
              )}
              helperText={formik.touched.image_url && formik.errors.image_url}
            />

            <TextField
              fullWidth
              multiline
              rows={4}
              id="body"
              name="body"
              label="Contenido"
              disabled={isLoading}
              value={formik.values.body}
              onChange={formik.handleChange}
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
            startIcon={
              isLoading ? <CircularProgress size={20} color="inherit" /> : null
            }
          >
            {isLoading ? "Guardando..." : "Guardar"}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};
