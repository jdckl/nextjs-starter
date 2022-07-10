import { encryptPassword, verifyPassword } from '../auth/passwordUtils';

const password = 'strongpass123';
let encryptedPassword;

describe('Test password encryption, verification', () => {
  it('encrypts password', async () => {
    const encrypted = await encryptPassword(password);
    expect(encrypted).toContain('$argon2');
    expect(encrypted).not.toBe(password);
  });

  it('verifies encrypted password', async () => {
    encryptedPassword = await encryptPassword(password);
    await expect(verifyPassword(encryptedPassword, password)).toBeTruthy();
  });
});
