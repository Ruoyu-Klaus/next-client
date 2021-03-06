import marked from 'marked'
import highlightSyntax from 'highlight.js'
import MarkDownTOC from './MarkDownTOC'

const markedOptions = {
    tables: true,
    breaks: false,
    smartLists: true,
    smartypants: false,
    langPrefix: 'hljs language-',
    highlight: function (code) {
        return highlightSyntax.highlightAuto(code).value
    },
}

export function getParsedContentWithTocTree(content) {
    const renderer = new marked.Renderer()

    const tocRenderer = new MarkDownTOC()
    renderer.heading = function (text, level) {
        return tocRenderer.renderHTML(text, level)
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
