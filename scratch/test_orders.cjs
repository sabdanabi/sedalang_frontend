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
    console.log('--- Orders Schema Test ---');
    const rand = Math.floor(Math.random() * 100000);
    const userEmail = `user_ord_${rand}@test.com`;
    const craftsmanEmail = `craftsman_ord_${rand}@test.com`;
    
    // User
    const regUser = await makeRequest('/api/v1/auth/register', 'POST', { email: userEmail, password: 'Password123!', fullName: 'Fikri' });
    const userToken = regUser.data.accessToken;
    await makeRequest('/api/v1/onboarding/skip', 'POST', {}, userToken);

    // Craftsman
    const regCraft = await makeRequest('/api/v1/auth/register', 'POST', { email: craftsmanEmail, password: 'Password123!', fullName: 'Arif' });
    const craftTempToken = regCraft.data.accessToken;
    const roleRes = await makeRequest('/api/v1/users/me/role', 'PATCH', { role: 'CRAFTSMAN' }, craftTempToken);
    const craftToken = roleRes.data.accessToken;

    const formData = new FormData();
    formData.append('location', 'Semarang');
    formData.append('skills', 'Kayu');
    formData.append('craftType', 'Kerajinan');
    const onboardRes = await fetch(`${API_BASE}/api/v1/onboarding/craftman`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${craftToken}` },
      body: formData
    });
    const onboardData = await onboardRes.json();
    const finalCraftToken = onboardData.data.accessToken;

    // Get craftsman ID
    const meRes = await makeRequest('/api/v1/users/me', 'GET', null, finalCraftToken);
    const craftsmanId = meRes.data.craftsman.id;

    // Create Room
    const roomRes = await makeRequest('/api/v1/chat/rooms', 'POST', { craftsmanId, ideaId: '78dc1a77-b61c-408a-8452-df8e4f2cd574' }, userToken);
    const roomId = roomRes.data.id;

    // Create Proposal
    const propRes = await makeRequest(`/api/v1/chat/rooms/${roomId}/proposals`, 'POST', {
      productName: 'Meja Lampu Kayu Palet',
      price: 120000,
      materialsNeeded: ['Kayu Palet Bekas', 'Lem Kayu'],
      deliveryMethod: 'GOSEND',
      estimatedCompletionDate: '2026-09-10',
      paymentMethod: 'BCA 12345 a.n. Arif'
    }, finalCraftToken);
    const proposalId = propRes.data.id;
    console.log('Created Proposal ID:', proposalId);

    console.log('Accepting proposal via PATCH...');
    const acceptRes = await makeRequest(`/api/v1/chat/proposals/${proposalId}/accept`, 'PATCH', {}, userToken);
    console.log('Accept Response:', acceptRes);

    console.log('Listing orders for user...');
    const ordersRes = await makeRequest('/api/v1/orders', 'GET', null, userToken);
    console.log('Orders List:', JSON.stringify(ordersRes.data, null, 2));

  } catch (e) {
    console.error(e);
  }
}

main();
