import React from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  TouchableOpacity,
} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import { useStore } from '../../store/useStore';

// Simple TopBar component
const TopBar = ({ 
  title, 
  onBack 
}: { 
  title: string;
  onBack: () => void;
}) => {
  return (
    <View style={topBarStyles.container}>
      <TouchableOpacity onPress={onBack} style={topBarStyles.backButton}>
        <Icon name="arrow-left" size={24} color="#374151" />
      </TouchableOpacity>
      <Text style={topBarStyles.title}>{title}</Text>
      <View style={topBarStyles.placeholder} />
    </View>
  );
};

const topBarStyles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  backButton: {
    padding: 4,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#374151',
  },
  placeholder: {
    width: 32,
  },
});

// Simple Avatar component
const Avatar = ({ user, size = 'md' }: { user: any; size?: 'sm' | 'md' | 'lg' }) => {
  const sizeMap = {
    sm: 32,
    md: 40,
    lg: 64,
  };
  
  const fontSizeMap = {
    sm: 14,
    md: 16,
    lg: 24,
  };
  
  return (
    <View style={[
      avatarStyles.container,
      { width: sizeMap[size], height: sizeMap[size] }
    ]}>
      <Text style={[
        avatarStyles.text,
        { fontSize: fontSizeMap[size] }
      ]}>
        {user?.name?.charAt(0)?.toUpperCase() || 'U'}
      </Text>
    </View>
  );
};

const avatarStyles = StyleSheet.create({
  container: {
    backgroundColor: '#3b82f6',
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    color: '#ffffff',
    fontWeight: 'bold',
  },
});

// Settings Item Component
const SettingsItem = ({ 
  icon, 
  label, 
  onPress,
  showChevron = true
}: { 
  icon: string; 
  label: string; 
  onPress: () => void;
  showChevron?: boolean;
}) => {
  return (
    <TouchableOpacity style={settingsItemStyles.container} onPress={onPress}>
      <View style={settingsItemStyles.leftContent}>
        <Icon name={icon} size={20} color="#6b7280" />
        <Text style={settingsItemStyles.label}>{label}</Text>
      </View>
      {showChevron && (
        <Icon name="chevron-right" size={20} color="#9ca3af" />
      )}
    </TouchableOpacity>
  );
};

const settingsItemStyles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  leftContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  label: {
    fontSize: 16,
    color: '#374151',
  },
});

// Settings Group Component
const SettingsGroup = ({ 
  title, 
  children 
}: { 
  title: string; 
  children: React.ReactNode;
}) => {
  return (
    <View style={settingsGroupStyles.container}>
      <Text style={settingsGroupStyles.title}>{title}</Text>
      <View style={settingsGroupStyles.content}>
        {children}
      </View>
    </View>
  );
};

const settingsGroupStyles = StyleSheet.create({
  container: {
    marginBottom: 24,
  },
  title: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6b7280',
    marginBottom: 8,
    marginLeft: 16,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  content: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    overflow: 'hidden',
  },
});

// Main SettingsScreen Component
export function SettingsScreen() {
  const currentUser = useStore(state => state.currentUser);
  const logout = useStore(state => state.logout);
  const setCurrentView = useStore(state => state.setCurrentView);
  
  if (!currentUser) return null;
  
  const settingsGroups = [
    {
      title: 'Account',
      items: [
        { icon: 'user', label: 'Profile', onPress: () => console.log('Profile pressed') },
        { icon: 'lock', label: 'Privacy', onPress: () => console.log('Privacy pressed') },
      ],
    },
    {
      title: 'Preferences',
      items: [
        { icon: 'bell', label: 'Notifications', onPress: () => console.log('Notifications pressed') },
        { icon: 'moon', label: 'Appearance', onPress: () => console.log('Appearance pressed') },
      ],
    },
    {
      title: 'Support',
      items: [
        { icon: 'help-circle', label: 'Help & Support', onPress: () => console.log('Help pressed') },
      ],
    },
  ];
  
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="#ffffff" barStyle="dark-content" />
      
      <TopBar
        title="Settings"
        onBack={() => setCurrentView('conversations')}
      />
      
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* User Profile Header */}
        <View style={styles.profileHeader}>
          <View style={styles.profileContent}>
            <Avatar user={currentUser} size="lg" />
            <View style={styles.profileText}>
              <Text style={styles.profileName}>{currentUser.name}</Text>
              <Text style={styles.profileEmail}>{currentUser.email}</Text>
            </View>
          </View>
        </View>
        
        {/* Settings Groups */}
        <View style={styles.settingsContent}>
          {settingsGroups.map((group, groupIndex) => (
            <SettingsGroup key={groupIndex} title={group.title}>
              {group.items.map((item, itemIndex) => (
                <SettingsItem
                  key={itemIndex}
                  icon={item.icon}
                  label={item.label}
                  onPress={item.onPress}
                />
              ))}
            </SettingsGroup>
          ))}
          
          {/* Logout Button */}
          <TouchableOpacity 
            style={styles.logoutButton}
            onPress={logout}
          >
            <Icon name="log-out" size={20} color="#ef4444" />
            <Text style={styles.logoutText}>Log Out</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  scrollView: {
    flex: 1,
  },
  profileHeader: {
    backgroundColor: '#3b82f6', // Fixed: Using solid color instead of gradient
    padding: 32,
  },
  profileContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  profileText: {
    flex: 1,
  },
  profileName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 4,
  },
  profileEmail: {
    fontSize: 16,
    color: '#dbeafe',
  },
  settingsContent: {
    padding: 16,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#fef2f2',
    paddingVertical: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#fecaca',
  },
  logoutText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ef4444',
  },
});