// ContactCard.tsx
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { getColorByLetter } from '../utils/jsfile';

export type ContactInfo = {
  id: string;
  displayName: string;
  color: string;
  mobile: string;
  landline: string;
  favorite: boolean;
  image: string;
  // Add other properties of ContactInfo
};

type ContactCardProps = {
  contactInfo: ContactInfo;
};

const ContactCard: React.FC<ContactCardProps> = ({ contactInfo }) => {
  const { displayName, mobile } = contactInfo;

  const color = getColorByLetter(displayName[0]);

  return (
    <View style={styles.card}>
      <View style={styles.infoContainer}>
        <View style={{ ...styles.icon, backgroundColor: color }}>
          <Text style={styles.iconContent}>{displayName[0]}</Text>
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

export default ContactCard;
