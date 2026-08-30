const API_BASE = 'https://sedalangbe-production.up.railway.app';

async function main() {
  try {
    // Use craftsman account that had an order
    const loginRes = await fetch(`${API_BASE}/api/v1/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'craftsman_match_97682@test.com', password: 'Password123!' })
    });
    const loginData = await loginRes.json();
    const token = loginData.data?.accessToken;
    
    console.log('Login token:', token ? 'OK' : 'FAIL');

    const r = await fetch(`${API_BASE}/api/v1/orders`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    const data = await r.json();
    console.log('Orders Response:', JSON.stringify(data, null, 2));

    if (data.data && data.data.length > 0) {
      const orderId = data.data[0].id;
      console.log('\nFetching detail for orderId:', orderId);
      const d = await fetch(`${API_BASE}/api/v1/orders/${orderId}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const detail = await d.json();
      console.log('Order Detail:', JSON.stringify(detail, null, 2));
    }
  } catch (err) {
    console.error(err);
  }
}

main();
