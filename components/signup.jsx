import { View, Text, TextInput, TouchableOpacity, Image, ScrollView, KeyboardAvoidingView, Platform, Alert } from 'react-native';
import React, { useState } from 'react';
import { SafeAreaView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';

const SignUp = () => {
  const navigation = useNavigation();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

const handleSubmit = async () => {
  if (!username || !email || !password) {
    Alert.alert('Validation Error', 'Please provide a username, email, and password');
    return;
  }

  try {
    const response = await axios.post('http://192.168.36.206:3000/api/users/sign-up', {
      username,
      email,
      password,
    });

    if (response.status === 201) {
      Alert.alert('Success', 'User created successfully');
      navigation.navigate('Login');
    } else {
      Alert.alert('Error', 'Unexpected response from the server');
    }
  } catch (error) {
    if (error.response) {
      Alert.alert('Error', error.response.data.message || 'Sign-up failed');
    } else if (error.request) {
      Alert.alert('Network Error', 'Please check your internet connection');
    } else {
      Alert.alert('Error', 'An unexpected error occurred');
    }
    console.error(error);
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
              <Text className="font-bold -mt-20 text-white tracking-widest text-5xl">SignUp</Text>
            </View>

            <View className="flex rounded-sm gap-6 w-auto justify-center">
              <View className="bg-black/10 px-4 w-80 py-2 rounded-full">
              <TextInput
                  className="text-lg text-gray-800"
                  placeholder="Email"
                  value={email}
                  onChangeText={setEmail}
                />
              </View>
              <View className="bg-black/10 px-4 w-80 py-2 rounded-full">
                <TextInput
                  className="text-lg text-gray-800"
                  placeholder="Username"
                  value={username}
                  onChangeText={setUsername}
                />
              </View>
              <View className="bg-black/10 px-4 w-80 py-2 rounded-full">
                <TextInput
                  className="text-lg text-gray-800"
                  placeholder="Password"
                  secureTextEntry={true}
                  value={password}
                  onChangeText={setPassword}
                />
              </View>
              <View className="flex items-center justify-center">
                <TouchableOpacity onPress={handleSubmit} className="bg-blue-500 px-4 py-2 text-center flex justify-center items-center rounded-full w-80">
                  <Text className="text-white text-xl font-bold">SignUp</Text>
                </TouchableOpacity>
                <View className='flex-row gap-2 mt-1'>
                  <Text>Already have an account?</Text>
                  <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                    <Text className='font-bold text-red-500'>Login</Text>
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

export default SignUp;
