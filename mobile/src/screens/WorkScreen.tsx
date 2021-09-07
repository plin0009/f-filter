import React from 'react';
import {SafeAreaView, StyleSheet, Image} from 'react-native';
import {StackNavigationProp} from '@react-navigation/stack';
import {StackParamList} from 'src/types';
import {RouteProp} from '@react-navigation/native';

interface WorkScreenProps {
  navigation: StackNavigationProp<StackParamList, 'Work'>;
  route: RouteProp<StackParamList, 'Work'>;
}

const WorkScreen = ({navigation, route}: WorkScreenProps) => {
  const {data, uri, width, height} = route.params;

  return (
    <SafeAreaView style={styles.containerWrapper}>
      <Image style={styles.image} source={{uri}} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  containerWrapper: {
    flex: 1,
    alignSelf: 'stretch',
  },
  image: {flex: 1, alignSelf: 'stretch', resizeMode: 'contain'},
});

export default WorkScreen;
