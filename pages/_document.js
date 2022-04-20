import Document, {Head, Html, Main, NextScript} from 'next/document'

const isProduction = process.env.NODE_ENV === 'production'
class MyDocument extends Document {
    render() {
        return (
            <Html>
                <Head>
                    {isProduction && (
                        <>
                            <script async src="https://www.googletagmanager.com/gtag/js?id=G-TVHYT0JX36" />
                            <script
                                dangerouslySetInnerHTML={{
                                    __html: `window.dataLayer = window.dataLayer || [];
                          function gtag(){dataLayer.push(arguments);}
                          gtag('js', new Date());
                          gtag('config', 'G-TVHYT0JX36');`,
                                }}
                            />
                        </>
                    )}
                </Head>
                <body>
                    <Main />
                    <NextScript />
                </body>
            </Html>
        )
    }
}

export default MyDocument
