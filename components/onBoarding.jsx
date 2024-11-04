import { View, Text, FlatList, Image } from 'react-native';
import React, { useState } from 'react';
import slides from './slides';
import OnBoardingItem from './onBoardingItem';
const pngwing = require('../assets/pngwing.png');
import { useNavigation } from '@react-navigation/native';
import { TouchableOpacity } from 'react-native';

const OnBoarding = () => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const navigation=useNavigation()

    const onScroll = (e) => {
        const index = Math.round(e.nativeEvent.contentOffset.x / e.nativeEvent.layoutMeasurement.width);
        setCurrentIndex(index);
    };

    return (
        <View className="flex-1 bg-white">
            <View className="items-center justify-center">
                <Image
                    source={pngwing}
                    style={{ width: 150, height: 150, resizeMode: 'contain' }}
                />
                <Text className='font-extrabold tracking-tighter text-4xl -mt-10'>Mystery Message</Text>
            </View>

            <View className="flex-[0.9]">
                <FlatList
                    data={slides}
                    renderItem={({ item }) => <OnBoardingItem item={item} />}
                    horizontal
                    pagingEnabled
                    onScroll={onScroll}
                    bounces={false}
                    showsHorizontalScrollIndicator={false}
                    scrollEventThrottle={16}
                    keyExtractor={(_, index) => index.toString()}
                    className="bg-white"
                />
            </View>
            <View>
                {currentIndex === slides.length - 1 && (
                    <View className="flex-1 justify-center items-center">
                        <TouchableOpacity className='bg-blue-500 p-3 text-center flex justify-center items-center rounded-full -mt-12' onPress={() => navigation.navigate({name:'Home'})}>
                            <Text className='text-white font-bold'>Get Started</Text>
                        </TouchableOpacity>
                    </View>
                )}
            </View>
            <View className="flex-[0.1] flex-row justify-center items-center space-x-2">
                {slides.map((item, index) => (
                    <View
                        key={index}
                        className={`${index === currentIndex ? 'w-4 h-4' : 'w-3 h-3'} rounded-full ${index === currentIndex ? 'bg-gray-900' : 'bg-gray-300'}`}
                    />
                ))}
            </View>
        </View>
    );
};

export default OnBoarding;
