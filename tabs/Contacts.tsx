import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Alert,
  TouchableHighlight,
  TextInput,TouchableOpacity
} from 'react-native';
import { useIsFocused } from '@react-navigation/native';
import { SwipeListView } from 'react-native-swipe-list-view';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ContactCard, { ContactInfo } from '../components/contactIcon';

interface ContactListProps {
  navigation: any; 
  route: any; 
}

const ContactList: React.FC<ContactListProps> = ({ navigation, route }) => {
  const contactInfo = route.params?.contactInfo;
  const isFocused = useIsFocused();

  const [contactList, setContactList] = useState<ContactInfo[]>([]);
  const [listData, setListData] = useState<ContactInfo[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearchInput, setShowSearchInput] = useState(false);
  const loadContacts = async () => {
    try {
      // Load contacts from AsyncStorage
      const keys = await AsyncStorage.getAllKeys();
      const contactKeys = keys.filter((key) => key.startsWith('contact_'));
      const contactArray = await AsyncStorage.multiGet(contactKeys);
  
      // Transform loaded data to ContactInfo objects
      const loadedContacts = contactArray
        .map(([key, value]) => {
          const contactData = JSON.parse(value || ''); 
          return {
            id: key,
            displayName: contactData?.displayName || '', 
            color: '#E1E8FF', 
            mobile: contactData?.mobile || '', 
            email: contactData?.email || '', 
            favorite: contactData?.favorite || false, 
            image: contactData?.image || '', 
          };
        })
        .filter((contact) => contact.displayName !== '');
  
      // Handle the contact data as needed
      console.log('Loaded contacts:', loadedContacts);
      setListData(loadedContacts);
    } catch (error) {
      console.error('Error loading contacts:', error);
    }
  };
  
  useEffect(() => {
    // Load contacts when the component mounts
    loadContacts();
  }, [isFocused]);

  const deleteContact = async (contactId: string) => {
    try {
      console.log('Contact ID to Delete:', contactId);
  
      // Fetch all keys from AsyncStorage
      const allKeys = await AsyncStorage.getAllKeys();
  
      // Find the keys that match the contact ID
      const keysToDelete = allKeys.filter((key) => key.includes(contactId));
  
      // Remove all items associated with the contact ID
      await AsyncStorage.multiRemove(keysToDelete);
  
      console.warn('Contact deleted');

      navigation.navigate('ContactList');
    } catch (error) {
      console.error('Error deleting contact:', error);
    }
  };
  const showProfile = (rowMap: any, rowKey: string) => {
    const selectedContact = listData.find((contact) => contact.id === rowKey);
  
    if (selectedContact) {
      navigation.navigate('MyProfile', {
        contactInfo: {
          id: selectedContact.id,
          displayName: selectedContact.displayName,
          mobile: selectedContact.mobile,
        Email: selectedContact.email
        },
        
    // updateContactList: updateContactList,
      });
    }
  };
  

  const deleteRow = (rowKey: string) => {
    const newData = [...listData];
    const prevIndex = listData.findIndex((item) => item.id === rowKey);
    newData.splice(prevIndex, 1);
    setListData(newData);
  };

  const renderHiddenItem = (data: any, rowMap: any) => (
    <View style={styles.rowBack}>
      <TouchableOpacity
        style={[styles.backLeftBtn, styles.backBtn]}
        onPress={() => showProfile(rowMap, data.item.id)}
      >
        <Text>Show</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.backRightBtn, styles.backRightBtnRight]}
      >
        <Text>Delete</Text>
        <Text
          style={styles.backTextWhite}
          onPress={() =>
            Alert.alert('Delete', 'Deleted contact not restored', [
              {
                text: 'Cancel',
                onPress: () => console.warn('Cancel Pressed'),
                style: 'cancel',
              },
              {
                text: 'OK',
                onPress: () => deleteContact(data.item.id),
                style: 'default',
              },
            ])
          }
        />
      </TouchableOpacity>
    </View>
  );


  const filteredContacts = listData.filter((item) =>
  item.displayName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
  item.mobile?.includes(searchQuery)
);

const renderContactItem = ({ item }: { item: ContactInfo }) => (
  <TouchableHighlight
    style={styles.rowFront}
    underlayColor={'#AAA'}
    onPress={() => showProfile(null, item.id)} // Use showProfile to navigate on click
  >
    <ContactCard contactInfo={item} />
  </TouchableHighlight>
);



return (
  <View style={styles.container}>
    <View style={styles.header}>
      <Text style={styles.headerText}>Total Contacts: {listData.length}</Text>
      <Text
        style={styles.searchText}
        onPress={() => setShowSearchInput(!showSearchInput)}
      >
        🔍
      </Text>
      {showSearchInput && (
        <TextInput
          style={styles.searchInput}
          placeholder="Search contacts"
          value={searchQuery}
          onChangeText={(text) => setSearchQuery(text)}
        />
      )}
    </View>
      <Text
        style={styles.addIcon}
        onPress={() => navigation.navigate('AddNewContact')}
      >
        ➕
      </Text>
      <GestureHandlerRootView>
        <SwipeListView
          data={filteredContacts}
          renderItem={({ item }) => renderContactItem({ item })}
          renderHiddenItem={(data: any, rowMap: any) => (
            <View style={styles.rowBack}>
              <TouchableOpacity
                style={[styles.backLeftBtn, styles.backBtn]}
                onPress={() => showProfile(rowMap, data.item.id)}
              >
                <Text style={styles.backTextWhite}>Show</Text>
              </TouchableOpacity>
        
              <TouchableOpacity
                style={[styles.backRightBtn, styles.backRightBtnRight]}
              >
                <Text>Delete</Text>
                <Text
                  style={styles.backTextWhite}
                  onPress={() =>
                    Alert.alert('Delete', 'Deleted contact not restored', [
                      {
                        text: 'Cancel',
                        onPress: () => console.warn('Cancel Pressed'),
                        style: 'cancel',
                      },
                      {
                        text: 'OK',
                        // onPress: () => deleteContact(data.item.id),
                        style: 'default',
                      },
                    ])
                  }
                />
              </TouchableOpacity>
            </View>
          )}
          leftOpenValue={75}
          rightOpenValue={-75}
          previewRowKey={'0'}
          previewOpenValue={-40}
          previewOpenDelay={5000}
        />
      </GestureHandlerRootView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  searchText: {
    fontSize: 30,
    color: 'blue',
    marginLeft: 10,
  },
  addIcon: {
    bottom: 20,
    right: 20,
    position: 'absolute',
    zIndex: 1,
    fontSize: 30,
    color: 'green',
  },
  rowFront: {
    backgroundColor: 'white',
    justifyContent: 'center',
  },
  rowBack: {
    alignItems: 'center',
    backgroundColor: '#DDD',
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingLeft: 15,
  },
  searchInput: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    margin: 10,
    paddingLeft: 10,
  },
  backRightBtn: {
    alignItems: 'center',
    bottom: 0,
    justifyContent: 'center',
    position: 'absolute',
    top: 0,
    width: 75,
  },
  backRightBtnRight: {
    backgroundColor: 'tomato',
    right: 0,
  },
  backLeftBtn: {
    alignItems: 'center',
    bottom: 0,
    justifyContent: 'center',
    position: 'absolute',
    top: 0,
    width: 75,
  },
  backBtn: {
    backgroundColor: 'indigo',
    left: 0,
  },
  backTextWhite: {
    color: '#FFF',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 10,
    backgroundColor: '#F2F2F2',
  },
  headerText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default ContactList;
