/*
 * @Author: your name
 * @Date: 2021-08-27 11:31:21
 * @LastEditTime: 2021-08-27 15:49:08
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \myblog\client\helpers\MarkDownTOC.js
 */
import { last } from 'lodash';

export default class MarkDownTOC {
  tocItems = [];
  index = 0;
  maxdepth = 6;

  constructor(maxdepth = 6) {
    this.tocItems = [];
    this.index = 0;
    this.maxdepth = maxdepth;
  }
  getTocItems() {
    return this.tocItems;
  }

  add(text, level) {
    const anchor = `level-${level}-index-${++this.index}-text-${text
      .toLowerCase()
      .replace(/[^\w]+/g, '')}`;
    const item = { anchor, level, text };
    const items = this.tocItems;

    if (items.length === 0) {
      // 第一个 item 直接 push
      items.push(item);
    } else {
      let lastItem = last(items);
      // 与当前最后一个比较 level越大越小
      if (item.level > lastItem.level) {
        for (let i = lastItem.level + 1; i <= this.maxdepth; i++) {
          const { children } = lastItem;
          if (!children) {
            lastItem.children = [item];
            break;
          }
          lastItem = last(children);
          if (item.level <= lastItem.level) {
            children.push(item);
            break;
          }
        }
      } else {
        items.push(item);
      }
    }
    return anchor;
  }

  renderHTML = (text, level) => {
    try {
      const anchor = this.add(text, level);
      return `
    <h${level} id=${anchor}>
    <a name="${anchor}" class="anchor" href="#${anchor}">
      <span class="header-link"></span>
    </a>
      ${text}
    </h${level}>\n`;
    } catch (error) {
      return `
      <h${level}>
        ${text}
      </h${level}>`;
    }
  };

  // renderToc(items) {
  //   // 递归 render
  //   return items.map(item => (
  //     <Link key={item.anchor} href={`#${item.anchor}`} title={item.text}>
  //       {item.children && this.renderToc(item.children)}
  //     </Link>
  //   ));
  // }

  // render() {
  //   return (
  //     <Anchor affix showInkInFixed>
  //       {this.renderToc(this.tocItems)}
  //     </Anchor>
  //   );
  // }

  reset = () => {
    this.tocItems = [];
    this.index = 0;
  };
}
