import { View, Text, Image, SafeAreaView } from 'react-native';
import React from 'react';
import { useWindowDimensions } from 'react-native';

const OnBoardingItem = ({ item }) => {
  const {width} = useWindowDimensions();
  return (
    <SafeAreaView>
      <View className="flex-1 justify-center items-center bg-white px-6" style={{ width }}>
        <Image
          source={item.image}
          resizeMode="contain"
          className="w-5/6 h-80 mb-8 self-center "
        />
        <Text className="text-3xl text-blue-700 tracking-wider font-bold text-center mb-4">{item.title}</Text>
        <Text className="font-semibold text-xl text-center text-gray-600 max-w-screen">
          {item.description}
        </Text>
      </View>
    </SafeAreaView>
  );
};

export default OnBoardingItem;
