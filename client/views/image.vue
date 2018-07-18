<template>
  <div class="page">
    <div class="img-desc-wrapper">
      <div class="image-wrapper">
        <img class="image" :src="imageInfo.jpeg_url" :alt="imageInfo.tags?imageInfo.tags:''">
      </div>
      <div class="desc">
        <div class="title-id">
          # {{id}}
        </div>
        <div class="tags">
          <div class="tag" v-for="(tag,index) in tagsArr" :key="index"><span class="tag-hash"># </span>{{tag.replace('_', ' ')}}</div>
        </div>
        <div class="download">
          <p>
            * Please use right-click download for the following links
          </p>
          <a :href="imageInfo.file_url" class="download-link" download>Download Original picture ({{(imageInfo.file_size/1048576).toFixed(2)}}MiB)</a>
          <a v-if="hasJpegVariant" :href="imageInfo.jpeg_url" class="download-link" download>Download JPEG Variant ({{(imageInfo.jpeg_file_size/1048576).toFixed(2)}}MiB)</a>
        </div>
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
    },
    hasJpegVariant() {
      return !/(\.jpg|\.jpeg)/i.test(this.imageInfo.file_url);
    }
  },
  methods: {
    fetchImageData() {
      let request = new XMLHttpRequest();
      request.onreadystatechange = () => {
        if (request.readyState === XMLHttpRequest.DONE) {
          if (request.status === 200) {
            let responseObject = JSON.parse(request.responseText);
            console.log(responseObject);
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

.page {
  background: map-get($greys, 0);
  // padding: 1rem;
  border-radius: 8px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  margin: 24px auto;
  @media screen and(min-width: 720px) and (max-width: 1440px) {
    box-shadow: 0px 6px 16px rgba(0, 0, 0, 0.24);
    max-width: 960px;
  }
  @media screen and (min-width: 1440px) {
    box-shadow: 0px 6px 16px rgba(0, 0, 0, 0.24);
    max-width: 1280px;
  }
  .img-desc-wrapper {
    display: flex;
    @media screen and (max-width: 720px) {
      // Phone
      flex-direction: column;
    }
    @media screen and(min-width: 720px) and (max-width: 1440px) {
      flex-direction: column;
      .desc {
        margin: 1rem 2rem;
      }
    }
    @media screen and (min-width: 1440px) {
      flex-direction: row;
      .desc {
        width: 240px;
        flex-shrink: 0;
        flex-grow: 0;
        margin: 1rem 1.5rem;
      }
    }
    .image-wrapper {
      .image {
        max-width: 100%;
      }
    }
  }
}
.desc {
  font-family: $display-font;
  .title-id {
    font-size: 2rem;
    color: map-get($greys, 500);
    margin-bottom: 1rem;
  }
  .tags {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    // font-family: $display-font;
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
  .download {
    margin-top: 1rem;
    margin-bottom: 1rem;
    .download-link {
      display: block;
      margin-top: 0.5rem;
      margin-bottom: 0.5rem;
      font-size: 1.25rem;
    }
  }
}
</style>
