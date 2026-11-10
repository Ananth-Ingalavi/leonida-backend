import Fastify from 'fastify';
import cors from '@fastify/cors';
import { createClient } from '@supabase/supabase-js';

const fastify = Fastify({ logger: true, bodyLimit: 52428800 });

// Your exact Supabase caisson coordinates
const supabaseUrl = 'https://rpxthbzcznfctfavzdlu.supabase.co';
const supabaseKey = 'sb_publishable_hAuz2DZ4PCjqmxbIV0wCVQ_KEM6y9a5';
const supabase = createClient(supabaseUrl, supabaseKey);

fastify.register(cors, { origin: '*' });

// Fetch pins from the permanent database
fastify.get('/api/markers', async (request, reply) => {
  const { data, error } = await supabase.from('markers').select('*');
  if (error) {
    fastify.log.error(error);
    return reply.status(500).send({ error: 'Database fetch failed' });
  }
  return data;
});

// Save new pins and Base64 images to the database
fastify.post('/api/markers', async (request, reply) => {
  const { x, y, category, label, weaponProof } = request.body;

  const { data, error } = await supabase.from('markers').insert([{
    x, y,
    category,
    label,
    weapon_proof: weaponProof
  }]).select();

  if (error) {
    fastify.log.error(error);
    return reply.status(500).send({ error: 'Database insert failed' });
  }
  return data[0];
});

const start = async () => {
  try {
    await fastify.listen({ port: 3001, host: '0.0.0.0' });
    console.log('Backend neural network locked and listening');
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();