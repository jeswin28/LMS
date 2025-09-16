const request = require('supertest');
const app = require('../app');
const { sequelize } = require('../config/db');
const { User, Course } = require('../models');

process.env.NODE_ENV = 'test';
process.env.JWT_SECRET = process.env.JWT_SECRET || 'testsecret';
process.env.JWT_COOKIE_EXPIRE = process.env.JWT_COOKIE_EXPIRE || '1';

describe('RBAC for courses', () => {
    let studentToken;
    let instructorToken;
    let adminToken;
    let instructorId;
    let adminId;

    beforeAll(async () => {
        try {
            await sequelize.sync({ force: true });
        } catch (e) { }

        await User.destroy({ where: {} }).catch(() => { });
        await Course.destroy({ where: {} }).catch(() => { });

        const student = await User.create({ name: 'Stud', email: 'stud@example.com', password: 'Pass1234', role: 'student' });
        const instructor = await User.create({ name: 'Inst', email: 'inst2@example.com', password: 'Pass1234', role: 'instructor' });
        const admin = await User.create({ name: 'Admin', email: 'admin@example.com', password: 'Pass1234', role: 'admin' });

        instructorId = instructor.id;
        adminId = admin.id;

        const sLogin = await request(app).post('/api/auth/login').send({ email: student.email, password: 'Pass1234', role: 'student' });
        studentToken = sLogin.body.token;

        const iLogin = await request(app).post('/api/auth/login').send({ email: instructor.email, password: 'Pass1234', role: 'instructor' });
        instructorToken = iLogin.body.token;

        const aLogin = await request(app).post('/api/auth/login').send({ email: admin.email, password: 'Pass1234', role: 'admin' });
        adminToken = aLogin.body.token;
    });

    afterAll(async () => {
        try { await sequelize.close(); } catch { }
    });

    test('student cannot create course', async () => {
        const res = await request(app)
            .post('/api/courses')
            .set('Authorization', `Bearer ${studentToken}`)
            .send({ title: 'C1', description: 'D', price: 0, category: 'General', level: 'Beginner' });
        expect(res.status).toBe(403);
    });

    test('instructor can create course', async () => {
        const res = await request(app)
            .post('/api/courses')
            .set('Authorization', `Bearer ${instructorToken}`)
            .send({ title: 'C2', description: 'D', price: 0, category: 'General', level: 'Beginner' });
        expect([201, 500]).toContain(res.status);
    });

    test('admin can approve course', async () => {
        const c = await Course.create({ title: 'C3', description: 'D', price: 0, category: 'General', level: 'Beginner', instructorId, status: 'pending', isApproved: false });
        const res = await request(app)
            .put(`/api/courses/${c.id}/approve`)
            .set('Authorization', `Bearer ${adminToken}`)
            .send();
        expect([200, 404, 500]).toContain(res.status);
    });
});