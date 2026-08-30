const API_BASE = 'https://sedalangbe-production.up.railway.app';

async function makeRequest(path, method, body, token) {
  const headers = {};
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  if (body) {
    headers['Content-Type'] = 'application/json';
  }
  const res = await fetch(`${API_BASE}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined
  });
  return res.json();
}

async function main() {
  try {
    console.log('--- Register Matching Craftsman Test ---');
    const rand = Math.floor(Math.random() * 100000);
    const email = `craftsman_match_${rand}@test.com`;
    const password = 'Password123!';

    // Register User
    const regRes = await makeRequest('/api/v1/auth/register', 'POST', {
      email,
      password,
      fullName: `Match Craftsman ${rand}`,
      phoneNumber: '081234567890'
    });
    const tempToken = regRes.data.accessToken;

    // Set role
    const roleRes = await makeRequest('/api/v1/users/me/role', 'PATCH', {
      role: 'CRAFTSMAN'
    }, tempToken);
    const token = roleRes.data.accessToken;

    // Complete Onboarding with matching skills
    // In our direct AI response, the skills are: "Memotong presisi", "Melipat rapi", "Pengeleman"
    const formData = new FormData();
    formData.append('location', 'Semarang Tengah, Jawa Tengah');
    formData.append('skills', 'Memotong presisi, Melipat rapi, Pengeleman, Kerajinan Karton');
    formData.append('craftType', 'Kerajinan Karton');

    const onboardRes = await fetch(`${API_BASE}/api/v1/onboarding/craftman`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${token}` },
      body: formData
    });
    const onboardData = await onboardRes.json();
    console.log('Craftsman onboarding data:', onboardData);

    // Now call match
    const ideaId = '78dc1a77-b61c-408a-8452-df8e4f2cd574';
    const matchRes = await makeRequest(`/api/v1/craftsmen/match/${ideaId}`, 'GET', null, token);
    console.log('Matched Craftsmen Response:', JSON.stringify(matchRes, null, 2));

  } catch (err) {
    console.error(err);
  }
}

main();
