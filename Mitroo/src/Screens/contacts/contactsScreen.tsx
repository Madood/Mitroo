import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList, 
  TouchableOpacity,
  Image,
  SafeAreaView,
  StatusBar 
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useStore } from '../../store/useStore';

// Define Contact type
interface Contact {
  id: string;
  name: string;
  email: string;
  avatar: string;
  online: boolean;
}

// Mock contacts data
const mockContacts: Contact[] = [
  {
    id: '2',
    name: 'John Doe',
    email: 'john@example.com',
    avatar: 'https://via.placeholder.com/150',
    online: true,
  },
  {
    id: '3',
    name: 'Jane Smith',
    email: 'jane@example.com',
    avatar: 'https://via.placeholder.com/150',
    online: false,
  },
  {
    id: '4',
    name: 'Mike Johnson',
    email: 'mike@example.com',
    avatar: 'https://via.placeholder.com/150',
    online: true,
  },
];

export function ContactsScreen() {
  const { initiateCall } = useStore(state => state);
  const setCurrentView = useStore(state => state.setCurrentView);

  const renderContact = ({ item }: { item: Contact }) => (
    <View style={styles.contactItem}>
      <View style={styles.avatarContainer}>
        <Image source={{ uri: item.avatar }} style={styles.avatar} />
        <View 
          style={[
            styles.statusIndicator,
            { backgroundColor: item.online ? '#4CAF50' : '#9E9E9E' }
          ]} 
        />
      </View>
      <View style={styles.contactInfo}>
        <Text style={styles.contactName}>{item.name}</Text>
        <Text style={styles.contactEmail}>{item.email}</Text>
        <Text style={styles.contactStatus}>
          {item.online ? 'Online' : 'Offline'}
        </Text>
      </View>
      <View style={styles.actions}>
        <TouchableOpacity 
          style={styles.callButton}
          onPress={() => initiateCall(item.id, 'audio')}
        >
          <Ionicons name="call" size={20} color="#007AFF" />
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.videoButton}
          onPress={() => initiateCall(item.id, 'video')}
        >
          <Ionicons name="videocam" size={20} color="#007AFF" />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="#ffffff" barStyle="dark-content" />
      
      {/* Header with Back Button */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => setCurrentView('conversations')}
        >
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>Contacts</Text>
          <Text style={styles.headerSubtitle}>
            {mockContacts.length} contacts
          </Text>
        </View>
        <View style={styles.headerSpacer} />
      </View>
      
      <FlatList
        data={mockContacts}
        renderItem={renderContact}
        keyExtractor={(item) => item.id}
        style={styles.list}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  backButton: {
    padding: 8,
  },
  headerContent: {
    flex: 1,
    alignItems: 'center',
  },
  headerSpacer: {
    width: 40, // Same as back button for balance
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 2,
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#666',
  },
  list: {
    flex: 1,
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  avatarContainer: {
    position: 'relative',
    marginRight: 16,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  statusIndicator: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 12,
    height: 12,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: '#fff',
  },
  contactInfo: {
    flex: 1,
  },
  contactName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
    marginBottom: 2,
  },
  contactEmail: {
    fontSize: 14,
    color: '#666',
    marginBottom: 2,
  },
  contactStatus: {
    fontSize: 12,
    color: '#999',
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  callButton: {
    padding: 8,
    backgroundColor: '#f0f0f0',
    borderRadius: 20,
    marginLeft: 8,
  },
  videoButton: {
    padding: 8,
    backgroundColor: '#f0f0f0',
    borderRadius: 20,
    marginLeft: 8,
  },
});