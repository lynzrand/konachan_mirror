<template>
<div class="wrapper">
  <headerbar class="header" :query="tags" @querySubmission="querySubmission" ratingFlag="s"> </headerbar>
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
          @height-change="updateHeight(arguments, item)"
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
    <div class="loadnext" v-else>
      <button @click="getPosts(queryText, ++page)">load the next page</button>
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
      imgsArr: [],
      page: this.startPage || 1,
      tags: this.startTags || [],
      rating: 's',
      isBusy: true,
      notError: true,
      errorMsg: '',
      // config. TODO: move them out into a separate config file
      scrollMargin: 24 // in px
    };
  },
  computed: {
    queryTags() {
      return this.tags ? this.tags.join('+') : '';
    }
  },
  created() {
    this.getPosts('', true);
    window.addEventListener('scroll', this.checkScrollingAndCallUpdate);
  },
  methods: {
    querySubmission(event) {
      console.log(event);
    },
    checkScrollingAndCallUpdate() {
      var scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
      if (scrollTop + window.innerHeight >= document.body.clientHeight - this.scrollMargin && !this.isBusy) {
        this.isBusy = true;
        this.getPosts(this.queryText, ++this.page);
        // this.reflowHandler();
      }
    },
    getPosts(query, page, refresh = false) {
      this.isBusy = true;
      if (refresh) this.imgsArr = [];
      let request = new XMLHttpRequest();
      request.onreadystatechange = () => {
        if (request.readyState === XMLHttpRequest.DONE) {
          if (request.status === 200) {
            let responseObject = JSON.parse(request.responseText);
            if (this.rating == 's')
              _.remove(responseObject, v => {
                return v.rating != 's';
              });
            // Success! append retrieved data after current data array
            this.imgsArr.push({
              isPageInd: true,
              page: this.page
            });
            this.imgsArr.push.apply(this.imgsArr, responseObject);
            console.log(this.imgsArr);
            this.isBusy = false;
            this.notError = true;
            this.checkScrollingAndCallUpdate();
          } else if (request.status >= 400) {
            // Error! show error information
            console.log(`Error: HTTP ${request.status}`);
            // console.log(request.responseText);
            this.isBusy = false;
            this.notError = false;
            this.errorMsg = JSON.parse(request.responseText).reason;
          }
        }
      };
      let requestURI = `https://konachan.kcsl.ink/kona-api/post.json?tags=${this.queryTags}&page=${this.page}`;
      request.open('GET', requestURI);
      request.send();
      console.log('Request sent!', requestURI);
    },
    calcHeight(item) {
      if (!item.isPageInd) return item.preview_height + 128;
      else return 48;
    },
    updateHeight(args, item) {
      // Here uses an undefined behavior (?) to get the arguments
      // TODO: use defined behavior
      item.realHeight = args[0] + 4;
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
