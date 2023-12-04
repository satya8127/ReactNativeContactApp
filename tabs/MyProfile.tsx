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
  Image,
} from 'react-native';
import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
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
    email: '',
      favorite: false,
      image: ''
  });

  useEffect(() => {
    if (route.params?.contactInfo) {
      const { id, displayName, mobile, email } = route.params.contactInfo;
      setContactInfo({
        id,
        displayName,
        color: '#E1E8FF',
        mobile,
        email,
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

      navigation.navigate('ContactList');
    } catch (error) {
      console.error('Error deleting contact:', error);
    }
  };
  
  
  
  const addToFavorite = async (updateContactList: () => void, updateFavoriteList: () => void): Promise<void> => {
    try {
      const contactId = contactCardInfo.id.replace('contact_', ''); // Use contactCardInfo instead of updatedContactInfo
      const storedData = await AsyncStorage.getItem(contactId);
  
      if (storedData) {
        const parsedData: ContactInfo = JSON.parse(storedData);
        const updatedData = { ...parsedData, favorite: true };
  
        await AsyncStorage.setItem(contactId, JSON.stringify(updatedData));
  
        console.log('Contact marked as favorite in AsyncStorage:', updatedData);
  
        updateContactList();
        updateFavoriteList();
      }
    } catch (error) {
      console.error('Error updating favorite status in AsyncStorage:', error);
    }
  };
  

  
  

  return (
    <View style={styles.container}>
      <View style={{ ...styles.backgroundImage, backgroundColor: '#E1E8FF' }}>
<Image
                        style={{width: 80, height: 80, borderRadius: 50}}
                        source={require('../images/download.png')}
                      />
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
        onPress: () => deleteContact(contactCardInfo.id.replace('contact_', '')),
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
                onPress: () => addToFavorite(route.params?.updateContactList, route.params?.updateFavoriteList),
              },
            ])
          }
          style={{ ...styles.iconContainer, top: StatusBar.currentHeight || 0 + 80, left: 20 }}
        >
          <Text style={styles.iconText}>⭐</Text>
        </TouchableOpacity>
        <Text style={styles.mainText}>{contactCardInfo.displayName}</Text>
        </View>
     
      <View style={{ flex: 1, marginTop: 20, backgroundColor: 'white' }}>
        <View style={styles.phoneNumberContainer}>
          <Text style={{ fontSize: 20, fontWeight: 'bold', marginLeft: 10 }}>
            Mobile: +91 {contactCardInfo.mobile}
          </Text>
          <Text style={styles.iconText}>📞</Text>
        </View>
        <View style={styles.phoneNumberContainer}>
          <Text style={{ fontSize: 20, fontWeight: 'bold', marginLeft: 10 }}>
            Email:  {contactCardInfo.email}
          </Text>
          <Text style={styles.iconText}>✉️</Text>
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
    color: '#4C6FFF',
    fontWeight: 'bold',
    textTransform:'uppercase'
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
    color: '#4C6FFF',
    fontSize: 30,
  },
});

export default MyProfile;
