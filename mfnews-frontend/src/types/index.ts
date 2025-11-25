// Definimos cómo se ve una Noticia en toda la app
export interface News {
    id?: string;    // A veces el front usa id
    title: string;
    author: string;
    body: string;
    image_url?: string;
    date?: string;
}

// Para cuando creamos una noticia (no tiene ID ni fecha aún)
export type CreateNewsDto = Omit<News, 'id' | '_id' | 'date'>;

// Definimos la respuesta de Autenticación
export interface AuthResponse {
    token: string;
    user: {
        id: string;
        name: string;
        email: string;
        role: 'ADMIN' | 'USER';
    };
}