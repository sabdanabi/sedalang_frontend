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

    const res = await fetch(`${API_BASE}/api/v1/users/me`, {
      method: 'PATCH',
      headers: { 
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        fullName: 'Test FullName',
        phoneNumber: '081234567890',
        address: 'Semarang Tengah, Jawa Tengah',
        latitude: -6.9806,
        longitude: 110.4208
      })
    });
    const data = await res.json();
    console.log('PATCH Users Me Response:', JSON.stringify(data, null, 2));
  } catch (err) {
    console.error(err);
  }
}

main();
