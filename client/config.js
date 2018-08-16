const requestURI = {
  postList: "https://konachan.kcsl.ink/kona-api/post.json?tags=__TAGS__&page=__PAGE__",
  image: "https://konachan.kcsl.ink/kona-api/post.json?tags=id:__ID__",
  comment: "https://konachan.kcsl.ink/kona-api/comment.json?post_id=__ID__"
}

const methods = {
  getPostListURI({ tags, page }) {
    return requestURI.postList.replace("__TAGS__", tags).replace("__PAGE__", page)
  },
  getImageURI({ id }) {
    return requestURI.image.replace("__ID__", id)
  },
  getCommentURI({ id }) {
    return requestURI.comment.replace("__ID__", id)
  }
}

export default {
  requestURI,
  methods
}