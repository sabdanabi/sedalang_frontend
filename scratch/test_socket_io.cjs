const fs = require('fs');
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
    console.log('--- WebSocket Multi-Client Test ---');
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

    // Get craftsman ID
    const meRes = await makeRequest('/api/v1/users/me', 'GET', null, finalCraftToken);
    const craftsmanId = meRes.data.craftsman.id;
    console.log('Craftsman ID:', craftsmanId);

    // Use pre-existing idea ID from successful run to bypass Gemini rate limit
    const ideaId = '78dc1a77-b61c-408a-8452-df8e4f2cd574';
    console.log('Idea ID:', ideaId);

    console.log('4. Creating Chat Room...');
    const chatRoomRes = await makeRequest('/api/v1/chat/rooms', 'POST', {
      craftsmanId,
      ideaId
    }, finalUserToken);
    const roomId = chatRoomRes.data.id;
    console.log('Room ID:', roomId);

    console.log('5. Connecting User and Craftsman Sockets...');
    const userSocket = io(API_BASE, { auth: { token: finalUserToken }, transports: ['websocket'] });
    const craftSocket = io(API_BASE, { auth: { token: finalCraftToken }, transports: ['websocket'] });

    // Helper to log all events
    const setupSocketLogger = (name, socket) => {
      socket.on('connect', () => {
        console.log(`[${name}] Connected! ID:`, socket.id);
        socket.emit('joinRoom', roomId);
      });

      socket.onAny((event, ...args) => {
        console.log(`[${name}] Received event "${event}":`, JSON.stringify(args));
      });

      socket.on('connect_error', (err) => {
        console.error(`[${name}] Connection error:`, err);
      });
    };

    setupSocketLogger('User', userSocket);
    setupSocketLogger('Craftsman', craftSocket);

    let proposalId = null;

    // After 2.5 seconds, send a message from User
    setTimeout(() => {
      console.log('User sending message...');
      userSocket.emit('sendMessage', {
        roomId,
        content: 'Halo pengrajin! Ini pesan percobaan dari User.'
      });
    }, 2500);

    // After 4.5 seconds, craftsman creates a Proposal
    setTimeout(async () => {
      console.log('Craftsman creating proposal via HTTP POST...');
      try {
        const propRes = await makeRequest(`/api/v1/chat/rooms/${roomId}/proposals`, 'POST', {
          productName: 'Meja Lampu Kayu Palet',
          price: 120000,
          materialsNeeded: ['Kayu Palet Bekas', 'Lem Kayu'],
          deliveryMethod: 'GOSEND',
          estimatedCompletionDate: '2026-09-10',
          paymentMethod: 'BCA 12345 a.n. Arif'
        }, finalCraftToken);
        proposalId = propRes.data.id;
        console.log('Proposal created. ID:', proposalId);
      } catch (propErr) {
        console.error('Failed to create proposal:', propErr);
      }
    }, 4500);

    // After 6.5 seconds, user accepts the proposal
    setTimeout(async () => {
      if (!proposalId) return;
      console.log('User accepting proposal via HTTP PATCH...');
      try {
        const acceptRes = await makeRequest(`/api/v1/chat/proposals/${proposalId}/accept`, 'PATCH', {}, finalUserToken);
        console.log('Proposal accepted on backend:', acceptRes);
      } catch (acceptErr) {
        console.error('Failed to accept proposal:', acceptErr);
      }
    }, 6500);

    // Close after 10 seconds
    setTimeout(() => {
      console.log('Closing sockets...');
      userSocket.disconnect();
      craftSocket.disconnect();
      console.log('Done.');
    }, 10000);

  } catch (err) {
    console.error('Test failed:', err);
  }
}

main();
