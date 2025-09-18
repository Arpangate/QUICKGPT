import Chat from "../models/Chat.js";


// API Controller to create a new chat
export const createChat = async (req, res) => {
    try {
        const userId = req.user._id; // req.user is set in the protect middleware

        const chatData = {
            userId,
            message: [],
            name: "New Chat",
            userName: req.user.name
        }
        await Chat.create(chatData);
        res.status(201).json({ success: true, message: "Chat created successfully" });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}

// API Controller for getting all chats
export const getChats = async (req, res) => {
    try {
        const userId = req.user._id; // req.user is set in the protect middleware
        const chats = await Chat.find({ userId }).sort({ updatedAt: -1 });
        res.status(200).json({ success: true, chats });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}

// API Controller to delete a chat
export const deleteChat = async (req, res) => {
    try {
        const userId = req.user._id; // req.user is set in the protect middleware
        const {chatId} = req.body;
        await Chat.deleteOne({ _id: chatId, userId });
        
        res.status(200).json({ success: true, message: "Chat deleted successfully" });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}



