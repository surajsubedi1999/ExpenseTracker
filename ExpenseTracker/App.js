import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';

import SignInScreen from './src/screens/SignInScreen';
import DashboardScreen from './src/screens/DashboardScreen';
import TransactionDetailScreen from './src/screens/TransactionDetailScreen';
import AddTransactionScreen from './src/screens/AddTransactionScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <StatusBar style="auto" />
      <Stack.Navigator initialRouteName="SignIn">
        <Stack.Screen 
          name="SignIn" 
          component={SignInScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen 
          name="Dashboard" 
          component={DashboardScreen}
          options={{ title: 'Expense Dashboard' }}
        />
        <Stack.Screen 
          name="TransactionDetail" 
          component={TransactionDetailScreen}
          options={{ title: 'Transaction Details' }}
        />
        <Stack.Screen 
          name="AddTransaction" 
          component={AddTransactionScreen}
          options={{ title: 'Add New Transaction' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}