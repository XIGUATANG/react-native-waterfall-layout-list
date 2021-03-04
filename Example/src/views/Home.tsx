import React, { useEffect, useState } from 'react';
import { View, ActivityIndicator, Text } from 'react-native';
import WaterFallList from 'react-native-waterfall-layout-list';
import throttle from 'lodash/throttle';
import { colors } from './colors';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface Props { }

interface Item {
  _height: number;
  _color: string;
}

const getRandowColor = () => {
  return colors[Math.floor(Math.random() * colors.length)];
};

const renderItem = ({ item,index }: { item: Item,index:number }) => {
  const { _height, _color } = item;
  return (
    <View style={{ height: _height, padding: 2 }}>
      <View
        style={{
          flex: 1,
          backgroundColor: _color,
          borderRadius: 4,
          alignItems:'center',
          justifyContent:'center'
        }}
      >
        <Text style={{fontSize:22,fontFamily:'DINAlternate-bold',color:'#FFF'}}>{index}</Text>
      </View>
    </View>
  );
};
const loadData: () => Item[] = () => {
  let res: Item[] = [];
  for (let i = 0; i < 20; i++) {
    res.push({
      _height: 100 + Math.floor(100 * Math.random()),
      _color: getRandowColor(),
    });
  }
  return res;
};

const ListFooter = () => {
  const { bottom } = useSafeAreaInsets();

  return (
    <View
      style={{
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: bottom,
        marginTop: 20,
      }}>
      <ActivityIndicator style={{ width: 20, height: 20 }} size="small" />
      <Text style={{ color: '#999999', fontSize: 12 }}>正在加载更多</Text>
    </View>
  );
};

const initData = loadData();

const Home = () => {
  const [data, setData] = useState(initData);

  useEffect(() => {
    return () => {
      // timer && clearTimeout(timer);
    };
  }, []);
  let loadMoreData = () => {
    setData([...data, ...loadData()]);
  };
  loadMoreData = throttle(loadMoreData, 1000, { leading: true, trailing: false });
  const getHeight = (item: Item) => item._height;
  return (
    <View style={{ flex: 1 }}>
      <WaterFallList
        renderItem={renderItem}
        data={data}
        windowSize={5}
        keyExtractor={(item, index) => `${index}`}
        onEndReached={loadMoreData}
        ListFooterComponent={<ListFooter />}
        numColumns={2}
        getHeight={getHeight}
      />
    </View>
  );
};

export default Home;
