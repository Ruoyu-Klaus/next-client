export class Blog {
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
