import { test } from 'node:test';
import assert from 'node:assert/strict';
import { once } from 'node:events';
import { app } from '../server.js';

test('a student can read, create, edit, and delete a campus recommendation', async () => {
  const server = app.listen(0, '127.0.0.1'); await once(server, 'listening');
  const base = `http://127.0.0.1:${server.address().port}/spots`;
  const change = (url, method, body) => fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: body && JSON.stringify(body) });
  try {
    assert.equal((await (await fetch(base)).json())[0].name, 'Campus Point');
    assert.equal((await change(base, 'POST', {})).status, 400);
    const created = await change(base, 'POST', { name: 'The lagoon', tip: 'Bring binoculars.' });
    assert.equal(created.status, 201);
    const { id } = await created.json();
    assert.equal((await change(`${base}/${id}`, 'PATCH', { tip: 'Look for herons.' })).status, 200);
    assert.equal((await change(`${base}/${id}`, 'PATCH', {})).status, 400);
    assert.equal((await change(`${base}/${id}`, 'DELETE')).status, 204);
    assert.equal((await change(`${base}/${id}`, 'DELETE')).status, 404);
  } finally { await new Promise(resolve => server.close(resolve)); }
});
