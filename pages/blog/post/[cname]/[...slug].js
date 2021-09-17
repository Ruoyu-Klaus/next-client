import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import NextLink from 'next/link';
import PostCard from '../../../../components/PostCard';

import { Tag, Divider, Avatar, Anchor, Row, Col } from 'antd';
const { Link } = Anchor;
import { WechatFilled, FacebookFilled, GithubFilled } from '@ant-design/icons';

import dayjs from 'dayjs';

import '../../../../styles/Pages/post.less';

const tagColorScheme = [
  'magenta',
  'purple',
  'blue',
  'red',
  'orange',
  'gold',
  'lime',
  'volcano',
  'green',
  'cyan',
  'geekblue',
];

function Post({ post = null, tocTree = [], previousPath, nextPath }) {
  const router = useRouter();
  const { cname, slug } = router.query;

  const [targetOffset, setTargetOffset] = useState(undefined);
  useEffect(() => {
    !post && router.push('/blog');
  }, []);
  useEffect(() => {
    setTargetOffset(window.innerHeight / 1.8);
  }, []);

  const renderToc = items => {
    // 递归 render
    return items.map(item => (
      <Link
        onClick={e => {
          e.preventDefault();
          document.querySelector(`#${item.anchor}`).scrollIntoView({
            behavior: 'smooth',
          });
        }}
        key={item.anchor}
        href={`#${item.anchor}`}
        title={item.text}
      >
        {item.children && renderToc(item.children)}
      </Link>
    ));
  };

  // 暂时弃用
  //  const getFlatAnchors = items => {
  //   return items.reduce((acc, item) => {
  //     acc.push(item.anchor);
  //     if (item.children) {
  //       acc.push(...getFlatAnchors(item.children));
  //     }
  //     return acc;
  //   }, []);
  // };

  // 已使用Antd的组件，暂时弃用
  // const toc = tocTree => (
  //   <ul>
  //     {tocTree.map(item => (
  //       <li key={item.anchor}>
  //         <a
  //           href={`#${item.anchor}`}
  //           onClick={e => {
  //             e.preventDefault();
  //             document.getElementById(`${item.anchor}`).scrollIntoView({
  //               behavior: 'smooth',
  //             });
  //           }}
  //         >
  //           {item.text}
  //         </a>
  //         {item.children && toc(item.children)}
  //       </li>
  //     ))}
  //   </ul>
  // );

  return (
    post && (
      <>
        <Head>
          <title>{post.post_title} | Ruoyu</title>
          <link rel='icon' href='/favicon.ico' />
        </Head>
        <div style={{ height: '100%' }}>
          {/* load postcard style prevent tansition flash */}
          {cname === '_$placeholder' && <PostCard />}
          <Row
            type='flex'
            justify='center'
            className='comm-main post-detail-container'
          >
            <Col xs={24} sm={24} md={18} lg={18} xxl={18}>
              <Divider>
                <div className='post-foot-spot' />
              </Divider>
            </Col>
            <Col xs={24} sm={24} md={18} lg={18} xxl={18}>
              <div className='detailed-title '>{post.post_title}</div>
            </Col>
            <Col xs={24} sm={24} md={18} lg={18} xxl={18}>
              <div className='detailed-cover center'>
                <img src={post.post_cover} />
              </div>
            </Col>
            <Col xs={24} sm={24} md={18} lg={18} xxl={18}>
              <div className='detailed-info'>
                <div className='detailed-date '>
                  <time>{dayjs(post.post_time).format('MM-DD, YYYY')}</time>
                </div>
                <div className='detailed-category'>
                  <span>{post.category.category_name}</span>
                </div>
                <div className='detailed-tag'>
                  {post?.tags.map((tag, i) => (
                    <Tag key={tag.id} color={tagColorScheme[i]}>
                      {tag.tag_name}
                    </Tag>
                  ))}
                </div>
                <div className='detailed-social'>
                  <a target='_blank' href='https://github.com/Ruoyu-Klaus'>
                    <Avatar
                      size={30}
                      icon={<GithubFilled />}
                      className='account'
                    />
                  </a>
                  <a
                    target='_blank'
                    href='https://www.facebook.com/ruoyu.wang.9028194'
                  >
                    <Avatar
                      size={30}
                      icon={<FacebookFilled />}
                      className='account'
                    />
                  </a>
                  <a
                    target='_blank'
                    href='https://i.loli.net/2020/07/03/WklZBzG2MxepQyg.jpg'
                  >
                    <Avatar
                      size={30}
                      icon={<WechatFilled />}
                      className='account'
                    />
                  </a>
                </div>
              </div>
            </Col>
            <Col xs={24} sm={24} md={24} lg={24} xxl={24}>
              <div className='detailed-content'>
                <Row type='flex' justify='center'>
                  <Col xs={24} sm={24} md={5} lg={5}></Col>
                  <Col xs={24} sm={24} md={14} lg={14}>
                    <div
                      className='markdown-body'
                      id='content'
                      dangerouslySetInnerHTML={{ __html: post.post_content }}
                    />
                  </Col>
                  <Col xs={0} sm={0} md={5} lg={5}>
                    <div className='detailed-toc'>
                      <Anchor affix showInkInFixed offsetTop={targetOffset}>
                        {renderToc(tocTree)}
                      </Anchor>
                    </div>
                  </Col>
                </Row>
              </div>
            </Col>

            <Col xs={24} sm={24} md={18} lg={18} xxl={18}>
              <div className='post-link'>
                <div className='post-link left'>
                  {previousPath && (
                    <NextLink href={previousPath} as={previousPath.as}>
                      <a>previous: {previousPath && previousPath.title}</a>
                    </NextLink>
                  )}
                </div>
                <div className='post-link right'>
                  {nextPath && (
                    <NextLink href={nextPath} as={nextPath.as}>
                      <a>next: {nextPath && nextPath.title}</a>
                    </NextLink>
                  )}
                </div>
              </div>
              <Divider>
                <img src='/favicon.ico' width='30px' />
              </Divider>
            </Col>
          </Row>
        </div>
      </>
    )
  );
}

import { getArticleById, getArticleList } from '../../../../request';

import marked from 'marked';
import hljs from 'highlight.js';
import createDOMPurify from 'dompurify';
import { JSDOM } from 'jsdom';
import MarkDownTOC from '../../../../helpers/MarkDownTOC';

export async function getStaticProps(context) {
  const { params } = context;
  const renderer = new marked.Renderer();
  const tocRenderer = new MarkDownTOC();
  renderer.heading = function (text, level) {
    return tocRenderer.renderHTML(text, level);
  };
  marked.setOptions({
    tables: true,
    breaks: false,
    smartLists: true,
    smartypants: false,
    langPrefix: 'hljs language-',
    highlight: function (code, lang) {
      const language = hljs.getLanguage(lang) ? lang : 'plaintext';
      return hljs.highlight(language, code).value;
    },
  });
  marked.use({ renderer });

  try {
    const [id] = params.slug;
    const post = await getArticleById(id);

    const window = new JSDOM('').window;
    const DOMPurify = createDOMPurify(window);
    const sanitizeOptions = {
      ADD_TAGS: ['iframe'],
      ADD_ATTR: ['allow', 'allowfullscreen', 'frameborder', 'scrolling'],
    };

    post.post_content = DOMPurify.sanitize(
      marked(post.post_content),
      sanitizeOptions
    );

    const { count, rows } = await getArticleList();
    const paths = rows.map(post => ({
      pathname: `/blog/post/[cname]/[...slug]`,
      query: {
        cname: post.category.category_name,
        slug: [post.id, post.post_title],
      },

      title: post.post_title,
      as: `/blog/post/${post.category.category_name}/${post.id}/${post.post_title}`,
    }));

    const currentPathIndex = paths.findIndex(
      path => path.query?.slug[0] == post.id
    );

    let previousPath = null,
      nextPath = null;
    if (currentPathIndex !== 0) {
      previousPath = paths[currentPathIndex - 1];
    }
    if (currentPathIndex !== paths.length - 1) {
      nextPath = paths[currentPathIndex + 1];
    }

    return {
      props: {
        post,
        tocTree: tocRenderer && tocRenderer.getTocItems(),
        previousPath,
        nextPath,
      },
    };
  } catch (error) {
    return {
      props: {
        msg: 'server error',
        post: null,
      },
    };
  }
}

export async function getStaticPaths() {
  try {
    const { count, rows } = await getArticleList();
    const paths = rows.map(post => ({
      params: {
        cname: encodeURIComponent(post.category.category_name),
        slug: [
          encodeURIComponent(post.id),
          encodeURIComponent(post.post_title),
        ],
      },
    }));
    return {
      paths: paths,
      fallback: false,
    };
  } catch (error) {
    return {
      paths: [],
      fallback: false,
    };
  }
}
import BlogLayout from '../../../../layout/BlogLayout';
Post.getLayout = function getLayout(page, categories) {
  return <BlogLayout categories={categories}>{page}</BlogLayout>;
};

export default Post;
