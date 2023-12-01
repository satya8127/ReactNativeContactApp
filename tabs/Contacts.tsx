import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Alert,
  TouchableHighlight,
  TextInput,
} from 'react-native';
import { useIsFocused } from '@react-navigation/native';
import { SwipeListView } from 'react-native-swipe-list-view';
import { GestureHandlerRootView, TouchableOpacity } from 'react-native-gesture-handler';
import API_URL from '../utils/environment';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ContactCard, { ContactInfo } from '../components/contactIcon';
import { getColorByLetter } from '../utils/jsfile';

interface ContactListProps {
  navigation: any; // Replace with your specific navigation type
  route: any; // Replace with your specific route type
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
          const contactData = JSON.parse(value || ''); // Use an empty string as a default
          return {
            id: key,
            displayName: contactData?.displayName || '', // Use an empty string as a default
            hasThumbnail: true, // You may need to update this based on your data structure
            thumbNailpath: '',
            color: getColorByLetter(contactData?.displayName[0]), // Assuming getColorByLetter is a function
            mobile: contactData?.mobile || '', // Use an empty string as a default
            landline: contactData?.landline || '', // Use an empty string as a default
            favorite: contactData?.favorite || false, // Use false as a default
            image: contactData?.image || '', // Use an empty string as a default
          };
        })
        .filter((contact) => contact.displayName !== ''); // Remove contacts with empty displayName
  
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

  // const deleteContact = async (id: string) => {
  //   const url = API_URL;
  //   let res = await fetch(`${url}/${id}`, {
  //     method: 'delete',
  //   });
  //   res = await res.json();
  //   if (res) {
  //     deleteRow(id);
  //   }
  // };

  const showProfile = (rowMap: any, rowKey: string) => {
    const selectedContact = listData.find((contact) => contact.id === rowKey);
  
    if (selectedContact) {
      navigation.navigate('MyProfile', {
        contactInfo: {
          id: selectedContact.id,
          displayName: selectedContact.displayName,
          mobile: selectedContact.mobile,
        landline: selectedContact.landline
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

      {/* <TouchableOpacity
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
      </TouchableOpacity> */}
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
      <View>
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
          renderHiddenItem={renderHiddenItem}
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
});

export default ContactList;
