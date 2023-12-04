import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { useIsFocused } from '@react-navigation/native';
import { ContactInfo } from '../components/contactIcon';
import AsyncStorage from '@react-native-async-storage/async-storage';
const FavoriteContact: React.FC<{ navigation: any }> = ({ navigation }) => {
  const isFocused = useIsFocused();
  const [favoriteList, setFavoriteList] = useState<ContactInfo[]>([]);

  const getAllFavContacts = async () => {
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
  
      // Update the favorite contact list
      setFavoriteList(loadedContacts);
    } catch (error) {
      console.error('Error loading favorite contacts:', error);
    }
  };
  

  const myFavList = favoriteList
    .filter((item) => item.favorite === true)
    .map(({ id, displayName, mobile, email }) => ({ id, displayName, mobile, email }));

  useEffect(() => {
    getAllFavContacts();
  }, [isFocused]);

  return (
    <View>
      <FlatList
        data={myFavList}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => navigation.navigate('Profile', { contactInfo: { id: item.id } })}>
            <View style={styles.card}>
              <View style={styles.infoContainer}>
                <View style={{ ...styles.icon }}>
                  <Text style={styles.iconContent}>{item.displayName[0]}</Text>
                </View>
                <Text style={styles.primaryText}>{item.displayName}</Text>
              </View>
            </View>
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    padding: 10,
    margin: 5,
  },
  infoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 5,
  },
  primaryText: {
    fontSize: 18,
  },
  iconContent: {
    flex: 1,
    paddingVertical: 5,
    fontSize: 24,
    color: 'white',
    marginHorizontal: 10,
  },
  icon: {
    borderRadius: 25,
    aspectRatio: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 15,
    padding: 1,
    backgroundColor: 'green',
  },
});

export default FavoriteContact;
