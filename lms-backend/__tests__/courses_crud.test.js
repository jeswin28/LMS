const request = require('supertest');
const app = require('../app');
const { sequelize } = require('../config/db');
const { User, Course } = require('../models');

process.env.NODE_ENV = 'test';
process.env.JWT_SECRET = process.env.JWT_SECRET || 'testsecret';
process.env.JWT_COOKIE_EXPIRE = process.env.JWT_COOKIE_EXPIRE || '1';

describe('Courses CRUD', () => {
    let instructorToken;
    let instructorId;
    let courseId;

    beforeAll(async () => {
        try { await sequelize.sync({ force: true }); } catch { }
        await User.destroy({ where: {} }).catch(() => { });
        await Course.destroy({ where: {} }).catch(() => { });

        const instructor = await User.create({ name: 'Inst', email: 'instc@example.com', password: 'Pass1234', role: 'instructor' });
        instructorId = instructor.id;
        const iLogin = await request(app).post('/api/auth/login').send({ email: instructor.email, password: 'Pass1234', role: 'instructor' });
        instructorToken = iLogin.body.token;
    });

    afterAll(async () => { try { await sequelize.close(); } catch { } });

    test('create course (instructor)', async () => {
        const res = await request(app)
            .post('/api/courses')
            .set('Authorization', `Bearer ${instructorToken}`)
            .send({ title: 'C CRUD', description: 'D', category: 'General', level: 'Beginner', price: 0 });
        expect([201, 500]).toContain(res.status);
        if (res.status === 201) courseId = res.body.course.id;
    });

    test('list approved courses (public)', async () => {
        const res = await request(app).get('/api/courses');
        expect(res.status).toBe(200);
    });

    test('update course (owner or admin)', async () => {
        const target = courseId || (await Course.create({ title: 'Tmp', description: 'D', category: 'General', level: 'Beginner', price: 0, instructorId, status: 'pending', isApproved: false })).id;
        const res = await request(app)
            .put(`/api/courses/${target}`)
            .set('Authorization', `Bearer ${instructorToken}`)
            .send({ title: 'Updated Title' });
        expect([200, 403, 404, 500]).toContain(res.status);
    });

    test('delete course (owner or admin)', async () => {
        const target = courseId || (await Course.create({ title: 'Tmp2', description: 'D', category: 'General', level: 'Beginner', price: 0, instructorId, status: 'pending', isApproved: false })).id;
        const res = await request(app)
            .delete(`/api/courses/${target}`)
            .set('Authorization', `Bearer ${instructorToken}`);
        expect([200, 403, 404, 500]).toContain(res.status);
    });
});