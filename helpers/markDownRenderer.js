import marked from 'marked'
import highlightSyntax from 'highlight.js'
import MarkDownTOC from './MarkDownTOC'

const markedOptions = {
    tables: true,
    breaks: false,
    smartLists: true,
    smartypants: false,
    langPrefix: 'hljs language-',
    highlight: function(code) {
        return highlightSyntax.highlightAuto(code).value
    },
}

export function getParsedContentWithTocTree(content) {
    if (!content) return {parsedContent: null, tocTree: null}
    const renderer = new marked.Renderer()

    const tocRenderer = new MarkDownTOC()
    renderer.heading = function(text, level) {
        return tocRenderer.renderHTML(text, level)
    }
    renderer.image = function(href, title, text) {
        return `<img src=/${href} alt=${text}/>`
    }
    marked.setOptions(markedOptions)
    marked.use({renderer})
    return {parsedContent: marked(content), tocTree: getTocTree(tocRenderer)}
}

export function getTocTree(tocRenderer) {
    if (tocRenderer && tocRenderer instanceof MarkDownTOC) {
        return tocRenderer.getTocItems()
    }
    return null
}
