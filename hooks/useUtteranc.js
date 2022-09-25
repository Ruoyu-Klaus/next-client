import {useEffect} from 'react'
import {useColorMode} from '@chakra-ui/react'

export const useUtterances = (commentNodeId) => {
    const {colorMode} = useColorMode()
    useEffect(() => {
        const scriptParentNode = document.getElementById(commentNodeId)
        console.log({commentNodeId,scriptParentNode})
        if (!scriptParentNode) return
        const utteranceTheme = colorMode === 'dark' ? 'github-dark' : 'github-light'
        const script = document.createElement('script')
        script.src = 'https://utteranc.es/client.js'
        script.async = true
        script.setAttribute('repo', 'Ruoyu-Klaus/post-comments')
        script.setAttribute('issue-term', 'pathname')
        script.setAttribute('label', 'comment 💬')
        script.setAttribute('theme', utteranceTheme)
        script.setAttribute('crossorigin', 'anonymous')

        scriptParentNode.appendChild(script)
        return () => {
            scriptParentNode.removeChild(scriptParentNode.firstChild)
        }
    }, [commentNodeId, colorMode])
}
