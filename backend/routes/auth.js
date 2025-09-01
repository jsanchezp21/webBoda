import express from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

const router = express.Router();

// Usuario fijo (en producción iría en DB o variable de entorno)
const ADMIN_USER = 'admin';
const ADMIN_PASS = await bcrypt.hash('1234', 10); // Generado al arrancar

// Ruta de login
router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  if (username !== ADMIN_USER) {
    return res.status(401).json({ error: 'Credenciales inválidas' });
  }

  const match = await bcrypt.compare(password, ADMIN_PASS);
  if (!match) {
    return res.status(401).json({ error: 'Credenciales inválidas' });
  }

  const token = jwt.sign({ user: ADMIN_USER }, process.env.JWT_SECRET, {
    expiresIn: '1h'
  });

  res.json({ token });
});

export default router;
