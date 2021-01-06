import { server } from './server';
import './utils/config';
import db from './utils/database';

const main = async () => {
  // listen for termination
  process.on('SIGTERM', () => process.exit());
  await db.open();

  const port = process.env.PORT || 5000;
  server.listen(port, () => {
    console.log(`🚀 Listening on port ${port}`);
    console.log('  Press Ctrl+C to stop\n');
  });
};

main();
