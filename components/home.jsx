import { View, Text, SafeAreaView, StatusBar, Image, TouchableOpacity } from 'react-native';
import React from 'react';

const pngwing = require('../assets/pngwing.png');
const homepic = require('../assets/homepic.png');
import { useNavigation } from '@react-navigation/native';

const Home = () => {
    const navigation=useNavigation()
    return (
        <>
            <StatusBar backgroundColor="white" barStyle="dark-content" />
            <SafeAreaView className="flex-1 bg-white">
                <View className="items-center justify-center">
                    <Image
                        source={pngwing}
                        style={{ width: 150, height: 150, resizeMode: 'contain' }}

                    />
                    <Text className=' font-bold text-4xl -mt-10'>Mystery Message</Text>
                </View>
                <View className='flex justify-center items-center'>
                    <Image
                        source={homepic}
                        style={{ width: 400, height: 400, resizeMode: 'contain' }}
                    />
                </View>
                <View>
                    <Text className=" text-center text-3xl font-semibold text-blue-700 tracking-wider mt-4">Welcome to the World of Anonymous Message!!!</Text>
                </View>
                <View className='flex-row justify-evenly items-center'>
                    <TouchableOpacity onPress={()=> navigation.navigate({name:'Login'})} className='bg-blue-500 p-3 text-center flex justify-center items-center rounded-full mt-4 w-[100px]'>
                        <Text className='text-white font-bold'>Login</Text>
                    </TouchableOpacity>
                    <TouchableOpacity className='bg-blue-500 p-3 text-center flex justify-center items-center rounded-full mt-4 w-[100px]' onPress={()=>navigation.navigate({name:'SignUp'})}>
                        <Text className='text-white font-bold'>Sign Up</Text>
                    </TouchableOpacity>
                </View>
            </SafeAreaView>
        </>
    );
};

export default Home;
