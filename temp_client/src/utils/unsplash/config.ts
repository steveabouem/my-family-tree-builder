import { createApi } from 'unsplash-js';
// @ts-ignore
export const unsplash = createApi({
  accessKey: "SEIzMdOzObXmBvbIk-UvTRvaV323EX26biT7g6RbqBA",
  apiUrl: "https://mywebsite.com/unsplash-proxy"

});

const trees = unsplash.photos.get(
  { photoId: 'tree' },
  // `fetch` options to be sent only with _this_ request
  { headers: { 'X-Custom-Header-2': 'bar' } },
);