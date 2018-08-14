import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const state = {
  imgsArr: [],
  tags: [],
  page: 1,
  errorState: false,
  errorMsg: "",
  reachingEnd: false,
  busyState: false,
  scrollPosition: 0
}

const mutations = {
  resetImageArr(state) { state.imgsArr = [] },
  appendImageArr(state, newArr) {
    state.imgsArr.push.apply(state.imgsArr, newArr);
  },
  setPage(state, page) {
    state.page = page
  },
  nextPage(state) { state.page++ },
  resetPage(state) { state.page = 1 }, setTags(state, tagsArr) {
    state.tags = tagsArr;
  },
  commitRealHeight(state, { index, height }) {
    Vue.set(state.imgsArr[index], 'realHeight', height)
  },
  resetStates(state) {
    state.errorState = false
    state.reachingEnd = false
  },
  recvError(state, errorMsg) {
    state.errorState = true
    state.errorMsg = errorMsg
    state.reachingEnd = true
  },
  reachEnd(state) {
    state.reachingEnd = true
  },
  setBusy(state, busy) {
    state.busyState = busy
  },
  setScroll(state, scroll) {
    state.scrollPosition = scroll
  }
}

const actions = {
  getPosts(context, { nextPage = false, refresh = false, rating = 's', callback = null, callbackArgs = null }) {
    if (context.state.isBusy == true) return
    if (nextPage) context.commit('nextPage')
    context.commit('setBusy', true)
    let page = state.page
    let request = new XMLHttpRequest();
    request.onreadystatechange = () => {
      if (request.readyState === XMLHttpRequest.DONE) {
        if (request.status === 200) {
          let responseObject = JSON.parse(request.responseText);
          if (responseObject.length == 0 || responseObject.success == false) {
            // Empty response! Either nothing have been found,
            // or already reaching the end.
            // this.reachingEnd = true;
            context.commit('reachEnd')
            // window.removeEventListener('scroll', this.checkScrollingAndCallUpdate);
            console.log('Nothing more to show.');
          } else {
            if (rating == 's')
              _.remove(responseObject, v => {
                return v.rating != 's';
              });
            // Success! append retrieved data after current data array
            // this.imgsArr.push({
            //   isPageInd: true,
            //   page: this.page
            // });
            // this.imgsArr.push.apply(this.imgsArr, responseObject);
            // console.log(this.imgsArr);
            responseObject.unshift({
              isPageInd: true,
              page
            });
            context.commit('appendImageArr', responseObject);
            if (callback) callback(...callbackArgs)
          }
          // this.notError = true;
        } else if (request.status >= 400) {
          // Error! show error information
          console.log(`Error: HTTP ${request.status}`);
          // console.log(request.responseText);
          // this.notError = false;
          let errorMsg = JSON.parse(request.responseText).reason;
          context.commit('recvError', errorMsg)
        }
      }
      context.commit('setBusy', false)
    };
    let requestURI = `https://konachan.kcsl.ink/kona-api/post.json?tags=${context.getters.queryTags}&page=${context.state.page}`;
    request.open('GET', requestURI);
    request.send();
    console.log('Request sent!', requestURI);
  }
}

const getters = {
  queryTags(state) {
    return state.tags ? state.tags.join('+') : '';
  }
}

const store = new Vuex.Store({
  state,
  mutations,
  getters,
  actions
})

export default store
