import '@testing-library/jest-dom/jest-globals';

// Polyfills para TextEncoder/TextDecoder requeridos por react-router-dom
import { TextEncoder, TextDecoder } from 'util';
global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder as any;
