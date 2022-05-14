import React from 'react'
import {useUtterances} from '../hooks/useUtteranc'

export default function Comments() {
    useUtterances('comments')

    return <div style={{width: '100%'}} id="comments" />
}
