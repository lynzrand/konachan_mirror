<template>
<div class="wrapper">
  <headerbar class="header" :query="startTags" @querySubmission="querySubmission" :ratingFlag="rating"> </headerbar>
  <div class="title">
    konamirr
  </div>
  <div class="page">    
    <waterfall 
      class="waterfall" :line-gap="256" 
      :watch="imgsArr" align="center" v-if="notError"
      ref="waterfall"
      >
      <!-- <transition-group name="slide-fade"> -->
        <waterfall-slot
          v-for="(item, index) in imgsArr"
          :width="240" :height="item.realHeight||calcHeight(item)"
          :order="index"
          :key="index"
          move-class="move"
          >
          <waterfall-image v-bind="item"
          @height-change="updateHeight(arguments, item, index)"
          move-class="move"
          ></waterfall-image>
        </waterfall-slot>
      <!-- </transition-group> -->
    </waterfall>
    <div class="errorMsg" v-else>

    </div>
  </div>
  <div class="loader-wrapper">
    <div class="loading" v-if="isBusy">
      loading next page...
    </div>
    <div class="loadnext" v-else-if="!reachingEnd">
      <button @click="loadNextPage">load the next page</button>
    </div>
    <div class="reaching-end" v-else>
      Nothing more to show.
    </div>
  </div>
</div>
</template>

<script>
import headerbar from '../components/header';
import Waterfall from 'vue-waterfall/lib/waterfall';
import WaterfallSlot from 'vue-waterfall/lib/waterfall-slot';
import waterfallImage from '../components/waterfallImage';

export default {
  name: 'post',
  props: {
    mirrorRoot: String,
    startPage: { type: Number, default: 1 },
    startTags: { type: Array, default: [] },
    startRatingFlag: { type: String, default: 's' }
  },
  components: {
    Waterfall,
    WaterfallSlot,
    headerbar,
    waterfallImage
  },
  data() {
    return {
      // imgsArr: [],
      // page: this.startPage || 1,
      // tags: this.startTags || [],
      rating: 's',
      // isBusy: true,
      // reachingEnd: false,
      // notError: true,
      // errorMsg: '',
      // config. TODO: move them out into a separate config file
      scrollMargin: 1 // in px
    };
  },
  computed: {
    isBusy: {
      get() {
        return this.$store.state.busyState;
      },
      set(v) {
        this.$store.commit('setBusy', v);
      }
    },
    reachingEnd() {
      return this.$store.state.reachingEnd;
    },
    notError() {
      return !this.$store.state.errorState;
    },
    errorMsg() {
      return this.$store.state.errorMsg;
    },
    imgsArr() {
      return this.$store.state.imgsArr;
    },
    page() {
      return this.$store.state.page;
    },
    tags() {
      return this.$store.state.tags;
    }
  },
  created() {
    if (!this.imgsArr.length) {
      this.getPosts();
      if (this.startPage) this.$store.commit('setPage', this.startPage);
    }
    window.addEventListener('scroll', this.checkScrollingAndCallUpdate);
    this.$refs.waterfall.$emit('reflow');
  },
  watch: {
    $route(t, f) {
      this.reachingEnd = false;
      console.log(`Redirecting from ${f} to ${t}`);
      window.removeEventListener('scroll', this.checkScrollingAndCallUpdate);
    }
  },
  methods: {
    querySubmission(tags, rating) {
      this.rating = rating;
      this.tags = tags;
      this.$store.commit('resetPage');
      this.getPosts(this.$store.state.page, false);
      this.$router.push('/?tags=' + this.queryTags);
    },
    checkScrollingAndCallUpdate() {
      var scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
      if (
        scrollTop + window.innerHeight >= document.body.clientHeight - this.scrollMargin &&
        !this.isBusy &&
        !this.reachingEnd
      ) {
        this.isBusy = true;
        this.loadNextPage();
        // this.reflowHandler();
      }
    },
    loadNextPage() {
      this.$store.commit('nextPage');
      if (!this.isBusy) this.getPosts(this.$store.state.page, false);
    },
    getPosts(page = 1, refresh = false) {
      if (this.reachingEnd) return -1;
      if (refresh) this.$store.commit('resetImageArr');
      this.$store.dispatch('getPosts', { refresh, rating: this.rating });
      // this.isBusy = true;
      // let request = new XMLHttpRequest();
      // request.onreadystatechange = () => {
      //   if (request.readyState === XMLHttpRequest.DONE) {
      //     if (request.status === 200) {
      //       let responseObject = JSON.parse(request.responseText);
      //       if (!responseObject || responseObject.success == false) {
      //         // Empty response! Either nothing have been found,
      //         // or already reaching the end.
      //         this.reachingEnd = true;
      //         window.removeEventListener('scroll', this.checkScrollingAndCallUpdate);
      //         console.log('Nothing more to show.');
      //       } else {
      //         if (this.rating == 's')
      //           _.remove(responseObject, v => {
      //             return v.rating != 's';
      //           });
      //         // Success! append retrieved data after current data array
      //         // this.imgsArr.push({
      //         //   isPageInd: true,
      //         //   page: this.page
      //         // });
      //         // this.imgsArr.push.apply(this.imgsArr, responseObject);
      //         // console.log(this.imgsArr);
      //         responseObject.unshift({
      //           isPageInd: true,
      //           page: this.page
      //         });
      //         this.$store.commit('appendImageArr', responseObject);
      //         this.checkScrollingAndCallUpdate();
      //       }
      //       this.notError = true;
      //     } else if (request.status >= 400) {
      //       // Error! show error information
      //       console.log(`Error: HTTP ${request.status}`);
      //       // console.log(request.responseText);
      //       this.notError = false;
      //       this.errorMsg = JSON.parse(request.responseText).reason;
      //     }
      //   }
      //   this.isBusy = false;
      // };
      // let requestURI = `https://konachan.kcsl.ink/kona-api/post.json?tags=${this.queryTags}&page=${this.page}`;
      // request.open('GET', requestURI);
      // request.send();
      // console.log('Request sent!', requestURI);
    },
    calcHeight(item) {
      if (!item.isPageInd) return item.preview_height + 128;
      else return 48;
    },
    updateHeight(args, item, index) {
      // Here uses an undefined behavior (?) to get the arguments
      // TODO: use defined behavior\
      let height = args[0];
      this.$store.commit('commitRealHeight', { index, height });
      // this.$refs.waterfall.$emit('reflow');
      this.$forceUpdate();
    }
  }
};
</script>

<style lang="scss">
@import '../styles/_imports.scss';

.header {
  position: sticky;
  top: 0px;
  z-index: 800;
}

.title {
  text-align: center;
  font-family: $display-font;
  font-size: 3rem;
  font-weight: bold;
}

.page {
  flex-direction: row;
}
.waterfall {
  margin: auto 24px;
}

// transitions

.slide-fade-enter-active {
  transition: all 150ms cubic-bezier(0.55, 0.055, 0.675, 0.19);
}
.slide-fade-leave-active {
  transition: all 150ms cubic-bezier(0.215, 0.61, 0.355, 1);
}
.slide-fade-enter,
.slide-fade-leave-to {
  transform: translateY(16px);
  opacity: 0;
}
</style>
<style lang="scss">
.move {
  transition: all 250ms cubic-bezier(0.23, 1, 0.32, 1);
}
</style>
