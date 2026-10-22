import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import http from 'http';
import { app, sessionStore, loginAttempts } from '../server/index';

let server: http.Server;
let baseUrl: string;

beforeAll(async () => {
  await new Promise<void>((resolve) => {
    server = app.listen(0, '127.0.0.1', () => {
      const address = server.address() as { port: number };
      baseUrl = `http://127.0.0.1:${address.port}`;
      resolve();
    });
  });
});

afterAll(async () => {
  await new Promise<void>((resolve) => {
    server.close(() => resolve());
  });
});

describe('1. Unauthenticated Visitor Access Restrictions', () => {
  it('blocks unauthenticated GET /api/contact/messages with 401', async () => {
    const res = await fetch(`${baseUrl}/api/contact/messages`);
    expect(res.status).toBe(401);
    const json = await res.json();
    expect(json.success).toBe(false);
    expect(json.error).toContain('Authentication required');
  });

  it('blocks unauthenticated POST /api/portfolio with 401', async () => {
    const res = await fetch(`${baseUrl}/api/portfolio`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ malicious: 'data' })
    });
    expect(res.status).toBe(401);
  });

  it('blocks unauthenticated POST /api/admin/reset-snapshot with 401', async () => {
    const res = await fetch(`${baseUrl}/api/admin/reset-snapshot`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ confirmation: 'CONFIRM_RESET_SNAPSHOT' })
    });
    expect(res.status).toBe(401);
  });

  it('blocks unauthenticated POST /api/github/sync with 401', async () => {
    const res = await fetch(`${baseUrl}/api/github/sync`, { method: 'POST' });
    expect(res.status).toBe(401);
  });

  it('blocks unauthenticated POST /api/leetcode/sync with 401', async () => {
    const res = await fetch(`${baseUrl}/api/leetcode/sync`, { method: 'POST' });
    expect(res.status).toBe(401);
  });

  it('blocks unauthenticated DELETE /api/contact/messages/test-id with 401', async () => {
    const res = await fetch(`${baseUrl}/api/contact/messages/test-id`, { method: 'DELETE' });
    expect(res.status).toBe(401);
  });
});

describe('2. Public Endpoints Remain Accessible', () => {
  it('allows public read access to GET /api/portfolio', async () => {
    const res = await fetch(`${baseUrl}/api/portfolio`);
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.success).toBe(true);
    expect(json.data).toBeDefined();
    expect(json.data.profile.name).toBe('Vaishnavi');
  });

  it('allows public inquiry submissions via POST /api/contact', async () => {
    const res = await fetch(`${baseUrl}/api/contact`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Technical Recruiter',
        email: 'recruiter@enterprise.ai',
        subject: 'Engineering Opportunity',
        message: 'Hello Vaishnavi, we reviewed your projects and would like to connect.'
      })
    });
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.success).toBe(true);
    expect(json.messageId).toBeDefined();
  });

  it('returns healthy status on GET /api/health with security headers', async () => {
    const res = await fetch(`${baseUrl}/api/health`);
    expect(res.status).toBe(200);
    expect(res.headers.get('x-content-type-options')).toBe('nosniff');
    expect(res.headers.get('x-frame-options')).toBe('SAMEORIGIN');
    expect(res.headers.get('referrer-policy')).toBe('strict-origin-when-cross-origin');
  });

  it('serves SPA index.html on direct navigation to /admin/login without 404', async () => {
    const res = await fetch(`${baseUrl}/admin/login`);
    expect(res.status).toBe(200);
    const html = await res.text();
    expect(html).toContain('id="root"');
  });
});

describe('3. Administrator Authentication & Session Lifecycle', () => {
  beforeEach(() => {
    loginAttempts.clear();
  });

  it('rejects invalid administrator credentials with 401 and generic message', async () => {
    const res = await fetch(`${baseUrl}/api/admin/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        username: 'wrong_user',
        password: 'wrong_password'
      })
    });
    expect(res.status).toBe(401);
    const json = await res.json();
    expect(json.success).toBe(false);
    expect(json.error).toBe('Invalid administrator credentials.');
  });

  it('authenticates valid credentials, sets HTTP-only cookie, and allows protected operations', async () => {
    const username = process.env.ADMIN_USERNAME || 'vaishnavi';
    const password = process.env.ADMIN_PASSWORD || 'admin_secret_dev2026!';

    // 1. Log in
    const loginRes = await fetch(`${baseUrl}/api/admin/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    });

    expect(loginRes.status).toBe(200);
    const loginJson = await loginRes.json();
    expect(loginJson.success).toBe(true);
    expect(loginJson.user.username).toBe(username);

    // Extract cookie
    const setCookieHeader = loginRes.headers.get('set-cookie');
    expect(setCookieHeader).toBeDefined();
    expect(setCookieHeader).toContain('admin_session=');
    expect(setCookieHeader?.toLowerCase()).toContain('httponly');

    const sessionCookie = setCookieHeader!.split(';')[0];

    // 2. Verify GET /api/admin/check with cookie
    const checkRes = await fetch(`${baseUrl}/api/admin/check`, {
      headers: { Cookie: sessionCookie }
    });
    expect(checkRes.status).toBe(200);
    const checkJson = await checkRes.json();
    expect(checkJson.authenticated).toBe(true);

    // 3. Access inquiries with cookie
    const inquiriesRes = await fetch(`${baseUrl}/api/contact/messages`, {
      headers: { Cookie: sessionCookie }
    });
    expect(inquiriesRes.status).toBe(200);
    const inquiriesJson = await inquiriesRes.json();
    expect(inquiriesJson.success).toBe(true);
    expect(Array.isArray(inquiriesJson.messages)).toBe(true);

    // 4. Log out
    const logoutRes = await fetch(`${baseUrl}/api/admin/logout`, {
      method: 'POST',
      headers: { Cookie: sessionCookie }
    });
    expect(logoutRes.status).toBe(200);

    // 5. Subsequent request should now be blocked
    const afterLogoutRes = await fetch(`${baseUrl}/api/contact/messages`, {
      headers: { Cookie: sessionCookie }
    });
    expect(afterLogoutRes.status).toBe(401);
  });
});

describe('4. Reset Snapshot Explicit Protection', () => {
  it('requires explicit confirmation string even for authenticated admin', async () => {
    const username = process.env.ADMIN_USERNAME || 'vaishnavi';
    const password = process.env.ADMIN_PASSWORD || 'admin_secret_dev2026!';

    const loginRes = await fetch(`${baseUrl}/api/admin/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    });
    const sessionCookie = loginRes.headers.get('set-cookie')!.split(';')[0];

    // Attempt without proper confirmation
    const badResetRes = await fetch(`${baseUrl}/api/admin/reset-snapshot`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Cookie: sessionCookie
      },
      body: JSON.stringify({ confirmation: 'wrong' })
    });
    expect(badResetRes.status).toBe(400);

    // With exact confirmation
    const validResetRes = await fetch(`${baseUrl}/api/admin/reset-snapshot`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Cookie: sessionCookie
      },
      body: JSON.stringify({ confirmation: 'CONFIRM_RESET_SNAPSHOT' })
    });
    expect(validResetRes.status).toBe(200);
    const validJson = await validResetRes.json();
    expect(validJson.success).toBe(true);
  });
});

describe('5. Rate Limiting Protection', () => {
  it('blocks rapid brute force login attempts with 429', async () => {
    loginAttempts.clear();

    for (let i = 0; i < 5; i++) {
      await fetch(`${baseUrl}/api/admin/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: 'vaishnavi', password: 'bad_password' })
      });
    }

    // 6th attempt must be rejected with 429 Too Many Requests
    const blockedRes = await fetch(`${baseUrl}/api/admin/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: 'vaishnavi', password: 'bad_password' })
    });

    expect(blockedRes.status).toBe(429);
    const json = await blockedRes.json();
    expect(json.error).toContain('Too many failed login attempts');
  });
});
