const GET_DATA = 'GET_DATA'
const SUB_MIT = 'SUB_MIT'

export default {
	[GET_DATA](state, payload) {
		if (payload.res.httpStatusCode == 200) {
			state.itemDetail = payload.res.topiclist;
		}
	},
	[SUB_MIT](state, payload) {
		state.shopName = payload.shopName;
	}
}