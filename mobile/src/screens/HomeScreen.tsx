import React from 'react';
import {
  StyleSheet,
  SafeAreaView,
  ScrollView,
  View,
  Text,
  Button,
} from 'react-native';

const HomeScreen = () => {
  return (
    <SafeAreaView style={styles.containerWrapper}>
      <ScrollView
        alwaysBounceVertical={false}
        contentInsetAdjustmentBehavior="always"
        contentContainerStyle={styles.container}>
        <Text style={styles.title}>F-Filter</Text>
        <Button title="Choose an image" onPress={() => {}} />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  containerWrapper: {
    flex: 1,
    alignSelf: 'stretch',
  },
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 60,
  },
});

export default HomeScreen;
