import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Login from './components/login';
import Home from './components/home';
import OnBoarding from './components/onBoarding';
import SignUp from './components/signup';
import Dashboard from './components/dashboard';
import { ActivityIndicator, View } from 'react-native';

const Stack = createStackNavigator();

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(null);

  const getValidToken = async () => {
    try {
      const tokenData = await AsyncStorage.getItem('authToken');
      if (!tokenData) return null

      const { token, expiryTime } = JSON.parse(tokenData);
      if (Date.now() > expiryTime) {
        await AsyncStorage.removeItem('authToken');
        return null;
      }
      console.log("Token is:", token)
      const formattedExpiryTime = new Date(expiryTime).toLocaleString()
      console.log("Expiry Time is:", formattedExpiryTime);
      return token;
    } catch (error) {
      console.error('Error fetching token:', error);
      return null;
    }
  };

  useEffect(() => {
    const checkToken = async () => {
      try {
        const token = await getValidToken();
        if (token) {
          setIsLoggedIn(true);
          return
        } else {
          setIsLoggedIn(false);
          return
        }
      } catch (error) {
        console.error('Error checking token:', error);
        setIsLoggedIn(false);
        return
      }
    };

    checkToken();
  }, []);

  if (isLoggedIn === null) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  console.log('User Logged in:', isLoggedIn);

  return (
    <NavigationContainer>
      <Stack.Navigator>
        {isLoggedIn ? (
          <Stack.Screen
            name="Dashboard"
            component={Dashboard}
            options={{ headerShown: false }}
          />
          
        ) : (
          <>
            <Stack.Screen
              name="OnBoarding"
              component={OnBoarding}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="Login"
              component={Login}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="SignUp"
              component={SignUp}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="Home"
              component={Home}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="Dashboard"
              component={Dashboard}
              options={{ headerShown: false }}
            />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
