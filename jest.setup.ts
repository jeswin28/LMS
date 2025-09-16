import '@testing-library/jest-dom';
import { TextEncoder, TextDecoder } from 'util';

// Polyfill for libraries expecting these globals in jsdom
// @ts-ignore
global.TextEncoder = TextEncoder as unknown as typeof global.TextEncoder;
// @ts-ignore
global.TextDecoder = TextDecoder as unknown as typeof global.TextDecoder;