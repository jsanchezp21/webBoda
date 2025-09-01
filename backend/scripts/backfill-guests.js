// backend/scripts/backfill-guests.js (ESM)
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Guest from '../models/Guest.js';

dotenv.config();

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/weddingDB';

async function run() {
  await mongoose.connect(MONGO_URI);
  console.log('Mongo conectado para backfill');

  const cursor = Guest.find().cursor();
  let total = 0;
  let modified = 0;

  for (let doc = await cursor.next(); doc != null; doc = await cursor.next()) {
    total++;
    let changed = false;

    // Normalizamos campos vacíos
    if (doc.email == null)            { doc.email = ''; changed = true; }
    if (doc.companions == null)       { doc.companions = 0; changed = true; }
    if (doc.companionsNames == null)  { doc.companionsNames = ''; changed = true; }
    if (doc.dietaryRestrictions == null) { doc.dietaryRestrictions = false; changed = true; }
    if (doc.dietaryNote == null)      { doc.dietaryNote = ''; changed = true; }
    if (doc.busOption == null)        { doc.busOption = ''; changed = true; }
    if (doc.message == null)          { doc.message = ''; changed = true; }
    // name y attending deberían existir por validación; si no, los ponemos suaves
    if (doc.name == null)             { doc.name = ''; changed = true; }
    if (typeof doc.attending !== 'boolean') { doc.attending = false; changed = true; }

    if (changed) {
      await doc.save();
      modified++;
    }
  }

  console.log(`Revisados: ${total} | Modificados: ${modified}`);
  await mongoose.connection.close();
  console.log('Backfill completo. Conexión cerrada.');
}

run().catch(err => {
  console.error(err);
  process.exit(1);
});
