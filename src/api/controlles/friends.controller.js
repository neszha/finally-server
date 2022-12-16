import geolib from 'geolib';
import { UserModel } from '../../models/index.js';

export default {

    /**
     * Method: GET
     */
    async getFriendsByRadius(req, res) {
        const { _id } = req.user;
        const myLocation = req.user.locations;
        const radius = Number(req.query.radius) || 1;

        // Get friends.
        const friends = await UserModel.find({ isOnline: true, $not: { _id } }, {
            password: 0, createdAt: 0, updatedAt: 0, forTest: 0, isOnline: 0,
        }).lean();
        friends.forEach((friend) => {
            const { latitude, longitude } = friend.locations;
            const distance = geolib.getDistance(
                { latitude: myLocation.latitude, longitude: myLocation.longitude },
                { latitude, longitude },
            ); // M
            friend.locations = { latitude, longitude };
            friend.distance = distance / 1000 || 0; // KM
        });

        // Filter friends base on radius.
        const friends1 = friends.filter((item) => item.distance <= radius);

        // Sort friends base on distance.
        const friends2 = friends1.sort((a, b) => a.distance - b.distance);

        // Send respnse.
        return res.json({ radius, friends: friends2 });
    },

    /**
     * Method: POST
     */

    /**
     * Method: PUT
     */

    /**
     * Method: PATCH
     */

    /**
     * Method: DELETE
     */
};
