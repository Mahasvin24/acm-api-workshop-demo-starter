import { test } from 'node:test';
import assert from 'node:assert/strict';
import { client } from '../testing/request.js';
const fetch = client(app);
import { app } from '../server.js';

test('a student can read, create, edit, and delete a campus recommendation', async () => {
  const base = 'http://test/spots';
  const change = (url, method, body) => fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: body && JSON.stringify(body) });
  {
    assert.equal((await (await fetch(base)).json())[0].name, 'Campus Point');
    assert.equal((await change(base, 'POST', {})).status, 400);
    const created = await change(base, 'POST', { name: 'The lagoon', tip: 'Bring binoculars.' });
    assert.equal(created.status, 201);
    const { id } = await created.json();
    assert.equal((await change(`${base}/${id}`, 'PATCH', { tip: 'Look for herons.' })).status, 200);
    assert.equal((await change(`${base}/${id}`, 'PATCH', {})).status, 400);
    assert.equal((await change(`${base}/${id}`, 'DELETE')).status, 204);
    assert.equal((await change(`${base}/${id}`, 'DELETE')).status, 404);
  }
});

test('cross-origin JSON preflights and normal responses allow other origins', async () => {
  const response = await fetch('/spots', { method: 'OPTIONS', headers: { Origin: 'http://localhost:5173', 'Access-Control-Request-Method': 'POST', 'Access-Control-Request-Headers': 'content-type' } });
  assert.equal(response.status, 204);
  assert.equal(response.headers.get('access-control-allow-origin'), '*');
  assert.match(response.headers.get('access-control-allow-methods'), /POST/);
  assert.match(response.headers.get('access-control-allow-headers'), /Content-Type/);
  assert.equal((await fetch('/spots')).headers.get('access-control-allow-origin'), '*');
});
