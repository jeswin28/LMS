const request = require('supertest');
const app = require('../app');
const { sequelize } = require('../config/db');
const { User, Course, Enrollment } = require('../models');

process.env.NODE_ENV = 'test';
process.env.JWT_SECRET = process.env.JWT_SECRET || 'testsecret';
process.env.JWT_COOKIE_EXPIRE = process.env.JWT_COOKIE_EXPIRE || '1';

describe('Enrollments', () => {
    let studentToken;
    let instructorToken;
    let courseId;

    beforeAll(async () => {
        try { await sequelize.sync({ force: true }); } catch { }

        await Enrollment.destroy({ where: {} }).catch(() => { });
        await Course.destroy({ where: {} }).catch(() => { });
        await User.destroy({ where: {} }).catch(() => { });

        const instructor = await User.create({ name: 'Inst', email: 'inst-enr@example.com', password: 'Pass1234', role: 'instructor' });
        const student = await User.create({ name: 'Stud', email: 'stud-enr@example.com', password: 'Pass1234', role: 'student' });

        const iLogin = await request(app).post('/api/auth/login').send({ email: instructor.email, password: 'Pass1234', role: 'instructor' });
        instructorToken = iLogin.body.token;
        const sLogin = await request(app).post('/api/auth/login').send({ email: student.email, password: 'Pass1234', role: 'student' });
        studentToken = sLogin.body.token;

        const course = await Course.create({
            title: 'Enroll 101', description: 'Basics', category: 'General', level: 'Beginner', price: 0,
            instructorId: instructor.id, status: 'approved', isApproved: true,
        });
        courseId = course.id;
    });

    afterAll(async () => { try { await sequelize.close(); } catch { } });

    test('student can successfully enroll in a course', async () => {
        const res = await request(app)
            .post('/api/enrollments')
            .set('Authorization', `Bearer ${studentToken}`)
            .send({ courseId });
        expect(res.status).toBe(201);
        expect(res.body).toHaveProperty('enrollment');
    });

    test('student cannot enroll in the same course twice', async () => {
        const res = await request(app)
            .post('/api/enrollments')
            .set('Authorization', `Bearer ${studentToken}`)
            .send({ courseId });
        expect(res.status).toBe(400);
    });

    test('instructor cannot enroll in a course', async () => {
        const res = await request(app)
            .post('/api/enrollments')
            .set('Authorization', `Bearer ${instructorToken}`)
            .send({ courseId });
        expect(res.status).toBe(403);
    });
});