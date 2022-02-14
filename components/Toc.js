import React from 'react'

const Toc = ({tocTree}) => (
    <ul>
        {tocTree.map((item) => (
            <li key={item.anchor}>
                <a
                    href={`#${item.anchor}`}
                    onClick={(e) => {
                        e.preventDefault()
                        document.getElementById(`${item.anchor}`).scrollIntoView({
                            behavior: 'smooth',
                        })
                    }}
                >
                    {item.text}
                </a>
                {item.children && <Toc tocTree={item.children} />}
            </li>
        ))}
    </ul>
)

export default Toc
