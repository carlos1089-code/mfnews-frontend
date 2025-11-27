export interface User {
  id: string;
  name: string;
  email: string;
  role: "ADMIN" | "USER";
}

export interface UserSession extends Pick<User, "name" | "role"> {
  token: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface AuthResult {
  success: boolean;
  error?: string;
}
export interface News {
  id?: string;
  title: string;
  author: string;
  body: string;
  image_url?: string;
  date?: string;
}

export type CreateNewsDto = Omit<News, "id" | "_id" | "date">;

export interface AuthResponse {
  token: string;
  user: {
    id: string;
    name: string;
    email: string;
    role: "ADMIN" | "USER";
  };
}
