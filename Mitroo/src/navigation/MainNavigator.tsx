import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';

import { ChatScreen } from '../Screens/chat/ChatScreen';
import { ConversationsScreen } from '../Screens/chat/ConversationScreen';
import { CallScreen } from '../Screens/call/CallScreen';
import { IncomingCallScreen } from '../Screens/call/IncomingCallScreen';
import { SettingsScreen } from '../Screens/settings/SettingScreen';
import { ContactsScreen } from '../Screens/contacts/contactsScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function HomeTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: keyof typeof Ionicons.glyphMap;

          if (route.name === 'Conversations') {
            iconName = focused ? 'chatbubbles' : 'chatbubbles-outline';
          } else if (route.name === 'Contacts') {
            iconName = focused ? 'people' : 'people-outline';
          } else if (route.name === 'Settings') {
            iconName = focused ? 'settings' : 'settings-outline';
          } else {
            iconName = 'help-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#007AFF',
        tabBarInactiveTintColor: 'gray',
      })}
    >
      <Tab.Screen name="Conversations" component={ConversationsScreen} />
      <Tab.Screen name="Contacts" component={ContactsScreen} />
      <Tab.Screen name="Settings" component={SettingsScreen} />
    </Tab.Navigator>
  );
}

export default function MainNavigator() {
  return (
    <Stack.Navigator 
      screenOptions={{ 
        headerShown: false,
        animation: 'slide_from_right'
      }}
    >
      <Stack.Screen name="Home" component={HomeTabs} />
      
      {/* Chat Section */}
      <Stack.Screen name="Chat" component={ChatScreen} />
      
      {/* Call Section */}
      <Stack.Screen 
        name="IncomingCall" 
        component={IncomingCallScreen}
        options={{ gestureEnabled: false }}
      />
      <Stack.Screen 
        name="Call" 
        component={CallScreen}
        options={{ gestureEnabled: false }}
      />
    </Stack.Navigator>
  );
}