import { View, Text, TextInput, TouchableOpacity, Image, ScrollView, KeyboardAvoidingView, Platform, Alert} from 'react-native';
import React, { useState } from 'react';
import { SafeAreaView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigation = useNavigation();

    const handleSubmit = async () => {
        if (!email || !password) {
            Alert.alert('Validation Error', 'Please provide an email and password');
            return;
        }

        try {
            
            const response = await axios.post('http://192.168.36.206:3000/api/users/log-in', {
                email,
                password
            });

            if (response.status === 200) {
                const token = response.data.data.token;
                const expiryIn=3600*1000;
                const expiryTime=Date.now()+expiryIn;

                const tokenData=JSON.stringify({token,expiryTime,email});
                
                await AsyncStorage.setItem('authToken', tokenData);

                navigation.navigate({ name: 'Dashboard' });
            } else {
                Alert.alert('Error', 'Invalid email or password');
            }
        } catch (error) {
            console.error('Login Error:', error);
            Alert.alert('Error', 'An error occurred while logging in');
        }
    };

    return (
        <SafeAreaView className="h-full w-full bg-white">
            <Image className="w-full h-full absolute" source={require('../assets/background.png')} />

            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={{ flex: 1 }}
                keyboardVerticalOffset={Platform.OS === 'ios' ? 60 : 0}
            >
                <ScrollView contentContainerStyle={{ flexGrow: 1 }} bounces={false}>
                    <View className="flex-row justify-between ml-3 absolute w-[350px]">
                        <Image className="h-[225] w-[90]" source={require('../assets/light.png')} />
                        <Image className="h-[160] w-[65]" source={require('../assets/light.png')} />
                    </View>

                    <View className="justify-around items-center w-full h-full flex pt-40 pb-10">
                        <View className="flex items-center">
                            <Text className="font-bold -mt-20 text-white tracking-widest text-5xl">Login</Text>
                        </View>

                        <View className="flex rounded-sm gap-6 w-auto justify-center">
                            <View className="bg-black/10 px-4 w-80 py-2 rounded-full">
                                <TextInput
                                    className="text-lg text-gray-800"
                                    placeholder="Email"
                                    keyboardType="email-address"
                                    onChangeText={setEmail}
                                />
                            </View>

                            <View className="bg-black/10 px-4 w-80 py-2 rounded-full">
                                <TextInput
                                    className="text-lg text-gray-800"
                                    placeholder="Password"
                                    secureTextEntry={true}
                                    onChangeText={setPassword}
                                />
                            </View>

                            <View className="flex items-center justify-center">
                                <TouchableOpacity onPress={handleSubmit} className="bg-blue-500 px-4 py-2 text-center flex justify-center items-center rounded-full w-80">
                                    <Text className="text-white text-xl font-bold">Login</Text>
                                </TouchableOpacity>

                                <View className='flex-row gap-2 mt-1'>
                                    <Text>Did not have an account?</Text>
                                    <TouchableOpacity onPress={() => navigation.navigate({ name: 'SignUp' })}>
                                        <Text className='font-bold text-red-500'>SignUp</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </View>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
};

export default Login;
