/*
 * @Author: your name
 * @Date: 2021-08-20 22:14:28
 * @LastEditTime: 2021-09-04 21:10:51
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \next-client\components\PostCard.js
 */
import React, { useContext, useMemo } from 'react';
import { Card, Tag, Divider } from 'antd';
import '../styles/Components/PostCard.less';
const { Meta } = Card;
import dayjs from 'dayjs';
import Link from 'next/link';

// import { CursorContext } from '../context/cursor/CursorContext';

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
  // const { setCursorType } = useContext(CursorContext);
  const {
    id,
    post_title,
    post_time,
    post_introduce,
    post_cover,
    category,
    tags,
  } = postData;
  const postCover = useMemo(
    () => (
      <figure className='post-cover'>
        <Link
          href={`/blog/post/${encodeURIComponent(
            category.category_name
          )}/${encodeURIComponent(id)}`}
          as={`/blog/post/${encodeURIComponent(
            category.category_name
          )}/${encodeURIComponent(id)}`}
        >
          <a>
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
        <div className='post-description'>
          <div className='post-category'>{category.category_name}</div>
          <time className='post-date'>
            {dayjs(post_time).format('YYYY-MM-DD')}
          </time>
        </div>
        <Divider orientation='center' style={{ margin: '14px 0' }}></Divider>
        {/* <div className='post-introduction'>{intro}</div> */}
        <div className='post-tag'>
          {tags.map((tag, i) => (
            <Tag key={tag.id} color={tagColorScheme[i]}>
              {tag.tag_name}
            </Tag>
          ))}
        </div>
      </>
    ),
    [category.category_name, post_time]
  );
  return (
    <Card className='post-card' bordered={false} cover={postCover}>
      <Meta title={post_title} description={discription} />
    </Card>
  );
}

export default PostCard;
