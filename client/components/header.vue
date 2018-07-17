<template>
  <div class="header">
    <div class="url">
      <span class="url-slash">
        / {{isSafeMode?"safe ":"unsafe "}}
      </span>
      <input id="url-text" class="url-text" type="text"
      v-model="queryStr"
      :class="{ err: isErr }"
      @keypress.enter="submitQuery($event)"
      @change="searchQueryChanged()">
    </div>
      <div class="user"></div>
  </div>
</template>

<script>
import _ from 'lodash';

export default {
  name: 'headerbar',
  props: {
    query: {
      type: Array,
      default() {
        return [];
      }
    },
    rating: { type: String, default: 's' }
  },
  data() {
    return {
      iquery: this.query || [],
      irating: this.rating || 's',
      queryStr: _.remove(this.iquery, v => /\brating:\w\b/i.test(v)).join(' '),
      isErr: false
    };
  },
  computed: {
    // queryStr: {
    //   get() {
    //     return _.remove(this.iquery, v => /\brating:\w\b/i.test(v)).join(' ');
    //   },
    //   set(val) {
    //     this.iquery = val.split(' ').unshift('rating:' + this.rating);
    //   }
    // // },
    // isErr() {
    //   return this.iquery.length > 5;
    // },
    isSafeMode() {
      return this.irating == 's';
    }
  },
  watch: {
    queryStr() {
      this.iquery = _.without(this.queryStr.split(' '), '');
      this.queryStr.replace(/\b(unsafe|safe) /i, '');
      console.log(this.iquery);

      this.isErr = this.iquery.length > 5;
      this.irating = /\b(rating:[^sS]|unsafe) /i.test(this.queryStr)
        ? 'e'
        : /\b(rating:[sS]|safe) /i.test(this.queryStr) ? 's' : this.irating;
    }
  },
  methods: {
    searchQueryChanged() {},
    submitQuery(event) {
      console.log('Enter key fired!');
      console.log(event);
      this.$emit('querySubmission', this.iquery, this.irating);
    }
  }
};
</script>

<style lang="scss" scoped>
@import '../styles/_imports.scss';

.header {
  background: map-get($map: $greys, $key: 50);
}

.url {
  padding: 0.8em;
  font-family: $display-font;
  font-weight: bold;
  font-size: 1.5em;
  color: map-get($greys, 300);
}

.url-text {
  background: transparent;
  border: none;
  font: inherit;
  // display: inline;
  color: $accent-pink;
  width: 80%;
  &:focus {
    color: map-get($greys, 500);
  }
  &.err {
    color: $warn-alizarin;
  }
}
</style>
