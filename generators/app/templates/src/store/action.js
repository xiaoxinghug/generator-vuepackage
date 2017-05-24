import fetch from "isomorphic-fetch"

export default {
	subMit({ commit, state }, id) {
		commit('SUB_MIT', { id })
		// if (state.itemNum < state.itemDetail.length) {
		// 	commit('ADD_ITEMNUM', {
		// 		num: 1
		// 	})
		// }
	},

	getData({ commit, state }) {
		fetch('http://operating-activities.putao.com/happyfriday?active_topic_id=4',{
			method:'get',
			headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          	}
		}).
		then(res => {
			commit('GET_DATA', {
				res
			})
		})
	},

	initializeData({ commit }) {
		commit('INITIALIZE_DATA')
	}
}