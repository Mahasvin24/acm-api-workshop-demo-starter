import express from 'express';

export const app = express();
// Let websites on other origins call your API, including JSON preflight requests.
app.use((req, res, next) => {
  res.set({ 'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, HEAD, POST, PATCH, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization' });
  if (req.method === 'OPTIONS') return res.sendStatus(204);
  next();
});
app.use(express.json({ limit: '8kb' }));

// Your database for today: an array. Restarting the server resets it.
const spots = [{ id: 1, name: 'Campus Point', tip: 'Go for the sunset.' }];
let nextId = 2;

app.get('/', (req, res) => res.json({ message: 'Hello from my API!', routes: '/spots' }));

// GET reads something. Try /spots in your browser!
app.get('/spots', (req, res) => res.json(spots));

// POST creates something. Send JSON in Postman: { "name": "...", "tip": "..." }
app.post('/spots', (req, res) => {
  const { name, tip } = req.body ?? {};
  if (typeof name !== 'string' || !name.trim() || name.length > 60 ||
      typeof tip !== 'string' || !tip.trim() || tip.length > 200) {
    return res.status(400).json({ error: 'Send a name (1–60 characters) and tip (1–200 characters).' });
  }
  const spot = { id: nextId++, name: name.trim(), tip: tip.trim() };
  spots.push(spot);
  res.status(201).json(spot);
});

// PATCH changes one field on something that already exists.
app.patch('/spots/:id', (req, res) => {
  const spot = spots.find(spot => spot.id === Number(req.params.id));
  if (!spot) return res.status(404).json({ error: 'Spot not found.' });
  const { tip } = req.body ?? {};
  if (typeof tip !== 'string' || !tip.trim() || tip.length > 200) {
    return res.status(400).json({ error: 'Send a tip with 1–200 characters.' });
  }
  spot.tip = tip.trim();
  res.json(spot);
});

// DELETE removes something. 204 means success with no response body.
app.delete('/spots/:id', (req, res) => {
  const index = spots.findIndex(spot => spot.id === Number(req.params.id));
  if (index === -1) return res.status(404).json({ error: 'Spot not found.' });
  spots.splice(index, 1);
  res.sendStatus(204);
});

app.use((error, req, res, next) => {
  res.status(error.status || 500).json({ error: error.status === 413 ? 'JSON is too large.' : 'Send valid JSON with Content-Type: application/json.' });
});

if (process.argv[1] === import.meta.filename) {
  const port = Number(process.env.PORT || 3001);
  app.listen(port, '0.0.0.0', () => console.log(`Your API: http://localhost:${port}/spots`));
}
