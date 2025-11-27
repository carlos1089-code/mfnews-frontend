// Definimos cómo se ve una Noticia en toda la app

export interface User {
    id: string;
    name: string;
    email: string;
    role: 'ADMIN' | 'USER'; // Esto es genial, TS te autocompletará solo estos dos valores
}

// 2. Definimos qué guardamos en la sesión (Contexto)
// Extendemos de User para no repetir name/role, y agregamos token
export interface UserSession extends Pick<User, 'name' | 'role'> {
    token: string;
    // id?: string; // Podrías agregarlo si lo guardas en localStorage
    // email?: string;
}

// 3. Respuesta de la API (Login/Register)
export interface AuthResponse {
    token: string;
    user: User; // Reutilizamos la interfaz User de arriba
}

// 4. Resultado de las operaciones (para que el Login sepa qué recibir)
export interface AuthResult {
    success: boolean;
    error?: string;
}
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