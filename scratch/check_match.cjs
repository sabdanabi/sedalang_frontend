const API_BASE = 'https://sedalangbe-production.up.railway.app';

async function makeRequest(path, token) {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  return res.json();
}

async function main() {
  try {
    console.log('--- Matching Test ---');
    // Let's use the pre-existing test user from our database or register a new one to test matching!
    const rand = Math.floor(Math.random() * 100000);
    const userEmail = `user_match_${rand}@test.com`;
    const password = 'Password123!';

    const regUser = await fetch(`${API_BASE}/api/v1/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: userEmail, password, fullName: 'Match Test User' })
    });
    const regData = await regUser.json();
    const token = regData.data.accessToken;
    
    // Skip onboard
    await fetch(`${API_BASE}/api/v1/onboarding/skip`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${token}` }
    });

    // Let's use the pre-existing ideaId that we know is in the database:
    const ideaId = '78dc1a77-b61c-408a-8452-df8e4f2cd574';
    console.log('Using Idea ID:', ideaId);

    const matchRes = await makeRequest(`/api/v1/craftsmen/match/${ideaId}`, token);
    console.log('Matched Craftsmen Response:', JSON.stringify(matchRes, null, 2));

  } catch (err) {
    console.error(err);
  }
}

main();
