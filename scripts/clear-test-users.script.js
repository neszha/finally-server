import process from 'process';
import '../src/database/mongo.db.js';
import events from '../src/events.js';
import { UserModel } from '../src/models/index.js';

// Req to connect database.
events.emit('server-ready', { quiet: true });

// Waiting mongodb connections.
events.on('mongodb-connected', async () => {
    // Save test users.
    await UserModel.deleteMany({ forTest: true }).exec();

    // Done.
    console.log('User test berhasil dihapus!');
    process.exit();
});

// Timeout.
setTimeout(() => process.exit(), 60 * 1000);
