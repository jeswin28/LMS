import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import LoginPage from '../src/pages/LoginPage';

jest.mock('../src/services/api', () => ({
    __esModule: true,
    default: {
        login: jest.fn(),
    },
}));

jest.mock('../src/context/UserContext', () => ({
    useUser: () => ({ setUser: jest.fn() }),
}));

jest.mock('../src/components/ToastProvider', () => ({
    useToast: () => ({ showToast: jest.fn() }),
}));

const mockLogin = require('../src/services/api').default.login as jest.Mock;

describe('LoginPage', () => {
    test('renders form and submits login', async () => {
        mockLogin.mockResolvedValueOnce({ success: true, token: 't', user: { id: 1, role: 'student', name: 'S', email: 's@example.com' } });

        render(
            <MemoryRouter initialEntries={['/login']}>
                <LoginPage />
            </MemoryRouter>
        );

        // Fill inputs
        fireEvent.change(screen.getByLabelText(/Email address/i), { target: { value: 's@example.com' } });
        fireEvent.change(screen.getByLabelText(/Password/i), { target: { value: 'pass' } });
        fireEvent.change(screen.getByLabelText(/Login as/i), { target: { value: 'student' } });

        fireEvent.click(screen.getByRole('button', { name: /sign in/i }));

        await waitFor(() => expect(mockLogin).toHaveBeenCalled());
        expect(mockLogin).toHaveBeenCalledWith({ email: 's@example.com', password: 'pass', role: 'student' });
    });
});