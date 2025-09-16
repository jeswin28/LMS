import { http, HttpResponse } from 'msw';

const API = process.env.VITE_API_BASE_URL || 'http://localhost:5001/api';

export const handlers = [
    // Create course
    http.post(`${API}/courses`, async ({ request }) => {
        const body = await request.json();
        if (!body || !body.title) {
            return HttpResponse.json({ success: false, error: 'Invalid payload' }, { status: 400 });
        }
        return HttpResponse.json({ success: true, course: { id: 1, ...body } }, { status: 201 });
    }),

    // Admin users list
    http.get(`${API}/users`, () => {
        return HttpResponse.json({
            success: true, count: 2, data: [
                { id: 1, name: 'Alice', email: 'alice@example.com', role: 'student' },
                { id: 2, name: 'Bob', email: 'bob@example.com', role: 'instructor' },
            ]
        });
    }),
];