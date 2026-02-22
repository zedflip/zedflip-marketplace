import { Response } from 'express';
import Chat from '../models/Chat';
import Listing from '../models/Listing';
import Notification from '../models/Notification';
import { AuthRequest } from '../middleware/auth.middleware';
import { emitToUser } from '../config/socket';

// @desc    Get user's chats
// @route   GET /api/chats
// @access  Private
export const getChats = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const chats = await Chat.find({
      participants: req.user!._id,
      isActive: true,
    })
      .sort({ lastMessageAt: -1 })
      .populate('participants', 'name avatar')
      .populate('listing', 'title images price status');

    res.status(200).json({
      success: true,
      data: chats,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to get chats',
    });
  }
};

// @desc    Get single chat
// @route   GET /api/chats/:id
// @access  Private
export const getChat = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const chat = await Chat.findOne({
      _id: req.params.id,
      participants: req.user!._id,
    })
      .populate('participants', 'name avatar phone')
      .populate('listing', 'title images price status seller');

    if (!chat) {
      res.status(404).json({
        success: false,
        message: 'Chat not found',
      });
      return;
    }

    // Mark messages as read
    chat.messages.forEach((msg) => {
      if (msg.sender.toString() !== req.user!._id.toString()) {
        msg.isRead = true;
      }
    });
    await chat.save();

    res.status(200).json({
      success: true,
      data: chat,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to get chat',
    });
  }
};

// @desc    Start or get existing chat
// @route   POST /api/chats
// @access  Private
export const startChat = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const { listingId, message } = req.body;

    // Get listing
    const listing = await Listing.findById(listingId);
    if (!listing) {
      res.status(404).json({
        success: false,
        message: 'Listing not found',
      });
      return;
    }

    // Can't chat with yourself
    if (listing.seller.toString() === req.user!._id.toString()) {
      res.status(400).json({
        success: false,
        message: 'Cannot start chat on your own listing',
      });
      return;
    }

    // Check for existing chat
    let chat = await Chat.findOne({
      listing: listingId,
      participants: { $all: [req.user!._id, listing.seller] },
    });

    if (!chat) {
      // Create new chat
      chat = await Chat.create({
        participants: [req.user!._id, listing.seller],
        listing: listingId,
        messages: message
          ? [
              {
                sender: req.user!._id,
                content: message,
                isRead: false,
              },
            ]
          : [],
        lastMessage: message || '',
        lastMessageAt: new Date(),
      });

      // Create notification for seller
      await Notification.create({
        user: listing.seller,
        type: 'message',
        title: 'New Message',
        message: `${req.user!.name} is interested in your listing "${listing.title}"`,
        link: `/messages/${chat._id}`,
        relatedListing: listing._id,
        relatedUser: req.user!._id,
      });

      // Emit real-time notification
      emitToUser(listing.seller.toString(), 'new-notification', {
        type: 'message',
        chatId: chat._id,
      });
    } else if (message) {
      // Add message to existing chat
      chat.messages.push({
        sender: req.user!._id,
        content: message,
        isRead: false,
        createdAt: new Date(),
      });
      chat.lastMessage = message;
      chat.lastMessageAt = new Date();
      await chat.save();
    }

    await chat.populate('participants', 'name avatar');
    await chat.populate('listing', 'title images price status');

    res.status(200).json({
      success: true,
      data: chat,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to start chat',
    });
  }
};

// @desc    Send message
// @route   POST /api/chats/:id/messages
// @access  Private
export const sendMessage = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const { content } = req.body;

    const chat = await Chat.findOne({
      _id: req.params.id,
      participants: req.user!._id,
    });

    if (!chat) {
      res.status(404).json({
        success: false,
        message: 'Chat not found',
      });
      return;
    }

    // Add message
    const newMessage = {
      sender: req.user!._id,
      content,
      isRead: false,
      createdAt: new Date(),
    };

    chat.messages.push(newMessage);
    chat.lastMessage = content;
    chat.lastMessageAt = new Date();
    await chat.save();

    // Get recipient
    const recipientId = chat.participants.find(
      (p) => p.toString() !== req.user!._id.toString()
    );

    // Emit real-time message
    if (recipientId) {
      emitToUser(recipientId.toString(), 'new-message', {
        chatId: chat._id,
        message: newMessage,
        sender: {
          id: req.user!._id,
          name: req.user!.name,
          avatar: req.user!.avatar,
        },
      });
    }

    res.status(200).json({
      success: true,
      data: newMessage,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to send message',
    });
  }
};

// @desc    Get unread message count
// @route   GET /api/chats/unread
// @access  Private
export const getUnreadCount = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const chats = await Chat.find({
      participants: req.user!._id,
      isActive: true,
    });

    let unreadCount = 0;
    chats.forEach((chat) => {
      chat.messages.forEach((msg) => {
        if (msg.sender.toString() !== req.user!._id.toString() && !msg.isRead) {
          unreadCount++;
        }
      });
    });

    res.status(200).json({
      success: true,
      data: { unreadCount },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to get unread count',
    });
  }
};

export default {
  getChats,
  getChat,
  startChat,
  sendMessage,
  getUnreadCount,
};
