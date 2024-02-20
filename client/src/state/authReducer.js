import { createSlice } from "@reduxjs/toolkit";

//* -------------------------------------------------------------------------- */
//*                                initialState                                */
//* -------------------------------------------------------------------------- */
const initialState = {
	user: null,
	token: null,

	// * Traditonal Redux
	// webs: [],
	// mobiles: [],
};

//* -------------------------------------------------------------------------- */
//*                                  authSlice                                 */
//* -------------------------------------------------------------------------- */
export const authSlice = createSlice({
	name: "auth",
	initialState,
	reducers: {

		/* -------------------------------------------------------------------------- */
		/*                                    Auth                                    */
		/* -------------------------------------------------------------------------- */
		setLogin: (state, action) => {
			state.user = action.payload.user;
			state.token = action.payload.token;
		},
		setLogout: (state) => {
			state.user = null;
			state.token = null;
		},		

		/* -------------------------------------------------------------------------- */
		/*                                  Follower                                  */
		/* -------------------------------------------------------------------------- */
		setFollowers: (state, action) => {
      if (state.user) {
        state.user.followers = action.payload.followers;
      } else {
        console.error("Followers not exist.");
      }
    },
		setRemoveFollower: (state, action) => {
      if (state.user) {
  			state.user.followers.filter(item => item !== action.payload);
      } else {
        console.error("Followers not exist.");
      }
    },
		setRemoveFollowerById: (state, action) => {
      if (state.user) {
  			state.user.followers = state.user.followers.filter(item => item._id !== action.payload);
      } else {
        console.error("Followers not exist.");
      }
    },

		/* -------------------------------------------------------------------------- */
		/*                                  Following                                 */
		/* -------------------------------------------------------------------------- */
		setFollowing: (state, action) => {
      if (state.user) {
        state.user.following = action.payload.following;
      } else {
        console.error("User does not exist.");
      }
    },
		setRemoveFollowingById: (state, action) => {
      if (state.user) {
  			state.user.following = state.user.following.filter(item => item._id !== action.payload);
      } else {
        console.error("User does not exist.");
      }
    },

		/* -------------------------------------------------------------------------- */
		/*                              Traditional Redux                             */
		/* -------------------------------------------------------------------------- */
		// setWebs: (state, action) => {
		// 	state.webs = action.payload.webs;
		// },
		// setWeb: (state, action) => {
		// 	const updatedWebs = state.webs.map((web) => {
		// 		if (web._id === action.payload.web._id) return action.payload.web;
		// 		return web;
		// 	});
		// 	state.webs = updatedWebs;
		// },
		// setMobiles: (state, action) => {
		// 	state.mobiles = action.payload.mobiles;
		// },
		// setMobile: (state, action) => {
		// 	const updatedMobiles = state.mobiles.map((mobile) => {
		// 		if (mobile._id === action.payload.mobile._id) return action.payload.mobile;
		// 		return mobile;
		// 	});
		// 	state.mobiles = updatedMobiles;
		// },
	},
});

export const {     
	setLogin, 
	setLogout,
	setFollowers,
	setRemoveFollower,
	setRemoveFollowerById,
	setFollowing,
	setRemoveFollowingById,

	// Traditional Redux
	// setWebs,
	// setWeb,
	// setMobiles,
	// setMobile,
} = authSlice.actions;
  
export default authSlice.reducer;