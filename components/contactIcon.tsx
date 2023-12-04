// ContactCard.tsx
import React from 'react';
import { View, Text, StyleSheet, Pressable, Image } from 'react-native';

export type ContactInfo = {
  id: string;
  displayName: string;
  color: string;
  mobile: string;
  email: string;
  favorite: boolean;
  image: string;
  // Add other properties of ContactInfo
};

type ContactCardProps = {
  contactInfo: ContactInfo;
};

const ContactCard: React.FC<ContactCardProps> = ({ contactInfo }) => {
  const { displayName, mobile } = contactInfo;

  return (
    <View style={styles.card}>
      <View style={styles.infoContainer}>
        <View style={{}}>
          <Pressable onPress={() => {}}>
                      <Image
                        style={{width: 40, height: 40, borderRadius: 50,marginRight:10}}
                        source={{
                          uri: `https://ui-avatars.com/api/?bold=true&background=E1E8FF&color=4C6FFF&name=${displayName[0]}`
                        }}
                      />
                    </Pressable>
        </View>
        <View>
          <Text style={styles.primaryText}>{displayName}</Text>
          <Text style={{ fontSize: 15 }}>+91 {mobile}</Text>
        </View>
      </View>
        
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
    fontSize: 20,
  },
  iconContent: {
    // flex: 1,
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

export default ContactCard;
