import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { useIsFocused } from '@react-navigation/native';
import API_URL from '../utils/environment';
import { ContactInfo } from '../components/contactIcon';


// interface ContactInfo {
//   id: string;
//   displayName: string;
//   mobile: string;
//   landline: string;
//   favorite: boolean; // Assuming there's a 'favorite' property in your ContactInfo
// }

const FavoriteContact: React.FC<{ navigation: any }> = ({ navigation }) => {
  const isFocused = useIsFocused();
  const [favoriteList, setFavoriteList] = useState<ContactInfo[]>([]);

  const getAllFavContacts = async () => {
    const url = API_URL;
    try {
      const res = await fetch(url);
      const data: ContactInfo[] = await res.json();

      if (Array.isArray(data)) {
        console.log(data);
        setFavoriteList(data);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const myFavList = favoriteList
    .filter((item) => item.favorite === true)
    .map(({ id, displayName, mobile, landline }) => ({ id, displayName, mobile, landline }));

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
