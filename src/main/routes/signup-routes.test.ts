import request from 'supertest'
import app from '../config/app'

describe('Signup Routes',() => {
  test('should returns signup account success', async () => {
    await request(app)
      .post('/api/signup')
      .send({
        name: 'Marcus',
        email: 'm@m.com',
        password: '123',
        passwordConfirmation: '123'
      })
      .expect(200)
  })
})
