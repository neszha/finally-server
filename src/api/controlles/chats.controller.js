import randomstring from 'randomstring';
import { UserModel, ChatModel } from '../../models/index.js';
import { responseHelper, validatorHelper } from '../../helpers/index.js';

const { isObjectId } = validatorHelper;
const { badRequest, notFound } = responseHelper.api;

export default {

    /**
     * Method: GET
     */

    /**
     * Method: POST
     */
    async requestToChat(req, res) {
        const { user } = req;
        const { userId } = req.params;
        const { message } = req.body;

        // Validate id and body.
        if (!isObjectId(userId)) return badRequest(res);
        if (!message) return badRequest(res);

        // Get friend.
        const friend = await UserModel.findOne({ _id: userId }, { name: 1, gender: 1 }).lean();
        if (!friend) return notFound(res);

        // Create chat session.
        const chatToken = randomstring.generate(52);
        const chat = new ChatModel({
            token: chatToken,
            myId: user._id,
            friendId: friend._id,
            message,
        });
        await chat.save();

        // Send request data to friend via socket.

        // Send response.
        return res.json({ data: chat });
    },

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
