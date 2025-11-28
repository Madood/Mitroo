/**
 * Mitroo Chat App
 * React Native Chat Application
 */

import React from 'react';
import { SafeAreaView, StatusBar, StyleSheet, useColorScheme } from 'react-native';
import { Colors } from 'react-native/Libraries/NewAppScreen';
import LoginScreen from './src/Screens/auth/LoginScreen';
import SignupScreen from './src/Screens/auth/SignupScreen';
import { ConversationsScreen } from './src/Screens/chat/ConversationScreen';
import { ChatScreen } from './src/Screens/chat/ChatScreen';
import { SettingsScreen } from './src/Screens/settings/SettingScreen';
import { CallScreen } from './src/Screens/call/CallScreen';
import { ContactsScreen } from './src/Screens/contacts/contactsScreen'; // Add this import
import { useStore } from './src/store/useStore';

// Define the complete view type
type AppView = 'login' | 'signup' | 'conversations' | 'chat' | 'settings' | 'call' | 'contacts';

function App(): JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';
  const currentView = useStore(state => state.currentView);
  const isAuthenticated = useStore(state => state.isAuthenticated);

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  const renderCurrentScreen = () => {
    if (!isAuthenticated) {
      switch (currentView) {
        case 'signup':
          return <SignupScreen />;
        case 'login':
        default:
          return <LoginScreen />;
      }
    } else {
      // Use type assertion to ensure we handle all view types
      const view = currentView as AppView;
      
      switch (view) {
        case 'conversations':
          return <ConversationsScreen />;
        case 'chat':
          return <ChatScreen />;
        case 'settings':
          return <SettingsScreen />;
        case 'call':
          return <CallScreen />;
        case 'contacts': // Add contacts case
          return <ContactsScreen />;
        default:
          return <ConversationsScreen />;
      }
    }
  };

  return (
    <SafeAreaView style={[styles.container, backgroundStyle]}>
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor={backgroundStyle.backgroundColor}
      />
      {renderCurrentScreen()}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default App;