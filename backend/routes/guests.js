// routes/guests.js (ESM)
import express from 'express';
import Guest from '../models/Guest.js';
import { authenticateToken } from '../middleware/authMiddleware.js';

const router = express.Router();

/**
 * Normaliza el payload permitiendo solo campos conocidos.
 * Hace trims y castea números/booleanos si procede.
 */
function toGuestPayload(body = {}) {
  const clean = {};

  if (typeof body.name === 'string') clean.name = body.name.trim();
  if (typeof body.message === 'string') clean.message = body.message.trim();
  if (typeof body.email === 'string') clean.email = body.email.trim();
  if (typeof body.companionsNames === 'string') clean.companionsNames = body.companionsNames.trim();
  if (typeof body.dietaryNote === 'string') clean.dietaryNote = body.dietaryNote.trim();

  if (typeof body.attending === 'boolean') clean.attending = body.attending;
  if (typeof body.dietaryRestrictions === 'boolean') clean.dietaryRestrictions = body.dietaryRestrictions;

  if (body.companions !== undefined) {
    const n = Number(body.companions);
    if (!Number.isNaN(n) && n >= 0) clean.companions = n;
  }

  if (typeof body.busOption === 'string' && ['', 'oneway', 'roundtrip'].includes(body.busOption)) {
    clean.busOption = body.busOption;
  }

  return clean;
}

/** ======= Rutas ======= */

/** GET /api/guests  (PROTEGIDA)
 *  Query opcionales:
 *   - attending=si|no|todos
 *   - q=texto (busca en name, email, companionsNames, message, dietaryNote)
 *   - bus=none|oneway|roundtrip|todos
 */
router.get('/', authenticateToken, async (req, res) => {
  try {
    const { attending = 'todos', q = '', bus = 'todos' } = req.query;

    const filter = {};
    if (attending === 'si') filter.attending = true;
    else if (attending === 'no') filter.attending = false;

    if (bus === 'none') filter.busOption = '';
    else if (bus === 'oneway') filter.busOption = 'oneway';
    else if (bus === 'roundtrip') filter.busOption = 'roundtrip';

    if (q && typeof q === 'string') {
      const rx = new RegExp(q.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i');
      filter.$or = [
        { name: rx },
        { email: rx },
        { companionsNames: rx },
        { message: rx },
        { dietaryNote: rx },
      ];
    }

    const guests = await Guest.find(filter).sort({ createdAt: -1 });
    res.json(guests);
  } catch (err) {
    res.status(500).json({ error: err.message || 'Server error' });
  }
});

/** POST /api/guests  (PÚBLICA) */
router.post('/', async (req, res) => {
  try {
    const payload = toGuestPayload(req.body);

    if (typeof payload.name !== 'string' || typeof payload.attending !== 'boolean') {
      return res.status(400).json({ error: 'name y attending son obligatorios' });
    }

    const created = await Guest.create(payload);
    res.status(201).json(created);
  } catch (err) {
    res.status(400).json({ error: err.message || 'Bad request' });
  }
});

/** PUT /api/guests/:id  (PROTEGIDA) */
router.put('/:id', authenticateToken, async (req, res) => {
  try {
    const payload = toGuestPayload(req.body);
    const updated = await Guest.findByIdAndUpdate(req.params.id, payload, {
      new: true,
      runValidators: true,
    });
    if (!updated) return res.status(404).json({ error: 'Guest not found' });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: err.message || 'Bad request' });
  }
});

/** DELETE /api/guests/:id  (PROTEGIDA) */
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const deleted = await Guest.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: 'Guest not found' });
    res.json({ ok: true });
  } catch (err) {
    res.status(400).json({ error: err.message || 'Bad request' });
  }
});

export default router;
