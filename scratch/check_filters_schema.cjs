const API_BASE = 'https://sedalangbe-production.up.railway.app';

async function main() {
  try {
    console.log('--- Listing Craftsman Filters Schema ---');
    const res = await fetch(`${API_BASE}/api/v1/craftsmen/filters`);
    const data = await res.json();
    console.log('Filters Response:', JSON.stringify(data, null, 2));

    console.log('--- Listing Craftsman List Schema ---');
    const resList = await fetch(`${API_BASE}/api/v1/craftsmen?page=1&limit=2`);
    const dataList = await resList.json();
    console.log('Craftsmen List Response:', JSON.stringify(dataList, null, 2));
  } catch (err) {
    console.error(err);
  }
}

main();
