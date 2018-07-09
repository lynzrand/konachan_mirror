<template>
<div class="wrapper">
  <headerbar class="header" :query="query" @querySubmission="querySubmission" ratingFlag="s"> </headerbar>
  <div class="title">
    konamirr
  </div>
  <div class="page">    
    <waterfall :line-gap="256" :watch="imgsArr">
      <waterfall-slot
        v-for="(item, index) in imgsArr"
        :order="index" :key="item.id"
        :width="240" :height="calcHeight(item)">
        <waterfall-image v-bind="item"></waterfall-image>
      </waterfall-slot>
    </waterfall>
  </div>
  <div class="loadnext">
    <button @click="getPosts(queryText, ++page)">load</button>
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
  props: ['posts', 'mirrorRoot', 'ratingFlag'],
  components: {
    Waterfall,
    WaterfallSlot,
    headerbar,
    waterfallImage
  },
  data() {
    return {
      imgsArr: [],
      query: ['i', 'j', 'k'],
      page: 1,
      queryText: 'tags=rating:s',
      rating: 's',
      isBusy: true
    };
  },
  created() {
    this.getPosts('', true);

    window.addEventListener('scroll', () => {
      var scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
      if (scrollTop + window.innerHeight >= document.body.clientHeight && !this.isBusy) {
        this.isBusy = true;
        this.getPosts(this.queryText, ++this.page);
        // this.reflowHandler();
      }
    });
  },
  methods: {
    querySubmission(event) {
      console.log(event);
    },

    getPosts(query, page, refresh = false) {
      this.isBusy = true;
      if (refresh) this.imgsArr = [];
      let request = new XMLHttpRequest();
      request.onreadystatechange = () => {
        if (request.readyState === XMLHttpRequest.DONE) {
          if (request.status === 200) {
            let responseObject = JSON.parse(request.responseText);
            // Success! append retrieved data after current data array
            this.imgsArr.push({
              isPageInd: true,
              page: this.page
            });
            this.imgsArr.push.apply(this.imgsArr, responseObject);
            console.log(this.imgsArr);
            this.isBusy = false;
          } else if (request.status >= 400) {
            // Error! show error information
            console.log(`Error: HTTP ${request.status}`);
            console.log(request.responseText);
            this.isBusy = false;
          }
        }
      };
      request.open('GET', `https://konachan.kcsl.ink/kona-api/post.json?${this.queryText}&page=${this.page}`);
      request.send();
      console.log('Request sent!');
    },
    calcHeight(item) {
      if (!item.isPageInd) return item.preview_height + 128;
      else return 48;
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
waterfall {
  align-self: center;
  margin: auto;
}
</style>
