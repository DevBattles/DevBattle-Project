// ===========================================
// Swagger JSON Generator (standalone script)
// ===========================================

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Need to import dynamically after env is loaded
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const generate = async () => {
  const { default: swaggerSpec } = await import('./swagger.config.js');

  const outputPath = path.join(__dirname, '..', '..', 'swagger.json');
  fs.writeFileSync(outputPath, JSON.stringify(swaggerSpec, null, 2));

  // eslint-disable-next-line no-console
  console.log(`Swagger spec written to ${outputPath}`);
};

generate().catch((err) => {
  // eslint-disable-next-line no-console
  console.error('Failed to generate swagger spec:', err);
  process.exit(1);
});
