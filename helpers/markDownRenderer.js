import marked from 'marked'
import hljs from 'highlight.js'
import MarkDownTOC from './MarkDownTOC'

import createDOMPurify from 'dompurify'
import { JSDOM } from 'jsdom'

const markdedOptions = {
  tables: true,
  breaks: false,
  smartLists: true,
  smartypants: false,
  langPrefix: 'hljs language-',
  highlight: function (code, lang) {
    const language = hljs.getLanguage(lang) ? lang : 'plaintext'
    return hljs.highlight(language, code).value
  },
}

export async function getParsedContentWithTocTree(content) {
  const renderer = new marked.Renderer()
  const tocRenderer = new MarkDownTOC()
  renderer.heading = function (text, level) {
    return tocRenderer.renderHTML(text, level)
  }
  marked.setOptions(markdedOptions)
  marked.use({ renderer })

  const parsedContent = await marked(content)
  const santizedContent = await sanitizeContent(parsedContent)
  const tocTree = getTocTree(tocRenderer)

  return { santizedContent, tocTree }
}

async function sanitizeContent(parsedContent) {
  const window = new JSDOM('').window
  const DOMPurify = createDOMPurify(window)
  const sanitizeOptions = {
    ADD_TAGS: ['iframe'],
    ADD_ATTR: ['allow', 'allowfullscreen', 'frameborder', 'scrolling'],
  }
  const santizedContent = await DOMPurify.sanitize(
    parsedContent,
    sanitizeOptions
  )
  return santizedContent
}

export function getTocTree(tocRenderer) {
  if (tocRenderer && tocRenderer instanceof MarkDownTOC) {
    return tocRenderer.getTocItems()
  }
  return null
}
