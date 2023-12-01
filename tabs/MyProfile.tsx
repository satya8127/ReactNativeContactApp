import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  Dimensions,
  StatusBar,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { getColorByLetter } from '../utils/jsfile';
import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import API_URL from '../utils/environment';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ContactInfo } from '../components/contactIcon';



interface MyProfileProps {
  navigation: StackNavigationProp<any>;
  route: RouteProp<any, 'MyProfile'>;
}

const MyProfile: React.FC<MyProfileProps> = ({ navigation, route }) => {
  const [contactCardInfo, setContactInfo] = useState<ContactInfo>({
    id: '',
    displayName: '',
    color: '',
    mobile: '',
    landline: '',
      favorite: false,
      image: ''
  });

  useEffect(() => {
    if (route.params?.contactInfo) {
      const { id, displayName, mobile, landline } = route.params.contactInfo;
      setContactInfo({
        id,
        displayName,
        color: getColorByLetter(displayName[0]),
        mobile,
        landline,
        favorite: false,
        image: ''
      });
    }
  }, [route.params?.contactInfo]);
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
  
      // Update the contact list state in the 'ContactList' screen if needed
  
      // Navigate to the 'ContactList' screen
      navigation.navigate('ContactList');
    } catch (error) {
      console.error('Error deleting contact:', error);
    }
  };
  
  
  
  
  
  function addToFavorite(updateContactList: () => void): void {
    // Assuming that contactCardInfo is a state variable.
    // You need to update the favorite status of the contact.
    const updatedContactInfo = { ...contactCardInfo, favorite: true };
  
    // Update the state with the new contact information.
    setContactInfo(updatedContactInfo);
  
    // Now, you might want to update this information in your persistent storage.
    // This depends on how you're storing and managing your contact data.
  
    // Example: Update AsyncStorage
    // Note: AsyncStorage is asynchronous, so you can use async/await or handle promises.
    const updateFavoriteInStorage = async () => {
      try {
        const contactId = updatedContactInfo.id.replace('contact_', '');
  
        // Fetch the existing data from AsyncStorage
        const storedData = await AsyncStorage.getItem(contactId);
  
        if (storedData) {
          const parsedData: ContactInfo = JSON.parse(storedData);
  
          // Update the favorite status
          const updatedData = { ...parsedData, favorite: true };
  
          // Save the updated data back to AsyncStorage
          await AsyncStorage.setItem(contactId, JSON.stringify(updatedData));
  
          console.log('Contact marked as favorite in AsyncStorage:', updatedData);
  
          // Trigger the callback to update the contact list
          updateContactList();
        }
      } catch (error) {
        console.error('Error updating favorite status in AsyncStorage:', error);
      }
    };
  
    updateFavoriteInStorage();
  }
  
  

  return (
    <View style={styles.container}>
      <View style={{ ...styles.backgroundImage, backgroundColor: contactCardInfo.color }}>
        <Text style={styles.iconText}>👤</Text> 

        <TouchableOpacity
  onPress={() =>
    Alert.alert('Delete', 'Deleted contact not restored', [
      {
        text: 'Cancel',
        onPress: () => console.warn('Cancel Pressed'),
        style: 'cancel',
      },
      {
        text: 'OK',
        onPress: () => deleteContact(contactCardInfo.id.replace('contact_', '')), // <-- Remove the 'contact_' prefix
        style: 'default',
      },
    ])
  }
  style={{ ...styles.iconContainer, top: StatusBar.currentHeight || 0, right: 20 }}
>
  <Text style={styles.iconText}>🗑️</Text>
</TouchableOpacity>

        <TouchableOpacity
          onPress={() =>
            Alert.alert('Favorite', 'Added to favorite contact list', [
              {
                text: 'Cancel',
                onPress: () => console.warn('Cancel Pressed'),
                style: 'cancel',
              },
              {
                text: 'OK',
                onPress: () => addToFavorite(route.params?.updateContactList), 
              },
            ])
          }
          style={{ ...styles.iconContainer, top: StatusBar.currentHeight || 0 + 80, left: 20 }}
        >
          <Text style={styles.iconText}>⭐</Text>
        </TouchableOpacity>
        <Text style={styles.mainText}>{contactCardInfo.displayName}</Text>
        </View>
      {/* </ImageBackground> */}
      <View style={{ flex: 1, marginTop: 20, backgroundColor: 'white' }}>
        <View style={styles.phoneNumberContainer}>
          <Text style={{ fontSize: 20, fontWeight: 'bold', marginLeft: 10 }}>
            Mobile: +91 {contactCardInfo.mobile}
          </Text>
          <Text style={styles.iconText}>📞</Text>
        </View>
        <View style={styles.phoneNumberContainer}>
          <Text style={{ fontSize: 20, fontWeight: 'bold', marginLeft: 10 }}>
            Landline: +91 {contactCardInfo.landline}
          </Text>
          <Text style={styles.iconText}>📞</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  backgroundImage: {
    width: Dimensions.get('screen').width,
    height: Dimensions.get('screen').height / 3,
    alignItems: 'center',
    justifyContent: 'center',
  },
  mainText: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    fontSize: 30,
    color: 'white',
    fontWeight: 'bold',
  },
  phoneNumberContainer: {
    marginHorizontal: 10,
    marginBottom: 20,
    paddingHorizontal: 10,
    elevation: 5,
    paddingVertical: 10,
    backgroundColor: 'white',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  iconContainer: {
    position: 'absolute',
    padding: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: 5,
  },
  iconText: {
    color: 'white',
    fontSize: 50,
  },
});

export default MyProfile;
