/*
 * @Author: Ruoyu
 * @FilePath: \next-client\components\PostCard.js
 */
import React, { useMemo } from 'react';
import { Card, Tag, Divider } from 'antd';
import { FieldTimeOutlined } from '@ant-design/icons';
import '../styles/Components/PostCard.less';
const { Meta } = Card;
import dayjs from 'dayjs';
import Link from 'next/link';

const tagColorScheme = [
  'magenta',
  'lime',
  'red',
  'orange',
  'green',
  'geekblue',
  'cyan',
  'gold',
  'blue',
  'volcano',
  'purple',
];

function PostCard({ postData }) {
  const {
    id,
    post_title,
    post_time,
    post_introduce,
    post_cover,
    category,
    tags,
    updated_at,
  } = postData;

  const postCover = useMemo(
    () => (
      <figure className='post-cover'>
        <Link
          href={{
            pathname: `/blog/post/[cname]/[...slug]`,
            query: {
              cname: category.category_name,
              slug: [id, post_title],
            },
          }}
          as={`/blog/post/${category.category_name}/${id}/${post_title}`}
          passHref
        >
          <a title={post_title}>
            <img
              className='post-cover-img'
              alt={post_title}
              src={
                post_cover ||
                'https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png'
              }
            />
          </a>
        </Link>
      </figure>
    ),
    [post_cover, post_title]
  );
  const discription = useMemo(
    () => (
      <>
        <p className='post-category'>{category.category_name}</p>
        <p className='post-title'>{post_title}</p>
        <p className='post-introduction'>{post_introduce}</p>
        <Divider orientation='center' style={{ margin: '14px 0' }}></Divider>
        <div className='post-tag'>
          {tags.map((tag, i) => (
            <Tag key={tag.id} color={tagColorScheme[i]}>
              {tag.tag_name}
            </Tag>
          ))}
        </div>
        <div className='post-meta'>
          <div className='post-author'>
            By <span>Ruoyu</span>
          </div>
          <time className='post-date'>
            <FieldTimeOutlined />
            {dayjs(post_time).format('YYYY-MM-DD')}
          </time>
        </div>
      </>
    ),
    [category.category_name, post_time]
  );
  return (
    <Card className='post-card' bordered={false} cover={postCover}>
      <Meta description={discription} />
    </Card>
  );
}

export default PostCard;
