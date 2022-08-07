import React, {useRef, useState} from 'react';
import {Button, TouchableOpacity} from 'react-native';
import YoutubePlayer from 'react-native-youtube-iframe';

import Block from './Block';
import Image from './Image';
import Text from './Text';
import {IProduct} from '../constants/types';
import {useTheme, useTranslation} from '../hooks/';

const Product = ({image, title, type, linkLabel}: IProduct) => {
  const {t} = useTranslation();
  const {assets, colors, sizes} = useTheme();

  const video = useRef();
  const [status, setStatus] = useState(null);
  const [isReady, setisReady] = useState(false);
  const [quality, setquality] = useState(null);
  const [error, seterror] = useState(null);

  const isHorizontal = type !== 'vertical';
  const CARD_WIDTH = (sizes.width - sizes.padding * 2 - sizes.sm) / 2;

  const onCLick = async () => {
    console.log(await video.current?.getCurrentTime());
  };

  return (
    <Block
      // card
      flex={0}
      // row={isHorizontal}
      marginBottom={sizes.sm}
      width={CARD_WIDTH * 2 + sizes.sm}>
      <YoutubePlayer
        ref={video}
        videoId="mLI_QxszYrU" // The YouTube video ID
        play={true} // control playback of video with true/false
        height={300}
      />
      <TouchableOpacity onPress={onCLick}>
        <Text>asdasd</Text>
      </TouchableOpacity>
    </Block>
  );
};

export default Product;
