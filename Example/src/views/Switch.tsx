/* eslint-disable react-native/no-inline-styles */
import React, {useState, useRef} from 'react';
import {View, Text, Switch, StyleSheet, Animated} from 'react-native';
import {Svg, Circle} from 'react-native-svg';

const CirCleLength = Math.PI * 2 * 16;
interface Props {}
let AnimatedCircle = Animated.createAnimatedComponent(Circle);

const SwitchComponent = (props: Props) => {
  const animatedRef = useRef(new Animated.Value(51));
  const circleAnimationRef = useRef(new Animated.Value(CirCleLength * 1));
  const [switchStatus, setSwitchStatus] = useState(false);
  let loopAnimation: Animated.CompositeAnimation | null = null;

  const onChangeValue = (value: boolean) => {
    setSwitchStatus(value);
    Animated.timing(animatedRef.current, {
      duration: 300,
      toValue: value ? 31 : 51,
      useNativeDriver: false,
    }).start(() => startLoopAnimation(value));
  };

  const startLoopAnimation = (value: boolean) => {
    Animated.sequence([
      Animated.timing(circleAnimationRef.current, {
        duration: 3200,
        toValue: CirCleLength * (value ? -1 : 1),
        useNativeDriver: false,
      }),
    ]).start();
  };

  const dashArrayAnimation = circleAnimationRef.current.interpolate({
    inputRange: [0, CirCleLength],
    outputRange: [10, 1],
    extrapolate: 'clamp',
  });

  return (
    <View style={styles.center}>
      <Switch
        value={switchStatus}
        onValueChange={(value) => onChangeValue(value)}
      />
      <Animated.View
        style={{
          width: animatedRef.current,
          height: 31,
          backgroundColor: '#1bcd6f',
          borderRadius: 15.5,
          justifyContent: 'center',
        }}>
        <View
          style={{
            width: 31,
            height: 31,
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <View
            style={{
              height: 27,
              width: 27,
              borderRadius: 13.5,
              backgroundColor: '#FFF',
            }}
          />
          <Svg
            style={{...StyleSheet.absoluteFillObject}}
            viewBox="0 0 31 31"
            width={31}
            height={31}>
            <AnimatedCircle
              rotation="135"
              cx={15.5}
              cy={15.5}
              r={14}
              stroke="#a4a4a4"
              origin={'15.5,15.5'}
              strokeWidth={3}
              strokeLinecap="square"
              strokeDasharray={[Math.PI * 2 * 15.5]}
              strokeDashoffset={0}
              fill="transparent"
            />
            <AnimatedCircle
              rotation="270"
              cx={15.5}
              cy={15.5}
              r={14}
              stroke="#53bef9"
              origin={'15.5,15.5'}
              strokeWidth={3}
              strokeLinecap="square"
              strokeDasharray={[CirCleLength, CirCleLength]}
              strokeDashoffset={circleAnimationRef.current}
              fill="transparent"
            />
          </Svg>
        </View>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
export default SwitchComponent;
