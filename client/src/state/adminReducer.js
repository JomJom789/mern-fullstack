import { createSlice } from "@reduxjs/toolkit";

//* -------------------------------------------------------------------------- */
//*                                initialState                                */
//* -------------------------------------------------------------------------- */
const initialState = {
	isSidebarOpen: true,
	isChatOpen: false,
	isNotificationOpen: false,
	isAvatarOpen: false,
	// darkMode: false,

	activeUsers: [],
	chats: [],	
	selectedChat: [],
};

//* -------------------------------------------------------------------------- */
//*                                 adminSlice                                 */
//* -------------------------------------------------------------------------- */
export const adminSlice = createSlice({
	name: "admin",
	initialState,
	reducers: {

		/* -------------------------------------------------------------------------- */
		/*                                   IsOpen                                   */
		/* -------------------------------------------------------------------------- */
		setIsSidebarOpen: (state) => {
			state.isSidebarOpen = !state.isSidebarOpen;
		},
		setIsChatOpen: (state, action) => {
			state.isChatOpen = action.payload;
		},
		setIsNotificationOpen: (state) => {
			state.isNotificationOpen = !state.isNotificationOpen;
		},
		setIsAvatarOpen: (state) => {
			state.isAvatarOpen = !state.isAvatarOpen;
		},

		/* -------------------------------------------------------------------------- */
		/*                                    Chat                                    */
		/* -------------------------------------------------------------------------- */
		setActiveUsers: (state, action) => {
			state.activeUsers = action.payload;
    },
		setChats: (state, action) => {
			state.chats = action.payload;
    },
		setSelectedChat: (state, action) => {
      state.selectedChat = action.payload;
    },

		// setChat: (state, action) => {
		// 	const updatedChats = state.chats.map((chat) => {
		// 		if (chat._id === action.payload.chat._id) return action.payload.chat;
		// 		return chat;
		// 	});
		// 	state.chats = updatedChats;
		// },

		/* -------------------------------------------------------------------------- */
		/*                                Notification                                */
		/* -------------------------------------------------------------------------- */
		// setNotifications: (state, action) => {
		// 	state.mobiles = action.payload.mobiles;
		// },
		// setNotification: (state, action) => {
		// 	const updatedNotifications = state.notifications.map((notification) => {
		// 		if (notification._id === action.payload.notification._id) { 
		// 			return action.payload.notification; 
		// 		}
		// 		return notification;
		// 	});
		// 	state.notifications = updatedNotifications;
		// },

	},
});

export const {
	setIsSidebarOpen,
	setIsChatOpen,
	setIsNotificationOpen,
	setIsAvatarOpen,
	setActiveUsers,
	setChats,
	setSelectedChat,
	// setChat,
	// setNotifications,
	// setNotification,
} = adminSlice.actions;
  
export default adminSlice.reducer;