import emojiList from "./emoji.json";
import {isProduction} from "./env";
import fs from "fs";
import path from "path";
import matter from "gray-matter";
import dayjs from "dayjs";
import _, {cloneDeep} from "lodash";

class Category {
  constructor(blog_path = "posts") {
    this.blog_path = blog_path;
    this.categories;
    this.init();
  }
  init() {
    const categories = fs.readdirSync(path.join(`${this.blog_path}`));
    let index = categories.indexOf("draft");
    if (index !== -1 && isProduction) {
      categories.splice(index, 1);
    }
    this.categories = categories;
  }
}

class Blog {
  constructor({
    id,
    category,
    date,
    excerpt,
    title,
    content,
    coverImage,
    tags,
  }) {
    this.id = id;
    this.date = date;
    this.category = category;
    this.excerpt = excerpt;
    this.title = title;
    this.content = content;
    this.coverImage = coverImage;
    this.tags = tags;
  }
}

export class BlogCollection {
  tags = [];
  constructor(blog_path = "posts") {
    this.blog_path = blog_path;
    this.categories = new Category(blog_path).categories;
    this.blogs = this.getAllBlogs().map((blog) => new Blog(blog));
    this.tags = this.getTagsWithWeight();
    // this.initCache();
  }
  initCache() {
    try {
      fs.readdirSync("_cachePosts");
    } catch (error) {
      fs.mkdirSync("_cachePosts");
    }

    fs.writeFile(
      "_cachePosts/blogs.json",
      JSON.stringify(this.blogs),
      function (err) {
        if (err) return console.error(err);
      }
    );
    fs.writeFile(
      "_cachePosts/tags.json",
      JSON.stringify(this.tags),
      function (err) {
        if (err) return console.error(err);
      }
    );
  }

  serialize(content) {
    try {
      return JSON.parse(JSON.stringify(content));
    } catch (error) {
      throw new Error(error);
    }
  }

  getBlogsByCategory(category) {
    const blogs = this.blogs.filter((blog) => blog.category === category);
    return this.serialize(blogs);
  }

  getBlogByCategoryAndId(category, id) {
    const blog = this.getBlogsByCategory(category).find(
      (post) => post.id === id
    );
    return this.serialize(blog);
  }

  getBlogFilesByCategory(category) {
    const fileNames = fs.readdirSync(
      path.join(`${this.blog_path}/${category}`)
    );
    return fileNames.map((fileName) => ({ fileName, category }));
  }
  getAllBlogFiles() {
    const categories = this.categories;
    return categories
      .map((category) => this.getBlogFilesByCategory(category))
      .flat(1);
  }

  getAllBlogs() {
    const files = this.getAllBlogFiles();
    return files
      .map(({ fileName, category }) => this.parseMDFile(fileName, category))
      .sort((a, b) => {
        const aDate = dayjs(a.date);
        const bDate = dayjs(b.date);

        return aDate.isBefore(bDate) ? 1 : -1;
      });
  }

  getAllPostPaths(isLinkPath = false) {
    if (isLinkPath) {
      return this.blogs.map((post) => ({
        href: {
          pathname: `/blog/post/[cname]/[...slug]`,
          query: {
            cname: post.category,
            slug: [post.id],
          },
        },
        id: post.id,
        title: post.title,
        as: `/blog/post/${post.category}/${post.id}`,
      }));
    }
    return this.blogs.map((post) => ({
      params: {
        cname: post.category,
        slug: [post.id],
      },
    }));
  }

  getTagsWithWeight() {
    const tags = _.map(this.blogs, "tags").flat(1);
    return _.values(_.groupBy(tags)).map((d) => ({
      text: d[0],
      value: d.length,
    }));
  }

  parseMDFile(fileName, category) {
    const slug = fileName.replace(/\.md$/, "");

    const markdownWithMeta = fs.readFileSync(
      path.join(`${this.blog_path}/${category}/${fileName}`),
      "utf-8"
    );
    const { data: frontMatter, content } = matter(markdownWithMeta);

    const {
      title,
      date,
      excerpt,
      cover = "https://picsum.photos/400/500",
      tags = [],
    } = frontMatter;

    const coverImage = cover;
    const id = slug;
    return {
      id,
      title,
      date,
      excerpt,
      content,
      coverImage,
      category,
      tags,
    };
  }
}

export const filterPost = (posts, query) => {
  if (!query) return posts;
  const _query = query.toLowerCase();
  return posts.filter((post) => {
    return (
      post.title.toLowerCase().includes(_query) ||
      post.tags.join(" ").toLowerCase().includes(_query) ||
      post.excerpt.toLowerCase().includes(_query) ||
      post.category.toLowerCase().includes(_query)
    );
  });
};

export const getFilteredData = (posts, enableSearch, query) => {
  const _posts = cloneDeep(posts);
  if (enableSearch && !query) {
    return [];
  }
  return filterPost(_posts, query);
};

export function randomEmoji() {
  const keys = Object.keys(emojiList);
  const randomIndex = Math.floor(Math.random() * keys.length);
  return emojiList[keys[randomIndex]];
}

export function getExistingTags(blogs) {}
