import React, {useCallback, useEffect, useRef, useState} from 'react';
import {
  Alert,
  AsyncStorage,
  Button,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import YoutubePlayer, {
  YoutubeIframeRef,
  getYoutubeMeta,
} from 'react-native-youtube-iframe';

import Block from './Block';
import Image from './Image';
import {IProduct} from '../constants/types';
import {useTheme, useTranslation} from '../hooks/';

const Product = ({id}: {id: string}) => {
  const {t} = useTranslation();
  const {assets, colors, sizes} = useTheme();

  const playerRef = useRef<YoutubeIframeRef>(null);
  const [meta, setMeta] = useState(null);
  const [playing, setPlaying] = useState(false);
  const [status, setStatus] = useState(null);
  const [isReady, setisReady] = useState(false);
  const [quality, setquality] = useState(null);
  const [error, seterror] = useState(null);

  const CARD_WIDTH = (sizes.width - sizes.padding * 2 - sizes.sm) / 2;

  const onCLick = async () => {
    setPlaying(true)
  };

  useEffect(() => {
    getYoutubeMeta(id).then((meta) => {
      setMeta(meta);
    });
  }, [id]);

  const onStateChange = useCallback((state) => {
    setPlaying(false);
  }, []);

  const togglePlaying = useCallback(() => {
    setPlaying((prev) => !prev);
  }, []);

  return (
    <View
      // flex={0}
      // // row={isHorizontal}
      // marginBottom={sizes.sm + 10}
      // width={CARD_WIDTH * 2 + sizes.sm}
      style={{
        flex: 0,
        marginBottom: sizes.sm + 10,
        width: CARD_WIDTH * 2 + sizes.sm,
      }}>
      <YoutubePlayer
        ref={playerRef}
        height={210}
        width={CARD_WIDTH * 2 + sizes.sm}
        videoId={id}
        play={playing}
        onChangeState={async (e) => {
          if (e === 'playing') {
            const uid = await AsyncStorage.getItem('uid');            
            setTimeout(() => {
              fetch('https://us-central1-babu-33902.cloudfunctions.net/wallet', {
                method: 'POST',
                credentials: 'same-origin',
                mode: 'same-origin',
                headers: {
                  Accept: 'application/json',
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({uid, balance: 10}),
              })
                .then((res) => res.json())
                .then((res) => {
                  console.log(res)
                });
            }, 5000);
          }
        }}
        onError={(e) => console.log(e)}
        onPlaybackQualityChange={(q) => console.log('q', q)}
        volume={50}
        playbackRate={1}
        allowWebViewZoom
      />
      <Text style={styles.baseText}>{meta?.title}</Text>
      {/* <Button title={playing ? "pause" : "play"} onPress={onCLick} /> */}
      {/* <Button
        title="log details"
        onPress={() => {
          playerRef.current?.getCurrentTime().then(
            currentTime => console.log({currentTime})
          );

          playerRef.current?.getDuration().then(
            getDuration => console.log({getDuration})
          );
        }}
      /> */}
    </View>
  );
};

const styles = StyleSheet.create({
  baseText: {
    fontWeight: 'bold',
    color: '#fff',
    fontSize: 16,
  },
  innerText: {
    color: 'red',
  },
});

export default Product;
