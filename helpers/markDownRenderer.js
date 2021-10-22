import marked from 'marked';
import hljs from 'highlight.js';
import MarkDownTOC from './MarkDownTOC';

import createDOMPurify from 'dompurify';
import { JSDOM } from 'jsdom';

export async function getParsedContentWithTocTree(content) {
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

  const parsedContent = await marked(content);

  const tocTree = getTocTree(tocRenderer);

  const window = new JSDOM('').window;
  const DOMPurify = createDOMPurify(window);
  const sanitizeOptions = {
    ADD_TAGS: ['iframe'],
    ADD_ATTR: ['allow', 'allowfullscreen', 'frameborder', 'scrolling'],
  };
  const santizedContent = await DOMPurify.sanitize(
    parsedContent,
    sanitizeOptions
  );
  return { santizedContent, tocTree };
}

export function getTocTree(tocRenderer) {
  if (tocRenderer && tocRenderer instanceof MarkDownTOC) {
    return tocRenderer.getTocItems();
  }
  return null;
}
