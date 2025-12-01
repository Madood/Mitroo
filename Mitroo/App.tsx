import React, { useCallback } from 'react';
import { SafeAreaView, StatusBar, StyleSheet, useColorScheme, BackHandler, Alert } from 'react-native';
import { Colors } from 'react-native/Libraries/NewAppScreen';
import LoginScreen from './src/Screens/auth/LoginScreen';
import SignupScreen from './src/Screens/auth/SignupScreen';
import { ConversationsScreen } from './src/Screens/chat/ConversationScreen';
import { ChatScreen } from './src/Screens/chat/ChatScreen';
import { SettingsScreen } from './src/Screens/settings/SettingScreen';
import { CallScreen } from './src/Screens/call/CallScreen';
import { ContactsScreen } from './src/Screens/contacts/contactsScreen';
import { useStore } from './src/store/useStore';
import { useBackHandler } from './src/hooks/useBackHandler'; // Adjust import path as needed

type AppView = 'login' | 'signup' | 'conversations' | 'chat' | 'settings' | 'call' | 'contacts';

function App(): JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';
  const currentView = useStore(state => state.currentView);
  const isAuthenticated = useStore(state => state.isAuthenticated);
  const setCurrentView = useStore(state => state.setCurrentView);

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  // Handle back button press
  const handleBackPress = useCallback((): boolean => {
    if (!isAuthenticated) {
      // If on login/signup screens
      if (currentView === 'signup') {
        setCurrentView('login');
        return true; // Prevent app from closing
      }
      // If on login screen, let the system handle back press (will close app)
      return false;
    }

    // If authenticated, handle navigation back
    switch (currentView) {
      case 'chat':
      case 'settings':
      case 'call':
      case 'contacts':
        // Navigate back to conversations
        setCurrentView('conversations');
        return true; // Prevent app from closing
      
      case 'conversations':
        // Show confirmation before exiting app
        Alert.alert(
          'Exit App',
          'Are you sure you want to exit?',
          [
            {
              text: 'Cancel',
              style: 'cancel',
              onPress: () => {}
            },
            {
              text: 'Exit',
              style: 'destructive',
              onPress: () => BackHandler.exitApp()
            }
          ]
        );
        return true; // Prevent immediate app closure
      
      default:
        // For any other views, go back to conversations
        setCurrentView('conversations');
        return true;
    }
  }, [isAuthenticated, currentView, setCurrentView]);

  // Apply back handler
  useBackHandler(handleBackPress);

  const renderCurrentScreen = () => {
    if (!isAuthenticated) {
      switch (currentView) {
        case 'signup':
          return <SignupScreen />;
        default:
          return <LoginScreen />;
      }
    }

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
      case 'contacts':
        return <ContactsScreen />;
      default:
        return <ConversationsScreen />;
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