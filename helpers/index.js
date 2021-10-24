import { getArticleList } from '../request';

export async function getPostPaths(linkPath = false) {
  const { rows } = await getArticleList();

  if (linkPath) {
    return rows.map(post => ({
      pathname: `/blog/post/[cname]/[...slug]`,
      query: {
        cname: post.category.category_name,
        slug: [post.id, post.post_title],
      },

      title: post.post_title,
      as: `/blog/post/${post.category.category_name}/${post.id}/${post.post_title}`,
    }));
  }

  return rows.map(post => ({
    params: {
      cname: encodeURIComponent(post.category.category_name),
      slug: [encodeURIComponent(post.id), encodeURIComponent(post.post_title)],
    },
  }));
}

export function randomEmoji() {
  const emojiList = [
    '😊',
    '🙃',
    '🤪',
    '🤓',
    '🤯',
    '😴',
    '💩',
    '👻',
    '👽',
    '🤖',
    '👾',
    '✌️',
    '🤙',
    '🐭',
    '🎃',
    '🐉',
  ];
  const randomIndex = Math.floor(Math.random() * emojiList.length);
  return emojiList[randomIndex];
}
