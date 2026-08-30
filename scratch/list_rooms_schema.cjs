const API_BASE = 'https://sedalangbe-production.up.railway.app';

async function makeRequest(path, token) {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  return res.json();
}

async function main() {
  try {
    console.log('--- Listing Rooms Schema Test ---');
    
    // Let's register a user and a craftsman, skip onboarding, create a room, then list rooms.
    const rand = Math.floor(Math.random() * 100000);
    const userEmail = `user_list_${rand}@test.com`;
    const craftsmanEmail = `craftsman_list_${rand}@test.com`;
    
    // Register User
    const regUserRes = await fetch(`${API_BASE}/api/v1/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: userEmail, password: 'Password123!', fullName: 'Fikri List Room Test' })
    });
    const userRegData = await regUserRes.json();
    const userToken = userRegData.data.accessToken;
    
    // Skip user onboarding
    await fetch(`${API_BASE}/api/v1/onboarding/skip`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${userToken}` }
    });

    // Register Craftsman
    const regCraftRes = await fetch(`${API_BASE}/api/v1/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: craftsmanEmail, password: 'Password123!', fullName: 'Arif Craftsman Test' })
    });
    const craftRegData = await regCraftRes.json();
    const craftTempToken = craftRegData.data.accessToken;

    // Set role to CRAFTSMAN
    const roleRes = await fetch(`${API_BASE}/api/v1/users/me/role`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${craftTempToken}` },
      body: JSON.stringify({ role: 'CRAFTSMAN' })
    });
    const roleData = await roleRes.json();
    const craftToken = roleData.data.accessToken;

    // Complete Onboard
    const formData = new FormData();
    formData.append('location', 'Semarang Tengah');
    formData.append('skills', 'Kayu Palet');
    formData.append('craftType', 'Kerajinan');
    const onboardRes = await fetch(`${API_BASE}/api/v1/onboarding/craftman`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${craftToken}` },
      body: formData
    });
    const onboardData = await onboardRes.json();
    const finalCraftToken = onboardData.data.accessToken;

    // Get craftsman ID
    const meRes = await makeRequest('/api/v1/users/me', finalCraftToken);
    const craftsmanId = meRes.data.craftsman.id;

    // Create room using pre-existing ideaId
    const roomRes = await fetch(`${API_BASE}/api/v1/chat/rooms`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${userToken}` },
      body: JSON.stringify({ craftsmanId, ideaId: '78dc1a77-b61c-408a-8452-df8e4f2cd574' })
    });
    const roomData = await roomRes.json();
    console.log('Created room:', roomData);

    // List rooms for user
    const userRooms = await makeRequest('/api/v1/chat/rooms', userToken);
    console.log('User Rooms response:', JSON.stringify(userRooms, null, 2));

    // List rooms for craftsman
    const craftRooms = await makeRequest('/api/v1/chat/rooms', finalCraftToken);
    console.log('Craftsman Rooms response:', JSON.stringify(craftRooms, null, 2));

  } catch (e) {
    console.error(e);
  }
}

main();
