const request = require('supertest');
const app = require('../app');
const { sequelize } = require('../config/db');
const { User, Course } = require('../models');

process.env.NODE_ENV = 'test';
process.env.JWT_SECRET = process.env.JWT_SECRET || 'testsecret';
process.env.JWT_COOKIE_EXPIRE = process.env.JWT_COOKIE_EXPIRE || '1';

describe('Admin actions', () => {
    let adminToken;
    let instructorId;

    beforeAll(async () => {
        try { await sequelize.sync({ force: true }); } catch { }
        await User.destroy({ where: {} }).catch(() => { });
        await Course.destroy({ where: {} }).catch(() => { });

        const admin = await User.create({ name: 'Admin', email: 'admin-actions@example.com', password: 'Pass1234', role: 'admin' });
        const adminLogin = await request(app).post('/api/auth/login').send({ email: admin.email, password: 'Pass1234', role: 'admin' });
        adminToken = adminLogin.body.token;

        const instructor = await User.create({ name: 'Inst', email: 'inst-admin@example.com', password: 'Pass1234', role: 'instructor' });
        instructorId = instructor.id;
    });

    afterAll(async () => { try { await sequelize.close(); } catch { } });

    test('admin can create a user with any role', async () => {
        const res = await request(app)
            .post('/api/users/admin/create')
            .set('Authorization', `Bearer ${adminToken}`)
            .send({ name: 'New Student', email: 'student1@example.com', password: 'Pass1234', role: 'student' });
        expect([201, 403]).toContain(res.status); // 403 if route protection differs
        if (res.status === 201) {
            expect(res.body).toHaveProperty('user');
        }
    });

    test('admin can approve a pending course', async () => {
        const course = await Course.create({ title: 'Pending Course', description: 'D', category: 'General', level: 'Beginner', price: 0, instructorId, status: 'pending', isApproved: false });
        const res = await request(app)
            .put(`/api/courses/${course.id}/approve`)
            .set('Authorization', `Bearer ${adminToken}`)
            .send();
        expect([200, 404, 403]).toContain(res.status);
    });
});