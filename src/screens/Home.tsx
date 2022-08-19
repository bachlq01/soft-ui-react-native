import React, {useCallback, useEffect, useState} from 'react';

import {useData, useTheme, useTranslation} from '../hooks/';
import {Block, Button, Image, Input, Product, Text} from '../components/';

const Home = () => {
  const {t} = useTranslation();
  const [tab, setTab] = useState<number>(0);
  const {following, trending} = useData();
  const [products, setProducts] = useState(following);
  const [listId, setData] = useState(following);
  const {assets, colors, fonts, gradients, sizes} = useTheme();

  const handleProducts = useCallback(
    (tab: number) => {
      setTab(tab);
      setProducts(tab === 0 ? following : trending);
    },
    [following, trending, setTab, setProducts],
  );

  useEffect(() => {
    fetch('https://us-central1-babu-33902.cloudfunctions.net/listId')
      .then((res) => res.json())
      .then((res) => {
        setData(res.message);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  return (
    <Block style={{backgroundColor: '#181818'}}>
      <Block
        scroll
        paddingHorizontal={sizes.padding}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{paddingBottom: sizes.l}}>
        <Block row wrap="wrap" justify="space-between" marginTop={sizes.sm}>
          {listId?.map((product,index) => (
            <Product key={`card-${product?.id}`} index={index} id={product?.id} listId={listId}/>
          ))}
        </Block>
      </Block>
    </Block>
  );
};

export default Home;
