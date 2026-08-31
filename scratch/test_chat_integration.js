const { io } = require('socket.io-client');

const API_BASE = 'https://sedalangbe-production.up.railway.app';

// Helper to make request
async function makeRequest(path, method, body, token) {
  const headers = {};
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  
  let fetchBody = body;
  if (!(body instanceof FormData)) {
    headers['Content-Type'] = 'application/json';
    if (body) {
      fetchBody = JSON.stringify(body);
    }
  }

  const res = await fetch(`${API_BASE}${path}`, {
    method,
    headers,
    body: fetchBody
  });
  
  const data = await res.json();
  if (!res.ok) {
    console.error(`HTTP Error ${res.status}:`, data);
    throw new Error(data.message || 'Request failed');
  }
  return data;
}

async function main() {
  try {
    console.log('--- Chat Integration Test (Random UUID) ---');
    const rand = Math.floor(Math.random() * 100000);
    const userEmail = `user_${rand}@test.com`;
    const craftsmanEmail = `craftsman_${rand}@test.com`;
    const password = 'Password123!';

    console.log('1. Registering test user...');
    const userReg = await makeRequest('/api/v1/auth/register', 'POST', {
      email: userEmail,
      password,
      fullName: `Test User ${rand}`,
      phoneNumber: '081234567890'
    });
    const userToken = userReg.data.accessToken;
    console.log('User registered. Token:', userToken.slice(0, 15) + '...');

    console.log('Completing user onboarding (skip)...');
    const userOnboard = await makeRequest('/api/v1/onboarding/skip', 'POST', {}, userToken);
    const finalUserToken = userOnboard.data.accessToken;

    console.log('2. Registering test craftsman...');
    const craftReg = await makeRequest('/api/v1/auth/register', 'POST', {
      email: craftsmanEmail,
      password,
      fullName: `Test Craftsman ${rand}`,
      phoneNumber: '089876543210'
    });
    const craftTempToken = craftReg.data.accessToken;

    console.log('Updating craftsman role...');
    const roleUp = await makeRequest('/api/v1/users/me/role', 'PATCH', {
      role: 'CRAFTSMAN'
    }, craftTempToken);
    const craftToken = roleUp.data.accessToken;

    console.log('Completing craftsman onboarding...');
    const formData = new FormData();
    formData.append('location', 'Semarang Tengah, Jawa Tengah');
    formData.append('skills', 'Kayu Palet, Paku, Cat Kayu');
    formData.append('craftType', 'Kerajinan Kayu');
    
    const craftOnboard = await makeRequest('/api/v1/onboarding/craftman', 'POST', formData, craftToken);
    const finalCraftToken = craftOnboard.data.accessToken;
    console.log('Craftsman onboarding completed. Token:', finalCraftToken.slice(0, 15) + '...');

    // Let's get craftsman profile of current user to see ID
    const meRes = await makeRequest('/api/v1/users/me', 'GET', null, finalCraftToken);
    const craftsmanId = meRes.data.craftsman?.id;
    console.log('Craftsman ID:', craftsmanId);

    console.log('3. Creating/Getting Chat Room with random idea UUID...');
    const randomIdeaId = '11111111-1111-1111-1111-111111111111';
    
    const chatRoomRes = await makeRequest('/api/v1/chat/rooms', 'POST', {
      craftsmanId,
      ideaId: randomIdeaId
    }, finalUserToken);
    console.log('Chat room response:', chatRoomRes);
    const roomId = chatRoomRes.data.id;
    console.log('Room ID:', roomId);

    console.log('4. Listing all rooms for user...');
    const roomsList = await makeRequest('/api/v1/chat/rooms', 'GET', null, finalUserToken);
    console.log('Rooms list:', JSON.stringify(roomsList.data, null, 2));

  } catch (err) {
    console.error('Test failed:', err);
  }
}

main();
