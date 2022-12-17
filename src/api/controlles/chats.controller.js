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

    async acceptChatRequest(req, res) {
        const { user } = req;
        const { accept, chatId } = req.body;

        // Validate id.
        if (!isObjectId(chatId)) return badRequest(res);

        // Get chat data.
        const chat = await ChatModel.findOne({ _id: chatId }, { contents: 0 }).lean();
        if (!chat) return notFound(res);

        // Handdle accept status request.
        const userIds = [user._id, chat.friendId];
        if (accept) {
            // Update apporved status.
            await ChatModel.updateOne({ _id: chatId }, { approved: true }).exec();

            // Connect chatId to each users.
            await UserModel.updateMany({ _id: { $in: userIds } }, { chatId: chat._id }).exec();

            // Send accept info via socket.
            //
        } else {
            // End the chat session. (remove chat record)
            await ChatModel.deleteOne({ _id: chatId }).exec();

            // Disconnect chatid in each users.
            await UserModel.updateMany({ _id: { $in: userIds } }, { chatId: null }).exec();

            // Send denial info via socket.
            //
        }

        // Send response.
        return res.json({ data: { accept } });
    },

    async endChat(req, res) {
        const { user } = req;
        const { userId, chatId } = req.params;

        // Validate id.
        if (!isObjectId([userId, chatId])) return badRequest(res);

        // Get chat data.
        const userIds = [userId, user._id];
        const chat = await ChatModel.findOne({
            _id: chatId,
            $or: [
                { myId: { $in: userIds } },
                { friendId: { $in: userIds } },
            ],
        }, { contents: 0 }).lean();
        if (!chat) return notFound(res);

        // Disconnect chatId in each users.
        await UserModel.updateMany({ _id: { $in: userIds } }, { chatId: null }).exec();

        // Delete chat records.
        await ChatModel.deleteOne({ _id: chatId }).exec();

        // Send info via socker.
        //

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
