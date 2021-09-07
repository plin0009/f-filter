import React from 'react';
import {StyleSheet, SafeAreaView, ScrollView, Text, Button} from 'react-native';
import ImagePicker from 'react-native-image-picker';
import {StackNavigationProp} from '@react-navigation/stack';
import {StackParamList} from 'src/types';

interface HomeScreenProps {
  navigation: StackNavigationProp<StackParamList, 'Home'>;
}

const HomeScreen = ({navigation}: HomeScreenProps) => {
  return (
    <SafeAreaView style={styles.containerWrapper}>
      <ScrollView
        alwaysBounceVertical={false}
        contentInsetAdjustmentBehavior="always"
        contentContainerStyle={styles.container}>
        <Text style={styles.title}>F-Filter</Text>
        <Button
          title="Choose an image"
          onPress={() => {
            ImagePicker.showImagePicker(
              {
                title: 'Choose photo',
                storageOptions: {
                  skipBackup: true,
                  path: 'images',
                },
              },
              (response) => {
                if (response.didCancel) {
                  console.log('Image picker cancelled');
                } else if (response.error) {
                  console.log(`Image picker error: ${response.error}`);
                } else {
                  console.log(`Image picker selected image: ${response.uri}`);
                  navigation.navigate('Work', {
                    data: response.data,
                    uri: response.uri,
                    width: response.width,
                    height: response.height,
                  });
                }
              },
            );
          }}
        />
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
