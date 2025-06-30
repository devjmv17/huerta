const { Pool } = require('pg');

const pool = new Pool({
  connectionString: 'postgres://neondb_owner:npg_HGoawThvDx40@ep-morning-shape-a2n39w6l-pooler.eu-central-1.aws.neon.tech/neondb?sslmode=require',
});

module.exports = pool;
