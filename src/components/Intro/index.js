import React, { useState, useMemo, useEffect } from 'react'
import styled, { keyframes } from 'styled-components';
import { Box, Text } from 'grommet';

const TextWrapper = styled(Box)`
  position: relative;
  height: ${props => props.wrapperHeight};
  overflow: hidden;
`;
const rollOut = keyframes`
  0% {
    opacity: 0;
    transform: translateY(0);
  }
  20% {
    opacity: 1;
    transform: translateY(-50%);
  }
  80% {
    opacity: 1;
    transform: translateY(-50%);
  }
  100% {
    opacity: 0;
    transform: translateY(-100%);
  }
`;
const AnimatedText = styled(Text)`
  position: absolute;
  top: 50%; left: 0; right: 0;
  width: 100%;
  box-sizing: border-box;
  padding: 0 24px;
  text-align: center;
  opacity: 0;
  transform: translateY(-50%);
  animation: 5s ${props => props.index * 5}s ${rollOut} ${props => props.theme.global.easing} forwards;
`;

function Intro(props) {
  const [int, setInt] = useState();
  const [key, setKey] = useState(1);
  const texts = useMemo(() => [
    'Bir Bilgin yarışmasına daha hoş geldiniz',
    'Yarışmamıza ilk defa katılacak olanlar için yarışmamızı hızlıca anlatalım',
    'Yarışmamız bir soru ve üç şıktan oluşan serilerden oluşuyor',
    'Soru ekrana geldikten sonra soruyu dinleyebiliyorsunuz',
    'Soru okunurken cevaplama yapamazsınz',
    'Okuma bittikten sonra belirtilen sürede soruyu cevaplamalısınız',
    'Soruyu ne kadar kısa sürede cevaplar iseniz o kadar fazla puan alırsınız',
    'Soruya verdiğiniz cevap esnasında geri sayım sayacı hangi saniyede ise puanınızda o saniyedir',
    'Bir soruya bir defa cevap verebilirsiniz',
    'Verdiğiniz cevabı değiştiremezsiniz',
    'Yarışmamızda eleme yoktur.',
    'Yarışmaya sonuna kadar devam ederek puan toplamaya devam edersiniz',
    'Ne kadar soruya doğru cevap verirseniz o kadar fazla puan alırsınız',
    'Böylece haftanın, ayın ve tüm yarışmaların birincileri ortaya çıkacaktır',
    'Ayrıca her yarışmada iki tane jokeriniz bulunmaktadır',
    'Her joker bir defa kullanılabilir',
    'Çift cevap jokeri ile bir sorunun iki ayrı şıkkını işaretleyebilirsiniz',
    'Eleme jokeriyle ise yanlış şıklardan birini eleyebilirsiniz',
    'Böylece her iki jokeri de bir yarışmada birer defa kullanarak puanınızı korumuş olursunuz',
  ], [])

  useEffect(() => {
    const newInt = setInterval(() => {
      setKey(oldKey => oldKey + 1);
    }, texts.length * 5 * 1000);
    setInt(newInt);

    return () => {
      clearInterval(int);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key, texts])

  return (
    <TextWrapper key={key} {...props}>
      {texts.map((text, index) => (
        <AnimatedText key={index} index={index}>{text}</AnimatedText>
      ))}
    </TextWrapper>
  )
}

Intro.defaultProps = {
  wrapperHeight: '30vh',
}

export default Intro
