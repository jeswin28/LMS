import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Sidebar from '../src/components/Sidebar';

jest.mock('../src/context/UserContext', () => ({
    useUser: () => ({ setUser: jest.fn() }),
}));

const setup = (role: 'student' | 'instructor' | 'admin') =>
    render(
        <MemoryRouter initialEntries={['/']}>
            <Sidebar userRole={role} />
        </MemoryRouter>
    );

const clickMobileToggle = () => {
    const toggles = screen.getAllByRole('button');
    // first button is the mobile menu toggle
    fireEvent.click(toggles[0]);
};

describe('Sidebar', () => {
    test('renders student menu items and toggles menu', () => {
        setup('student');
        clickMobileToggle();

        expect(screen.getByText('My Courses')).toBeInTheDocument();
        expect(screen.getByText('Assignments')).toBeInTheDocument();
    });

    test('renders instructor-specific item', () => {
        setup('instructor');
        clickMobileToggle();
        expect(screen.getByText('Create Course')).toBeInTheDocument();
    });

    test('renders admin-specific items and logout button', () => {
        setup('admin');
        clickMobileToggle();
        expect(screen.getByText('Users')).toBeInTheDocument();
        expect(screen.getByText('Approvals')).toBeInTheDocument();
        expect(screen.getByText('Logout')).toBeInTheDocument();
    });
});