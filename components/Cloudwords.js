/*
 * @Author: Ruoyu
 * @FilePath: \next-client\components\Cloudwords.js
 */
import { useState, useEffect, useContext } from 'react';
import ReactWordcloud from 'react-wordcloud';
import 'tippy.js/dist/tippy.css';
import 'tippy.js/animations/scale.css';
import useBreakpoint from '../hooks/useBreakPoint';

import { ThemeContext } from '../context/theme/ThemeContext';

function WordCloud({ keywords = [], setSearchTerm }) {
  const [renderKeywords, setRenderKeywords] = useState(null);
  const bp = useBreakpoint();

  const {
    theme: { isDarkMode },
  } = useContext(ThemeContext);

  const getUniqueKeywords = keywords => {
    return keywords.filter((keyword, index, originalArray) => {
      const indexOfDuplicateWord = originalArray.findIndex(
        originalKeyword => originalKeyword.word === keyword.word
      );
      return indexOfDuplicateWord === index;
    });
  };

  useEffect(() => {
    if (bp === 'xs' || bp === 'sm') {
      setRenderKeywords(getUniqueKeywords(keywords.slice(0, 20)));
    } else {
      setRenderKeywords(getUniqueKeywords(keywords));
    }
  }, [keywords, bp]);

  const callbacks = {
    getWordColor: word => (isDarkMode ? 'white' : 'black'),
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
