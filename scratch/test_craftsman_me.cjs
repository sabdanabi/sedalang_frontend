const API_BASE = 'https://sedalangbe-production.up.railway.app';

async function main() {
  try {
    const loginRes = await fetch(`${API_BASE}/api/v1/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'craftsman_match_97682@test.com', password: 'Password123!' })
    });
    const loginData = await loginRes.json();
    const token = loginData.data?.accessToken;
    
    console.log('Login token:', token ? 'OK' : 'FAIL');

    const res = await fetch(`${API_BASE}/api/v1/craftsmen/me`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    const data = await res.json();
    console.log('Craftsman Me GET Response:', JSON.stringify(data, null, 2));
  } catch (err) {
    console.error(err);
  }
}

main();
