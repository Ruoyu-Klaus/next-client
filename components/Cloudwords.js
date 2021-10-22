import { useState, useEffect } from 'react';
import ReactWordcloud from 'react-wordcloud';

import useBreakpoint from '../hooks/useBreakPoint';
import { Box, useColorMode } from '@chakra-ui/react';

function WordCloud({ keywords = [], setSearchTerm }) {
  const [renderKeywords, setRenderKeywords] = useState(null);
  const bp = useBreakpoint();

  const { colorMode } = useColorMode();

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
    getWordColor: word => (colorMode === 'light' ? 'black' : 'white'),
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
    <Box h='280px' w='full'>
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
    </Box>
  ) : (
    <></>
  );
}

export default WordCloud;
