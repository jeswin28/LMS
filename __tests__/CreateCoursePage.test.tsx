import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import CreateCoursePage from '../src/pages/CreateCoursePage';
import { useUser } from '../src/context/UserContext';
import { useToast } from '../src/components/ToastProvider';

jest.mock('../src/context/UserContext', () => ({
    useUser: jest.fn(),
}));

jest.mock('../src/components/ToastProvider', () => ({
    useToast: () => ({ showToast: jest.fn() }),
}));

const mockUseUser = useUser as unknown as jest.Mock;

describe('CreateCoursePage', () => {
    beforeEach(() => {
        mockUseUser.mockReturnValue({ user: { id: 1, role: 'instructor' } });
    });

    test('fills basic info and advances steps', () => {
        render(
            <MemoryRouter>
                <CreateCoursePage />
            </MemoryRouter>
        );

        fireEvent.change(screen.getByPlaceholderText(/Enter course title/i), { target: { value: 'My Course' } });
        fireEvent.change(screen.getByText('Select a category').closest('select')!, { target: { value: 'Programming' } });
        fireEvent.change(screen.getByPlaceholderText('0.00'), { target: { value: '10' } });

        // Add a tag
        const tagInput = screen.getByPlaceholderText('Add a tag');
        fireEvent.change(tagInput, { target: { value: 'tag1' } });
        fireEvent.click(screen.getByText('Add'));

        // Go to next step if control exists
        const nextButtons = screen.queryAllByText(/Next/i);
        if (nextButtons[0]) fireEvent.click(nextButtons[0]);

        expect(screen.getByText(/Learning Objectives & Prerequisites/i)).toBeInTheDocument();
    });
});