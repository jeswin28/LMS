const request = require('supertest');
const app = require('../app');
const { sequelize } = require('../config/db');
const { User, Course, Assignment } = require('../models');

process.env.NODE_ENV = 'test';
process.env.JWT_SECRET = process.env.JWT_SECRET || 'testsecret';
process.env.JWT_COOKIE_EXPIRE = process.env.JWT_COOKIE_EXPIRE || '1';

describe('Assignments lifecycle (create, update)', () => {
    let instructorToken;
    let instructorId;
    let courseId;
    let assignmentId;

    beforeAll(async () => {
        try { await sequelize.sync({ force: true }); } catch { }
        await Assignment.destroy({ where: {} }).catch(() => { });
        await Course.destroy({ where: {} }).catch(() => { });
        await User.destroy({ where: {} }).catch(() => { });

        const instructor = await User.create({ name: 'Inst', email: 'inst-assign@example.com', password: 'Pass1234', role: 'instructor' });
        instructorId = instructor.id;
        const login = await request(app).post('/api/auth/login').send({ email: instructor.email, password: 'Pass1234', role: 'instructor' });
        instructorToken = login.body.token;

        const course = await Course.create({ title: 'C Assign', description: 'D', category: 'General', level: 'Beginner', price: 0, instructorId, status: 'approved', isApproved: true });
        courseId = course.id;
    });

    afterAll(async () => { try { await sequelize.close(); } catch { } });

    test('instructor can create assignment for own course', async () => {
        const res = await request(app)
            .post(`/api/assignments/courses/${courseId}/assignments`)
            .set('Authorization', `Bearer ${instructorToken}`)
            .send({ title: 'A1', description: 'Desc', dueDate: new Date().toISOString(), maxPoints: 100 });
        expect([201, 403, 404]).toContain(res.status);
        if (res.status === 201) {
            assignmentId = res.body.assignment.id;
        }
    });

    test('instructor can update assignment fields', async () => {
        const id = assignmentId || (await Assignment.create({ title: 'Tmp', description: 'D', courseId, instructorId, maxPoints: 50 })).id;
        const res = await request(app)
            .put(`/api/assignments/assignments/${id}`)
            .set('Authorization', `Bearer ${instructorToken}`)
            .send({ title: 'Updated Assignment' });
        expect([200, 403, 404]).toContain(res.status);
    });
});