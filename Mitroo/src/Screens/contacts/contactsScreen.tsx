import React, {useState, useEffect, useRef} from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  SafeAreaView,
  StatusBar,
  TextInput,
  Alert,
  Modal,
  ActivityIndicator,
  Platform,
  PermissionsAndroid,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {useStore} from '../../store/useStore';

// Define the Contacts type interface
interface ContactsType {
  requestPermission: () => Promise<'authorized' | 'denied'>;
  getAll: () => Promise<any[]>;
  checkPermission?: () => Promise<'authorized' | 'denied'>;
}

// Define the actual imported module type
interface ContactsModule {
  default: ContactsType;
}

// Try to import contacts, but provide fallback if not available
let Contacts: ContactsType | null = null;
try {
  const contactsModule = require('react-native-contacts') as ContactsModule;
  Contacts = contactsModule.default;
  console.log('react-native-contacts package loaded successfully');
  console.log('Available Contacts methods:', Object.keys(Contacts));
} catch (error) {
  console.warn('react-native-contacts package not available, using fallback');
  Contacts = null;
}

// Define Contact type
interface AppContact {
  id: string;
  name: string;
  email: string;
  avatar: string;
  online: boolean;
  userId: string;
  contactUserId: string;
}

// Define SearchUser type
interface SearchUser {
  id: string;
  name: string;
  email: string;
  avatar: string;
  online: boolean;
}

// Define Phone Contact type
interface Email {
  label: string;
  email: string;
}

interface PhoneNumber {
  label: string;
  number: string;
}

interface PhoneContact {
  id: string;
  name: string;
  emails: Email[];
  phoneNumbers: PhoneNumber[];
  thumbnailPath?: string;
}

// Avatar component props interface
interface AvatarProps {
  name: string;
  avatar?: string;
  size?: number;
  showStatus?: boolean;
  online?: boolean;
}

// Enhanced API Service with fallbacks
const contactsApi = {
  // Fetch user's contacts with fallback to store data
  getContacts: async (userId: string): Promise<AppContact[]> => {
    try {
      console.log('Fetching contacts for user:', userId);

      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Return empty array - contacts will come from store
      return [];
    } catch (error) {
      console.log('Using store contacts due to API error:', error);
      return [];
    }
  },

  // Add a new contact with validation
  addContact: async (
    userId: string,
    contactEmail: string,
  ): Promise<AppContact> => {
    try {
      console.log('Adding contact:', {userId, contactEmail});

      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Create a mock contact for demo
      const mockContact: AppContact = {
        id: Math.random().toString(36).substr(2, 9),
        name: contactEmail.split('@')[0],
        email: contactEmail,
        avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(
          contactEmail.split('@')[0],
        )}&background=007AFF&color=fff`,
        online: Math.random() > 0.5,
        userId: userId,
        contactUserId: Math.random().toString(36).substr(2, 9),
      };

      return mockContact;
    } catch (error) {
      console.error('Error adding contact:', error);
      throw new Error(
        'Failed to add contact. Please check the email address and try again.',
      );
    }
  },

  // Remove a contact
  removeContact: async (contactId: string): Promise<void> => {
    try {
      console.log('Removing contact:', contactId);
      await new Promise(resolve => setTimeout(resolve, 800));
      return;
    } catch (error) {
      console.error('Error removing contact:', error);
      throw new Error('Failed to remove contact. Please try again.');
    }
  },

  // Search users by email
  searchUsers: async (email: string): Promise<SearchUser[]> => {
    try {
      console.log('Searching users by email:', email);
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Mock search results for demo
      const mockResults: SearchUser[] = [
        {
          id: Math.random().toString(36).substr(2, 9),
          name: email.split('@')[0],
          email: email,
          avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(
            email.split('@')[0],
          )}&background=007AFF&color=fff`,
          online: Math.random() > 0.5,
        },
      ];

      return mockResults;
    } catch (error) {
      console.error('Error searching users:', error);
      return [];
    }
  },
};

// Sample phone contacts data for fallback
const samplePhoneContacts: PhoneContact[] = [
  {
    id: '1',
    name: 'John Doe',
    emails: [
      {label: 'work', email: 'john.doe@example.com'},
      {label: 'personal', email: 'john@work.com'},
    ],
    phoneNumbers: [{label: 'mobile', number: '+1-555-0101'}],
  },
  {
    id: '2',
    name: 'Jane Smith',
    emails: [{label: 'work', email: 'jane.smith@example.com'}],
    phoneNumbers: [
      {label: 'mobile', number: '+1-555-0102'},
      {label: 'home', number: '+1-555-0103'},
    ],
  },
  {
    id: '3',
    name: 'Mike Johnson',
    emails: [{label: 'work', email: 'mike.johnson@example.com'}],
    phoneNumbers: [{label: 'mobile', number: '+1-555-0104'}],
  },
  {
    id: '4',
    name: 'Sarah Wilson',
    emails: [
      {label: 'work', email: 'sarah.wilson@example.com'},
      {label: 'personal', email: 'sarah@company.org'},
    ],
    phoneNumbers: [{label: 'mobile', number: '+1-555-0105'}],
  },
  {
    id: '5',
    name: 'Alex Brown',
    emails: [{label: 'work', email: 'alex.brown@example.com'}],
    phoneNumbers: [{label: 'mobile', number: '+1-555-0106'}],
  },
];

// Avatar component with fallback
const Avatar = ({
  name,
  avatar,
  size = 50,
  showStatus = false,
  online = false,
}: AvatarProps) => {
  const [imageError, setImageError] = useState(false);

  // If image fails to load or no avatar, show initial
  if (imageError || !avatar) {
    return (
      <View style={[avatarStyles.container, {width: size, height: size}]}>
        <View
          style={[
            avatarStyles.placeholder,
            {width: size, height: size, borderRadius: size / 2},
          ]}>
          <Text style={[avatarStyles.text, {fontSize: size * 0.4}]}>
            {name?.charAt(0)?.toUpperCase() || 'U'}
          </Text>
        </View>
        {showStatus && (
          <View
            style={[
              avatarStyles.status,
              {backgroundColor: online ? '#4CAF50' : '#9E9E9E'},
            ]}
          />
        )}
      </View>
    );
  }

  return (
    <View style={[avatarStyles.container, {width: size, height: size}]}>
      <Image
        source={{uri: avatar}}
        style={[
          avatarStyles.image,
          {width: size, height: size, borderRadius: size / 2},
        ]}
        onError={() => setImageError(true)}
      />
      {showStatus && (
        <View
          style={[
            avatarStyles.status,
            {backgroundColor: online ? '#4CAF50' : '#9E9E9E'},
          ]}
        />
      )}
    </View>
  );
};

const avatarStyles = StyleSheet.create({
  container: {
    position: 'relative',
    marginRight: 16,
  },
  image: {
    borderRadius: 25,
  },
  placeholder: {
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    color: '#ffffff',
    fontWeight: 'bold',
  },
  status: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 12,
    height: 12,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: '#fff',
  },
});

export function ContactsScreen() {
  const {
    currentUser,
    initiateCall,
    setCurrentView,
    contacts,
    setContacts,
    addContact,
    removeContact,
    startConversation,
  } = useStore(state => state);

  // Handle nullable currentUser
  if (!currentUser) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar backgroundColor="#ffffff" barStyle="dark-content" />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#007AFF" />
          <Text style={styles.loadingText}>Loading user...</Text>
        </View>
      </SafeAreaView>
    );
  }

  const [loading, setLoading] = useState(false);
  const [addContactModal, setAddContactModal] = useState(false);
  const [newContactEmail, setNewContactEmail] = useState('');
  const [addingContact, setAddingContact] = useState(false);
  const [searchResults, setSearchResults] = useState<SearchUser[]>([]);
  const [searching, setSearching] = useState(false);
  const [selectedContact, setSelectedContact] = useState<AppContact | null>(
    null,
  );
  const [phoneContacts, setPhoneContacts] = useState<PhoneContact[]>([]);
  const [importingContacts, setImportingContacts] = useState(false);
  const [showPhoneContacts, setShowPhoneContacts] = useState(false);

  // Ref for the timeout - use number type for React Native
  const selectionTimeoutRef = useRef<number | null>(null);

  // Clear timeout when component unmounts
  useEffect(() => {
    return () => {
      if (selectionTimeoutRef.current) {
        clearTimeout(selectionTimeoutRef.current);
      }
    };
  }, []);

  // Load contacts when component mounts
  useEffect(() => {
    loadContacts();
  }, []);

  // Load real phone contacts with permission or fallback to sample data
// Load real phone contacts with permission or fallback to sample data
const loadPhoneContacts = async () => {
  console.log('=== loadPhoneContacts started ===');
  console.log('Platform:', Platform.OS);
  console.log('Contacts package:', Contacts ? 'Available' : 'Not available');
  
  try {
    setImportingContacts(true);
    
    if (!Contacts) {
      console.log('Contacts package not available, using sample data');
      // Fallback to sample data if contacts package is not available
      setTimeout(() => {
        setPhoneContacts(samplePhoneContacts);
        setShowPhoneContacts(true);
        setImportingContacts(false);
        Alert.alert(
          'Sample Contacts Loaded', 
          'The contacts package is not available. Showing sample data instead.',
          [{ text: 'OK' }]
        );
      }, 1000);
      return;
    }

    // For Android, we need to request runtime permission
    if (Platform.OS === 'android') {
      console.log('Requesting Android runtime permission...');
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.READ_CONTACTS,
          {
            title: 'Contacts Permission',
            message: 'This app needs access to your contacts to import them.',
            buttonPositive: 'OK',
            buttonNegative: 'Cancel',
          }
        );
        
        console.log('Android permission result:', granted);
        
        if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
          setImportingContacts(false);
          Alert.alert(
            'Permission Denied',
            'Contacts permission is required to import your contacts.',
            [{ text: 'OK' }]
          );
          return;
        }
      } catch (androidError: any) {
        console.error('Android permission error:', androidError);
        throw new Error(`Android permission failed: ${androidError?.message || 'Unknown error'}`);
      }
    }
    
    console.log('Attempting to get contacts directly...');
    
    let deviceContacts;
    try {
      // Try to get contacts directly
      deviceContacts = await Contacts.getAll();
      console.log('Raw contacts found:', deviceContacts.length);
      
      // Log first few contacts to see structure
      if (deviceContacts.length > 0) {
        console.log('First contact sample:', {
          name: deviceContacts[0].givenName,
          emails: deviceContacts[0].emailAddresses,
          phones: deviceContacts[0].phoneNumbers
        });
      }
    } catch (getError: any) {
      console.error('Error getting contacts:', getError);
      throw new Error(`Failed to fetch contacts: ${getError?.message || 'Unknown error'}`);
    }
    
    // Transform the contacts to match our app structure
    const transformedContacts: PhoneContact[] = deviceContacts
      .filter((contact: any) => {
        const hasEmails = contact.emailAddresses && contact.emailAddresses.length > 0;
        console.log(`Contact ${contact.givenName} has emails:`, hasEmails);
        return hasEmails;
      })
      .map((contact: any) => ({
        id: contact.recordID,
        name: [contact.givenName, contact.middleName, contact.familyName]
          .filter((name: string | undefined) => name && name.trim())
          .join(' ') || 'Unknown Name',
        emails: contact.emailAddresses.map((email: any) => ({
          label: email.label || 'email',
          email: email.email
        })),
        phoneNumbers: contact.phoneNumbers ? contact.phoneNumbers.map((phone: any) => ({
          label: phone.label || 'phone',
          number: phone.number
        })) : [],
        thumbnailPath: contact.thumbnailPath
      }));
    
    console.log('Transformed contacts with emails:', transformedContacts.length);
    
    setPhoneContacts(transformedContacts);
    setShowPhoneContacts(true);
    setImportingContacts(false);
    
    if (transformedContacts.length === 0) {
      Alert.alert(
        'No Contacts with Emails', 
        'We found contacts, but none have email addresses. Contacts need emails to be added to the app.',
        [{ text: 'OK' }]
      );
    } else {
      Alert.alert(
        'Contacts Loaded', 
        `Found ${transformedContacts.length} contacts with email addresses.`,
        [{ text: 'OK' }]
      );
    }
  } catch (error) {
    console.error('Error loading contacts:', error);
    setImportingContacts(false);
    
    let errorMessage = 'Unknown error occurred';
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    
    Alert.alert(
      'Error',
      `Failed to load contacts: ${errorMessage}. Showing sample data instead.`,
      [{ text: 'OK' }]
    );
    
    // Fallback to sample data on error
    setPhoneContacts(samplePhoneContacts);
    setShowPhoneContacts(true);
  }
};

  const loadContacts = async () => {
    try {
      setLoading(true);
      const userContacts = await contactsApi.getContacts(currentUser.id);

      if (userContacts && userContacts.length > 0) {
        setContacts(userContacts);
      }
    } catch (error) {
      console.log('Using existing store contacts due to load error');
    } finally {
      setLoading(false);
    }
  };

  const handleAddContact = async (email?: string) => {
    const emailToAdd = email || newContactEmail.trim();

    if (!emailToAdd || !currentUser) {
      Alert.alert('Error', 'Please enter a valid email address');
      return;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(emailToAdd)) {
      Alert.alert('Error', 'Please enter a valid email address');
      return;
    }

    // Check if contact already exists
    const contactExists = contacts.some(
      contact => contact.email === emailToAdd,
    );
    if (contactExists) {
      Alert.alert('Contact Exists', 'This contact is already in your list.');
      return;
    }

    try {
      setAddingContact(true);
      const newContact = await contactsApi.addContact(
        currentUser.id,
        emailToAdd,
      );
      addContact(newContact);
      setNewContactEmail('');
      setAddContactModal(false);
      setSearchResults([]);
      Alert.alert('Success', 'Contact added successfully!');
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to add contact');
    } finally {
      setAddingContact(false);
    }
  };

  const handleRemoveContact = (contactId: string, contactName: string) => {
    Alert.alert(
      'Remove Contact',
      `Are you sure you want to remove ${contactName} from your contacts?`,
      [
        {text: 'Cancel', style: 'cancel'},
        {
          text: 'Remove',
          style: 'destructive',
          onPress: async () => {
            try {
              await contactsApi.removeContact(contactId);
              removeContact(contactId);
              setSelectedContact(null);
              Alert.alert('Success', 'Contact removed successfully');
            } catch (error: any) {
              Alert.alert('Error', error.message || 'Failed to remove contact');
            }
          },
        },
      ],
    );
  };

  const handleStartChat = (contact: AppContact) => {
    // Start conversation with the contact
    startConversation(contact.contactUserId, 'direct');
    setCurrentView('conversation');
  };

  const handleSearchUsers = async (email: string) => {
    if (!email.trim()) {
      setSearchResults([]);
      return;
    }

    try {
      setSearching(true);
      const results = await contactsApi.searchUsers(email.trim());

      // Filter out users already in contacts and current user
      const filteredResults = results.filter(user => {
        const isCurrentUser = user.email === currentUser.email;
        const alreadyInContacts = contacts.some(
          contact => contact.email === user.email,
        );
        return !isCurrentUser && !alreadyInContacts;
      });

      setSearchResults(filteredResults);
    } catch (error) {
      console.error('Error searching users:', error);
      setSearchResults([]);
    } finally {
      setSearching(false);
    }
  };

  const handleLongPress = (contact: AppContact) => {
    // Clear any existing timeout
    if (selectionTimeoutRef.current) {
      clearTimeout(selectionTimeoutRef.current);
    }

    // Set the selected contact
    setSelectedContact(contact);

    // Set timeout to automatically deselect after 5 seconds
    selectionTimeoutRef.current = setTimeout(() => {
      setSelectedContact(null);
      selectionTimeoutRef.current = null;
    }, 5000); // 5 seconds
  };

  const handleContactPress = (contact: AppContact) => {
    // If this contact is currently selected, deselect it immediately
    if (selectedContact?.id === contact.id) {
      // Clear the timeout
      if (selectionTimeoutRef.current) {
        clearTimeout(selectionTimeoutRef.current);
        selectionTimeoutRef.current = null;
      }
      setSelectedContact(null);
    }
  };

  const renderContact = ({item}: {item: AppContact}) => (
    <TouchableOpacity
      style={[
        styles.contactItem,
        selectedContact?.id === item.id && styles.selectedContact,
      ]}
      onLongPress={() => handleLongPress(item)}
      onPress={() => handleContactPress(item)}
      delayLongPress={500}>
      <Avatar
        name={item.name}
        avatar={item.avatar}
        size={50}
        showStatus={true}
        online={item.online}
      />
      <View style={styles.contactInfo}>
        <Text style={styles.contactName}>{item.name}</Text>
        <Text style={styles.contactEmail}>{item.email}</Text>
        <Text style={styles.contactStatus}>
          {item.online ? 'Online' : 'Offline'}
        </Text>
        {/* Timer indicator */}
        {selectedContact?.id === item.id && (
          <View style={styles.timerContainer}>
            <View style={styles.timerBar}>
              <View
                style={[
                  styles.timerProgress,
                  {width: '100%'}, // This will animate from 100% to 0% over 5 seconds
                ]}
              />
            </View>
          </View>
        )}
      </View>
      <View style={styles.actions}>
        <TouchableOpacity
          style={styles.messageButton}
          onPress={() => handleStartChat(item)}>
          <Ionicons name="chatbubble-ellipses" size={20} color="#007AFF" />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.callButton}
          onPress={() => {
            if (item.online) {
              initiateCall(item.contactUserId, 'audio');
            } else {
              Alert.alert('Offline', `${item.name} is currently offline`);
            }
          }}>
          <Ionicons
            name="call"
            size={20}
            color={item.online ? '#007AFF' : '#CCCCCC'}
          />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.videoButton}
          onPress={() => {
            if (item.online) {
              initiateCall(item.contactUserId, 'video');
            } else {
              Alert.alert('Offline', `${item.name} is currently offline`);
            }
          }}>
          <Ionicons
            name="videocam"
            size={20}
            color={item.online ? '#007AFF' : '#CCCCCC'}
          />
        </TouchableOpacity>

        {/* Delete button shown only when contact is selected via long press */}
        {selectedContact?.id === item.id && (
          <TouchableOpacity
            style={styles.deleteButton}
            onPress={() => handleRemoveContact(item.id, item.name)}>
            <Ionicons name="trash-outline" size={20} color="#FF3B30" />
          </TouchableOpacity>
        )}
      </View>
    </TouchableOpacity>
  );

  const renderPhoneContact = ({item}: {item: PhoneContact}) => (
    <View style={styles.phoneContactItem}>
      <Avatar
        name={item.name}
        avatar={item.thumbnailPath}
        size={50}
        showStatus={false}
      />
      <View style={styles.contactInfo}>
        <Text style={styles.contactName}>{item.name}</Text>
        <View style={styles.emailsContainer}>
          {item.emails.map((email, index) => (
            <TouchableOpacity
              key={index}
              style={styles.emailChip}
              onPress={() => handleAddContact(email.email)}>
              <Text style={styles.emailChipText}>{email.email}</Text>
              <Ionicons name="add-circle" size={16} color="#007AFF" />
            </TouchableOpacity>
          ))}
        </View>
        {item.phoneNumbers.length > 0 && (
          <Text style={styles.phoneNumbers}>
            📞{' '}
            {item.phoneNumbers
              .slice(0, 2)
              .map(p => p.number)
              .join(', ')}
            {item.phoneNumbers.length > 2 &&
              ` +${item.phoneNumbers.length - 2} more`}
          </Text>
        )}
      </View>
    </View>
  );

  const renderSearchResult = ({item}: {item: SearchUser}) => (
    <TouchableOpacity
      style={styles.searchResultItem}
      onPress={() => {
        setNewContactEmail(item.email);
        setSearchResults([]);
      }}>
      <Avatar
        name={item.name}
        avatar={item.avatar}
        size={40}
        showStatus={false}
      />
      <View style={styles.contactInfo}>
        <Text style={styles.contactName}>{item.name}</Text>
        <Text style={styles.contactEmail}>{item.email}</Text>
      </View>
      <Ionicons name="add-circle" size={24} color="#007AFF" />
    </TouchableOpacity>
  );

  if (loading && contacts.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#007AFF" />
          <Text style={styles.loadingText}>Loading contacts...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="#ffffff" barStyle="dark-content" />

      {/* Header with Back Button */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => setCurrentView('conversations')}>
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>Contacts</Text>
          <Text style={styles.headerSubtitle}>
            {contacts.length} {contacts.length === 1 ? 'contact' : 'contacts'}
          </Text>
        </View>
        <View style={styles.headerActions}>
          <TouchableOpacity
            style={styles.importButton}
            onPress={loadPhoneContacts}
            disabled={importingContacts}>
            {importingContacts ? (
              <ActivityIndicator size="small" color="#007AFF" />
            ) : (
              <Ionicons name="download-outline" size={24} color="#007AFF" />
            )}
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.addButton}
            onPress={() => setAddContactModal(true)}>
            <Ionicons name="add" size={24} color="#007AFF" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Imported Contacts Section */}
      {showPhoneContacts && phoneContacts.length > 0 && (
        <View style={styles.importedSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>
              {Contacts ? 'Phone Contacts' : 'Sample Contacts'}
            </Text>
            <Text style={styles.sectionSubtitle}>
              {phoneContacts.length} contacts with emails
            </Text>
            <TouchableOpacity
              onPress={() => setShowPhoneContacts(false)}
              style={styles.closeSectionButton}>
              <Ionicons name="close" size={20} color="#666" />
            </TouchableOpacity>
          </View>
          <FlatList
            data={phoneContacts}
            renderItem={renderPhoneContact}
            keyExtractor={item => item.id}
            style={styles.phoneContactsList}
            showsVerticalScrollIndicator={false}
          />
        </View>
      )}

      {/* App Contacts Section */}
      <View style={styles.contactsSection}>
        {contacts.length === 0 && !showPhoneContacts ? (
          <View style={styles.emptyState}>
            <Ionicons name="people-outline" size={64} color="#CCCCCC" />
            <Text style={styles.emptyStateTitle}>No Contacts Yet</Text>
            <Text style={styles.emptyStateText}>
              Add people to your contact list to start chatting and calling them
            </Text>
            <TouchableOpacity
              style={styles.emptyStateButton}
              onPress={() => setAddContactModal(true)}>
              <Text style={styles.emptyStateButtonText}>
                Add Your First Contact
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.importContactsButton}
              onPress={loadPhoneContacts}
              disabled={importingContacts}>
              {importingContacts ? (
                <ActivityIndicator size="small" color="#007AFF" />
              ) : (
                <Ionicons name="download-outline" size={20} color="#007AFF" />
              )}
              <Text style={styles.importContactsButtonText}>
                {Contacts ? 'Import Phone Contacts' : 'Load Sample Contacts'}
              </Text>
            </TouchableOpacity>
          </View>
        ) : (
          <FlatList
            data={contacts}
            renderItem={renderContact}
            keyExtractor={item => item.id}
            style={styles.list}
            showsVerticalScrollIndicator={false}
            refreshing={loading}
            onRefresh={loadContacts}
          />
        )}
      </View>

      {/* Add Contact Modal */}
      <Modal
        visible={addContactModal}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => {
          setAddContactModal(false);
          setNewContactEmail('');
          setSearchResults([]);
        }}>
        <SafeAreaView style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Add Contact</Text>
            <TouchableOpacity
              onPress={() => {
                setAddContactModal(false);
                setNewContactEmail('');
                setSearchResults([]);
              }}
              style={styles.closeButton}>
              <Ionicons name="close" size={24} color="#000" />
            </TouchableOpacity>
          </View>

          <View style={styles.searchContainer}>
            <TextInput
              style={styles.searchInput}
              placeholder="Enter email address"
              value={newContactEmail}
              onChangeText={text => {
                setNewContactEmail(text);
                handleSearchUsers(text);
              }}
              autoCapitalize="none"
              autoComplete="email"
              keyboardType="email-address"
              autoFocus={true}
            />
            <TouchableOpacity
              style={[
                styles.addContactButton,
                (!newContactEmail.trim() || addingContact) &&
                  styles.addContactButtonDisabled,
              ]}
              onPress={() => handleAddContact()}
              disabled={!newContactEmail.trim() || addingContact}>
              {addingContact ? (
                <ActivityIndicator size="small" color="#FFFFFF" />
              ) : (
                <Text style={styles.addContactButtonText}>Add</Text>
              )}
            </TouchableOpacity>
          </View>

          {searching && (
            <View style={styles.searchingContainer}>
              <ActivityIndicator size="small" color="#007AFF" />
              <Text style={styles.searchingText}>Searching...</Text>
            </View>
          )}

          {searchResults.length > 0 && (
            <View style={styles.searchResults}>
              <Text style={styles.searchResultsTitle}>Search Results</Text>
              <FlatList
                data={searchResults}
                renderItem={renderSearchResult}
                keyExtractor={item => item.id}
                style={styles.searchResultsList}
              />
            </View>
          )}

          {newContactEmail.trim() &&
            searchResults.length === 0 &&
            !searching && (
              <View style={styles.noResults}>
                <Text style={styles.noResultsText}>
                  No users found with this email
                </Text>
                <Text style={styles.noResultsSubtext}>
                  Make sure the email address is correct and the user is
                  registered in the app
                </Text>
              </View>
            )}
        </SafeAreaView>
      </Modal>
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
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  importButton: {
    padding: 8,
    marginRight: 8,
  },
  addButton: {
    padding: 8,
  },
  importedSection: {
    flex: 1,
    backgroundColor: '#f8f8f8',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
  },
  sectionSubtitle: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  closeSectionButton: {
    padding: 4,
  },
  contactsSection: {
    flex: 1,
  },
  phoneContactsList: {
    flex: 1,
    maxHeight: 300,
  },
  phoneContactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    backgroundColor: '#fff',
  },
  emailsContainer: {
    marginTop: 4,
  },
  emailChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E3F2FD',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginRight: 8,
    marginBottom: 4,
  },
  emailChipText: {
    fontSize: 12,
    color: '#1976D2',
    marginRight: 4,
  },
  phoneNumbers: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
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
  selectedContact: {
    backgroundColor: '#f8f8f8',
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
  timerContainer: {
    marginTop: 4,
  },
  timerBar: {
    height: 3,
    backgroundColor: '#e0e0e0',
    borderRadius: 2,
    overflow: 'hidden',
  },
  timerProgress: {
    height: '100%',
    backgroundColor: '#007AFF',
    borderRadius: 2,
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  messageButton: {
    padding: 8,
    backgroundColor: '#f0f0f0',
    borderRadius: 20,
    marginLeft: 8,
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
  deleteButton: {
    padding: 8,
    backgroundColor: '#f0f0f0',
    borderRadius: 20,
    marginLeft: 8,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#666',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  emptyStateTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#666',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyStateText: {
    fontSize: 16,
    color: '#999',
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 22,
  },
  emptyStateButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
    marginBottom: 12,
  },
  emptyStateButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  importContactsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E3F2FD',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
  },
  importContactsButtonText: {
    color: '#1976D2',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: '#fff',
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
  },
  closeButton: {
    padding: 4,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  searchInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    marginRight: 12,
    fontSize: 16,
  },
  addContactButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
    minWidth: 60,
    alignItems: 'center',
  },
  addContactButtonDisabled: {
    backgroundColor: '#ccc',
  },
  addContactButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  searchingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  searchingText: {
    marginLeft: 8,
    color: '#666',
  },
  searchResults: {
    flex: 1,
  },
  searchResultsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
    padding: 16,
    backgroundColor: '#f8f8f8',
  },
  searchResultsList: {
    flex: 1,
  },
  searchResultItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  noResults: {
    padding: 20,
    alignItems: 'center',
  },
  noResultsText: {
    color: '#666',
    fontSize: 16,
    marginBottom: 8,
    textAlign: 'center',
  },
  noResultsSubtext: {
    color: '#999',
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
  },
});
