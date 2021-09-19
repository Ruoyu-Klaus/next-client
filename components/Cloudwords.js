/*
 * @Author: Ruoyu
 * @FilePath: \next-client\components\Cloudwords.js
 */
import { useState, useEffect } from 'react';
import { Skeleton } from 'antd';
import ReactWordcloud from 'react-wordcloud';
import 'tippy.js/dist/tippy.css';
import 'tippy.js/animations/scale.css';
import useBreakpoint from '../hooks/useBreakPoint';

function WordCloud({ keywords, setSearchTerm, loading }) {
  const [renderKeywords, setRenderKeywords] = useState(null);
  const bp = useBreakpoint();
  useEffect(() => {
    if (keywords) {
      if (bp === 'xs' || bp === 'sm') {
        setRenderKeywords(keywords.slice(0, 20));
      } else {
        setRenderKeywords(keywords);
      }
    }
  }, [keywords, bp]);

  const callbacks = {
    getWordColor: word => (word.value > 0 ? 'black' : 'red'),
    onWordClick: word => setSearchTerm(word.text),
    getWordTooltip: word => `${word.text}`,
  };

  const options = {
    deterministic: true,
    randomSeed: 'seed1',
    scale: 'log',
    spiral: 'archimedean',
    fontSizes: [12, 38],
    rotations: 0,
    rotationAngles: [0, 0],
  };

  if (loading && !keywords) {
    return (
      <>
        <Skeleton loading={loading} paragraph={false} active />
      </>
    );
  }
  return renderKeywords ? (
    <div style={{ height: '260px', width: '100%' }}>
      <ReactWordcloud
        words={renderKeywords.map(keyword => {
          return {
            text: Object.entries(keyword)[0][1],
            value: Object.entries(keyword)[1][1],
          };
        })}
        callbacks={callbacks}
        options={options}
      />
    </div>
  ) : (
    <></>
  );
}

export default WordCloud;
