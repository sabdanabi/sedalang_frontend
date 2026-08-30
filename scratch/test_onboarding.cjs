const API_BASE = 'https://sedalangbe-production.up.railway.app';

async function main() {
  try {
    const randomSuffix = Math.floor(Math.random() * 1000000);
    const email = `test_user_${randomSuffix}@test.com`;
    const password = 'Password123!';
    const fullName = 'Test User';
    const phoneNumber = '081234567890';

    // 1. Register
    console.log('Registering user:', email);
    const registerRes = await fetch(`${API_BASE}/api/v1/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, fullName, phoneNumber })
    });
    const registerData = await registerRes.json();
    console.log('Register Response:', JSON.stringify(registerData, null, 2));

    const token = registerData.data?.accessToken;
    if (!token) {
      console.log('No token in registration response!');
      return;
    }

    // 2. Try calling GET /api/v1/users/me
    console.log('\nFetching GET /api/v1/users/me...');
    const getMeRes = await fetch(`${API_BASE}/api/v1/users/me`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    const getMeData = await getMeRes.json();
    console.log('GET Me Response:', JSON.stringify(getMeData, null, 2));

    // 3. Update role to USER
    console.log('\nUpdating role to USER...');
    const roleRes = await fetch(`${API_BASE}/api/v1/users/me/role`, {
      method: 'PATCH',
      headers: { 
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ role: 'USER' })
    });
    const roleData = await roleRes.json();
    console.log('Role Update Response:', JSON.stringify(roleData, null, 2));

    // 4. Try Skip Onboarding (POST /api/v1/onboarding/skip)
    console.log('\nSkipping onboarding (POST /api/v1/onboarding/skip)...');
    const skipRes = await fetch(`${API_BASE}/api/v1/onboarding/skip`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${token}` }
    });
    const skipData = await skipRes.json();
    console.log('Skip Onboarding Response:', JSON.stringify(skipData, null, 2));

    // 5. Try calling GET /api/v1/users/me after skip
    console.log('\nFetching GET /api/v1/users/me after skip...');
    const postSkipMeRes = await fetch(`${API_BASE}/api/v1/users/me`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    const postSkipMeData = await postSkipMeRes.json();
    console.log('GET Me Post-Skip Response:', JSON.stringify(postSkipMeData, null, 2));

  } catch (err) {
    console.error(err);
  }
}

main();
