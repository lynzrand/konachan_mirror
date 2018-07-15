<template>
<!-- <transition name="slide-fade"> -->
  <div class="wf-wrapper" ref="wrapper">
    <div v-if="isPageInd">
      <div class="wf-pageindicator">
        Page {{page}}
      </div>
    </div>
    <div v-else>
      <div class="wfimg-container">
        <router-link :to="'/'+id"
        >
        <!-- target="_blank" -->
          <transition name="placeholder-fade-away">
            <div class="placeholder" v-if="~loaded" :style="placeholderStyle"></div>
          </transition>
          <img :src="preview_url" :alt="id" class="wfimg"
          @loadend="recalculateHeight">
        </router-link>
      </div>
      <div class="wfdesc">
        <div class="wfdesc-row">
          <div class="wfdesc-resolution" @click="loaded=false">{{width}} x {{height}}</div>
          <!-- <div class="button"><img src="" alt="" class="dl"></div> -->
          </div>
        <div class="wfdesc-row"><span class="wfdesc-author">uploaded by {{author}}</span></div>
      </div>
    </div>
  </div>
<!-- </transition> -->

</template>

<script>
export default {
  name: 'waterfallImage',
  props: {
    id: Number,
    tags: String,
    author: String,
    created_at: Number,
    source: String,
    score: Number,
    file_size: Number,
    file_url: String,
    width: Number,
    height: Number,
    preview_url: String,
    actual_preview_width: Number,
    actual_preview_height: Number,
    sample_url: String,
    sample_width: Number,
    sample_height: Number,
    sample_file_size: Number,
    jpeg_url: String,
    jpeg_file_size: Number,
    rating: String,
    isPageInd: { type: Boolean, default: false },
    page: Number

    /*
    "rating": "s",
    "has_children": false,
    "parent_id": null,
    "status": "active",
    "width": 2976,
    "height": 1881,
    "is_held": false,
    "frames_pending_string": "",
    "frames_pending": [],
    "frames_string": "",
    "frames": [] */
  },
  methods: {
    recalculateHeight(event) {
      let height;
      height = this.$refs.wrapper.offsetHeight;
      if (height != 0) {
        console.log(`#${this.id} loaded!`);
        // this.loaded = true;
        this.$emit('height-change', height);
      }
    }
  },
  data() {
    return {
      loaded: false,
      placeholderStyle: {}
    };
  },
  computed: {
    // placeholderStyle() {
    //   return
    // }
  },
  created() {
    if (this.isPageInd) {
      // TODO: Replace router.currentRoute.query.page with current page
      //   document.addEventListener('scroll', () => {
      //           let scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
      //   if (scrollTop + window.innerHeight >= this.$root.top && router.currentRoute.query.page) {
      //     router.currentRoute.query.page=this.page
      //   }
      //   });
    }
  },
  mounted() {
    this.$nextTick(() => {
      let height = Math.ceil(
        parseInt(window.getComputedStyle(this.$refs.wrapper, null)['width']) * (this.sample_height / this.sample_width)
      );
      console.log(height, window.getComputedStyle(this.$refs.wrapper, null)['width']);
      let style = {
        height: height + 'px',
        marginBottom: -height + 'px'
      };
      this.placeholderStyle = style;
      console.log(`#${this.id} placeholder drawn!`);
    });
  }
};
</script>

<style lang="scss" scoped>
@import '../styles/_imports.scss';

.wf-wrapper {
  margin: 8px;
  background: #fff;
  overflow: hidden;
  border-radius: 4px;
  transition: all 200ms cubic-bezier(0.165, 0.84, 0.44, 1);
  box-shadow: 0px 1px 1.5px rgba(56, 27, 27, 0.24);
  font-family: $text-font;
  &:hover {
    box-shadow: 0px 6px 16px rgba(0, 0, 0, 0.24);
  }
}

.wfimg-container {
  max-width: 300px;
  overflow: hidden;
}

.wfimg {
  width: 100%;
}

.wf-pageindicator {
  background: $accent-pink;
  color: map-get($greys, 50);
  font-weight: bold;
  padding: 0.25rem 0.5rem;
}

.wfdesc-row,
.wfdesc-row > * {
  margin: 0px;
  padding: 0px;
}

.wfdesc {
  padding: 0.25rem 0.5rem 0.5rem 0.5rem;
}

.wfdesc-resolution {
  font-weight: bold;
  color: map-get($greys, 500);
}
.wfdesc-author {
  font-size: 0.75rem;
  color: map-get($greys, 300);
}

@keyframes loadingAnim {
  0% {
    background: mix(map-get($greys, 50), map-get($greys, 100));
  }
  100% {
    background: map-get($greys, 100);
  }
}

.placeholder {
  width: 100%;
  position: relative;
  z-index: 80;
  animation: loadingAnim 500ms cubic-bezier(0.445, 0.05, 0.55, 0.95) 0s infinite alternate;
}

// transitions

.placeholder-fade-away-leave-active {
  transition: all 150ms cubic-bezier(0.165, 0.84, 0.44, 1);
}
.placeholder-fade-away-leave-to {
  opacity: 0;
}

// .slide-fade-enter-active {
//   transition: all 150ms cubic-bezier(0.55, 0.055, 0.675, 0.19);
// }
// .slide-fade-leave-active {
//   transition: all 150ms cubic-bezier(0.215, 0.61, 0.355, 1);
// }
// .slide-fade-enter,
// .slide-fade-leave-to {
//   transform: translateY(16px);
//   opacity: 0;
// }
</style>
