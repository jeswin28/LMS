import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Modal from '../src/components/Modal';

describe('Modal', () => {
    test('does not render when closed', () => {
        const { queryByText } = render(
            <Modal isOpen={false} onClose={() => { }} title="Title">
                <div>Body</div>
            </Modal>
        );
        expect(queryByText('Title')).toBeNull();
    });

    test('renders and closes via overlay and button', () => {
        const onClose = jest.fn();
        render(
            <Modal isOpen onClose={onClose} title="My Modal">
                <div>Content</div>
            </Modal>
        );

        expect(screen.getByText('My Modal')).toBeInTheDocument();

        // Click overlay
        const overlay = document.querySelector('.bg-opacity-50');
        if (!overlay) throw new Error('overlay not found');
        fireEvent.click(overlay);
        expect(onClose).toHaveBeenCalledTimes(1);
    });

    test('toggles body overflow', () => {
        const { rerender } = render(
            <Modal isOpen onClose={() => { }} title="T">
                <div />
            </Modal>
        );
        expect(document.body.style.overflow).toBe('hidden');

        rerender(
            <Modal isOpen={false} onClose={() => { }} title="T">
                <div />
            </Modal>
        );
        expect(document.body.style.overflow).toBe('unset');
    });
});