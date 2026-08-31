const fs = require('fs');

const API_BASE = 'https://sedalangbe-production.up.railway.app';

async function main() {
  try {
    console.log('Registering user...');
    const rand = Math.floor(Math.random() * 100000);
    const regRes = await fetch(`${API_BASE}/api/v1/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: `test_ai_${rand}@test.com`,
        password: 'Password123!',
        fullName: 'Test AI User'
      })
    });
    const regData = await regRes.json();
    const token = regData.data.accessToken;

    console.log('Skipping onboarding...');
    await fetch(`${API_BASE}/api/v1/onboarding/skip`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${token}` }
    });

    console.log('Reading image...');
    const buffer = fs.readFileSync('/home/axxxcen/Projects/anforcom_2026/assets_sedalang/assets_image_sedalang/ai_page_img.webp');
    const blob = new Blob([buffer], { type: 'image/webp' });

    const formData = new FormData();
    formData.append('image', blob, 'image.webp');

    console.log('Sending AI analysis request (this may take up to 2 mins)...');
    const start = Date.now();
    
    // Set a timeout of 3 minutes
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 180000);

    const res = await fetch(`${API_BASE}/api/v1/ai/analyze-ideas`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`
      },
      body: formData,
      signal: controller.signal
    });

    clearTimeout(timer);
    const end = Date.now();
    console.log(`Request completed in ${((end - start) / 1000).toFixed(2)} seconds. Status: ${res.status}`);
    const data = await res.json();
    console.log('Response body:', JSON.stringify(data, null, 2));

  } catch (err) {
    console.error('Error:', err);
  }
}

main();
