
/**
 * Mitroo Chat App
 * React Native Chat Application
 */

import React from 'react';
import { SafeAreaView, StatusBar, StyleSheet, useColorScheme } from 'react-native';
import { Colors } from 'react-native/Libraries/NewAppScreen';
import { LoginScreen } from './src/Screens/auth/LoginScreen';
import { SignupScreen } from './src/Screens/auth/SignupScreen';
import { ConversationsScreen } from './src/Screens/ConversationScreen';
import { ChatScreen } from './src/Screens/ChatScreen';
import { SettingsScreen } from './src/Screens/SettingScreen';
import { CallScreen } from './src/Screens/CallScreen';
import { useStore } from './src/store/useStore';

// Temporary type extension since your View type might be missing some values
type ExtendedView = 'login' | 'signup' | 'conversations' | 'chat' | 'settings' | 'call' | 'contacts';

function App(): JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';
  const currentView = useStore(state => state.currentView);
  const isAuthenticated = useStore(state => state.isAuthenticated);
  const setCurrentView = useStore(state => state.setCurrentView);

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  const renderCurrentScreen = () => {
    if (!isAuthenticated) {
      switch (currentView) {
        case 'signup':
          return <SignupScreen onSwitchToLogin={() => setCurrentView('login')} />;
        case 'login':
        default:
          return <LoginScreen onSwitchToSignup={() => setCurrentView('signup')} />;
      }
    } else {
      // Use type assertion as a temporary fix
      const view = currentView as ExtendedView;
      
      switch (view) {
        case 'conversations':
          return <ConversationsScreen />;
        case 'chat':
          return <ChatScreen />;
        case 'settings':
          return <SettingsScreen />;
        case 'call':
          return <CallScreen />;
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