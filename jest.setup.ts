import '@testing-library/jest-dom';
import { TextEncoder, TextDecoder } from 'util';

// Minimal polyfills for React Router
global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;