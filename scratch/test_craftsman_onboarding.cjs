const API_BASE = 'https://sedalangbe-production.up.railway.app';

async function main() {
  try {
    const randomSuffix = Math.floor(Math.random() * 1000000);
    const email = `test_craftsman_${randomSuffix}@test.com`;
    const password = 'Password123!';
    const fullName = 'Test Craftsman';
    const phoneNumber = '081234567890';

    // 1. Register
    console.log('Registering user:', email);
    const registerRes = await fetch(`${API_BASE}/api/v1/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, fullName, phoneNumber })
    });
    const registerData = await registerRes.json();
    const token = registerData.data?.accessToken;
    if (!token) {
      console.log('No token in registration response!');
      return;
    }

    // 2. Update role to CRAFTSMAN
    console.log('\nUpdating role to CRAFTSMAN...');
    const roleRes = await fetch(`${API_BASE}/api/v1/users/me/role`, {
      method: 'PATCH',
      headers: { 
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ role: 'CRAFTSMAN' })
    });
    const roleData = await roleRes.json();
    console.log('Role Update Response:', JSON.stringify(roleData, null, 2));

    // Get the updated token if any
    const updatedToken = roleData.data?.accessToken || token;

    // 3. Complete Craftsman Onboarding (POST /api/v1/onboarding/craftman)
    console.log('\nCompleting craftsman onboarding (POST /api/v1/onboarding/craftman)...');
    
    const form = new FormData();
    form.append('location', 'Semarang Tengah, Jawa Tengah');
    form.append('skills', 'Kain Perca, Plastik');
    form.append('craftType', 'Kain Perca'); // added craftType
    form.append('latitude', '-6.9806');
    form.append('longitude', '110.4208');

    const onboardingRes = await fetch(`${API_BASE}/api/v1/onboarding/craftman`, {
      method: 'POST',
      headers: { 
        'Authorization': `Bearer ${updatedToken}`
      },
      body: form
    });
    const onboardingData = await onboardingRes.json();
    console.log('Onboarding Response:', JSON.stringify(onboardingData, null, 2));

    // 4. Try calling GET /api/v1/users/me after onboarding
    console.log('\nFetching GET /api/v1/users/me after onboarding...');
    const finalToken = onboardingData.data?.accessToken || updatedToken;
    const finalMeRes = await fetch(`${API_BASE}/api/v1/users/me`, {
      headers: { 'Authorization': `Bearer ${finalToken}` }
    });
    const finalMeData = await finalMeRes.json();
    console.log('GET Me Post-Onboarding Response:', JSON.stringify(finalMeData, null, 2));

  } catch (err) {
    console.error(err);
  }
}

main();
