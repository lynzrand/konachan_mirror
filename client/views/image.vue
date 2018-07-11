<template>
  <div class="page">
    <div class="image-wrapper">
      <img class="image" :src="imageInfo.jpeg_url" :alt="imageInfo.tags?imageInfo.tags:''">
    </div>
    <div class="desc">
      <div class="tags">
        <div class="tag" v-for="(tag,index) in tagsArr" :key="index"><span class="tag-hash"># </span>{{tag.replace('_', ' ')}}</div>
      </div>
    </div>
    <div class="comments">
      <div class="comment" v-for="(comment, index) in comments" :key="index">
        {{comment.creator}}:<br> {{comment.body}}
      </div>
    </div>
  </div>
</template>

<script>
import _ from 'lodash';

export default {
  name: 'image',
  props: {
    id: Number
  },
  created() {
    // fetch image and comment
    this.updateData();
  },
  data() {
    return {
      imageInfo: new Object(),
      comments: new Array()
    };
  },
  watch: {
    $route(to, from) {
      if (!/\/\d+/.test(from)) this.updateData();
    }
  },
  computed: {
    tagsArr() {
      return this.imageInfo.tags ? this.imageInfo.tags.split(' ') : [];
    }
  },
  methods: {
    fetchImageData() {
      let request = new XMLHttpRequest();
      request.onreadystatechange = () => {
        if (request.readyState === XMLHttpRequest.DONE) {
          if (request.status === 200) {
            let responseObject = JSON.parse(request.responseText);
            if (!!responseObject[0]) this.imageInfo = _.assign({}, this.imageInfo, responseObject[0]);
            // else this.$router.replace('/e/404');
            // console.log(this.imageInfo);
            // this.infoLoaded();58537537
          } else if (request.status >= 400) {
            // Error! show error information
            console.log(`Error: HTTP ${request.status}`);
            // this.$router.replace('/e/404');
          }
        }
      };
      let requestURI = `https://konachan.kcsl.ink/kona-api/post.json?tags=id:${this.id}`;
      request.open('GET', requestURI);
      request.send();
      console.log('Request sent!', requestURI);
    },
    fetchCommentData() {
      let request = new XMLHttpRequest();
      request.onreadystatechange = () => {
        if (request.readyState === XMLHttpRequest.DONE) {
          if (request.status === 200) {
            let responseObject = JSON.parse(request.responseText);
            this.comments = responseObject;
            // console.log(this.imageInfo);
            // this.infoLoaded();
          } else if (request.status >= 400) {
            // Error! show error information
            console.log(`Error: HTTP ${request.status}`);
            // this.$router.replace('/e/404');
          }
        }
      };
      let requestURI = `https://konachan.kcsl.ink/kona-api/comment.json?post_id=${this.id}`;
      request.open('GET', requestURI);
      request.send();
      console.log('Request sent!', requestURI);
    },
    updateData() {
      this.fetchImageData();
      this.fetchCommentData();
    },
    regulateComment(comment) {}
  }
};
</script>

<style lang="scss" scoped>
@import '../styles/_imports.scss';

.image-wrapper {
  .image {
    max-width: 100%;
  }
}

.tags {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  font-family: $display-font;
  color: map-get($greys, 700);
  .tag {
    margin: 0.25rem 0.3rem;
    padding: 0.2rem 0.5rem;
    background: mix(map-get($greys, 100), map-get($greys, 50));
    border-radius: 0.2rem;
    .tag-hash {
      color: map-get($greys, 300);
    }
  }
}
</style>
