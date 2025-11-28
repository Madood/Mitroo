import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Modal,
  FlatList,
} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';

// Avatar Component (copied from ChatScreen for independence)
const Avatar = ({ user, size = 'md', showOnline = false }: { user: any; size?: 'sm' | 'md' | 'lg'; showOnline?: boolean }) => {
  const sizeMap = { sm: 32, md: 40, lg: 48 };
  const fontSizeMap = { sm: 14, md: 16, lg: 18 };
  
  return (
    <View style={[styles.avatarContainer, { width: sizeMap[size], height: sizeMap[size] }]}>
      <Text style={[styles.avatarText, { fontSize: fontSizeMap[size] }]}>
        {user?.name?.charAt(0)?.toUpperCase() || 'U'}
      </Text>
      {showOnline && user?.online && <View style={styles.onlineIndicator} />}
    </View>
  );
};

interface Contact {
  id: string;
  name: string;
  email: string;
  online: boolean;
}

interface ContactListModalProps {
  visible: boolean;
  onClose: () => void;
  onContactSelect: (contact: Contact) => void;
}

// Mock contacts data
const mockContacts: Contact[] = [
  {
    id: '2',
    name: 'John Doe',
    email: 'john@example.com',
    online: true,
  },
  {
    id: '3',
    name: 'Jane Smith',
    email: 'jane@example.com',
    online: false,
  },
  {
    id: '4',
    name: 'Mike Johnson',
    email: 'mike@example.com',
    online: true,
  },
  {
    id: '5',
    name: 'Sarah Wilson',
    email: 'sarah@example.com',
    online: true,
  },
];

export const ContactListModal: React.FC<ContactListModalProps> = ({
  visible,
  onClose,
  onContactSelect,
}) => {
  const renderContactItem = ({ item }: { item: Contact }) => (
    <TouchableOpacity 
      style={styles.contactItem}
      onPress={() => onContactSelect(item)}
    >
      <View style={styles.contactInfo}>
        <Avatar user={item} size="sm" showOnline />
        <View style={styles.contactDetails}>
          <Text style={styles.contactName}>{item.name}</Text>
          <Text style={styles.contactEmail}>{item.email}</Text>
        </View>
      </View>
      <View style={styles.contactStatus}>
        <Text style={[
          styles.statusText,
          { color: item.online ? '#10b981' : '#6b7280' }
        ]}>
          {item.online ? 'Online' : 'Offline'}
        </Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Contacts</Text>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Icon name="x" size={24} color="#374151" />
          </TouchableOpacity>
        </View>
        
        <FlatList
          data={mockContacts}
          renderItem={renderContactItem}
          keyExtractor={(item) => item.id}
          style={styles.list}
          showsVerticalScrollIndicator={false}
        />
      </SafeAreaView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#374151',
  },
  closeButton: {
    padding: 4,
  },
  list: {
    flex: 1,
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  contactInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  contactDetails: {
    marginLeft: 12,
  },
  contactName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 2,
  },
  contactEmail: {
    fontSize: 14,
    color: '#6b7280',
  },
  contactStatus: {
    alignItems: 'flex-end',
  },
  statusText: {
    fontSize: 12,
    fontWeight: '500',
  },
  // Avatar Styles
  avatarContainer: {
    backgroundColor: '#3b82f6',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  avatarText: {
    color: '#ffffff',
    fontWeight: 'bold',
  },
  onlineIndicator: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    width: 12,
    height: 12,
    backgroundColor: '#10b981',
    borderRadius: 6,
    borderWidth: 2,
    borderColor: '#ffffff',
  },
});