import process from 'process';
import '../src/database/mongo.db.js';
import events from '../src/events.js';
import { UserModel } from '../src/models/index.js';

// Req to connect database.
events.emit('server-ready', { quiet: true });

// Waiting mongodb connections.
events.on('mongodb-connected', async () => {
    // Users.
    const users = [
        {
            name: 'User 1: Mall Boemie Kedaton',
            username: 'user1',
            password: '12345678',
            locations: {
                latitude: -5.38202570447883,
                longitude: 105.25947530715526,
            },
        },
        {
            name: 'User 2: Asrama ITERA',
            username: 'user2',
            password: '12345678',
            locations: {
                latitude: -5.3586324767884355,
                longitude: 105.31850578714932,
            },
        },
        {
            name: 'User 3: Metro Pusat',
            username: 'user3',
            password: '12345678',
            locations: {
                latitude: -5.114561267468575,
                longitude: 105.30837618295827,
            },
        },
        {
            name: 'User 4: Monas Jakarta',
            username: 'user4',
            password: '12345678',
            locations: {
                latitude: -6.175193808233774,
                longitude: 106.82709920251591,
            },
        },
        {
            name: 'User 5: Teknokrat',
            username: 'user5',
            password: '12345678',
            locations: {
                latitude: -5.382333600921098,
                longitude: 105.25781651558216,
            },
        },
        {
            name: 'User 6: UBL',
            username: 'user6',
            password: '12345678',
            locations: {
                latitude: -5.378954712244085,
                longitude: 105.25196341234358,
            },
        },
        {
            name: 'User 7: GSG UNILA',
            username: 'user7',
            password: '12345678',
            locations: {
                latitude: -5.361986432669314,
                longitude: 105.23978330116026,
            },
        },
        {
            name: 'User 8: Pulau Samosir',
            username: 'user8',
            password: '12345678',
            locations: {
                latitude: 2.5835768642363326,
                longitude: 98.8031533990969,
            },
        },
        {
            name: 'User 9: Sinagpura',
            username: 'user9',
            password: '12345678',
            locations: {
                latitude: 1.3418451501157673,
                longitude: 103.8348914589231,
            },
        },
        {
            name: 'User 10: Palembang',
            username: 'user10',
            password: '12345678',
            locations: {
                latitude: -2.977561232927113,
                longitude: 104.7740954407629,
            },
        },
    ];

    // Save test users.
    const promises = [];
    users.forEach((userData) => {
        const user = new UserModel(userData);
        user.isOnline = true;
        user.forTest = true;
        promises.push(user.save());
    });
    await Promise.all(promises);

    // Done.
    console.log('Data user test berhasil dibuat!');
    process.exit();
});

// Timeout.
setTimeout(() => process.exit(), 60 * 1000);
