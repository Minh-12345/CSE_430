import React from 'react';
import { StyleSheet, View, Text, Alert, Button } from "react-native";
import ContactThumb from './ContactThumb';
import DetailListItem from './DetailListItem';
import { IconButton } from 'react-native-paper';

const ProfileContact = ({ route }) => {
  const { contact } = route.params;
  const { id, avatar, name, email, phone, cell, favorite } = contact;

  return (
    <View style={styles.container}>
      <View style={styles.avatarSection}>
        <ContactThumb avatar={avatar} name={name} phone={phone} />
      </View>
      <View style={styles.detailsSection}>
        <DetailListItem icon="mail" title="Email" subtitle={email} />
        <DetailListItem icon="phone" title="Work" subtitle={phone} />
        <DetailListItem icon="smartphone" title="Personal" subtitle={cell} />
        <View style={{ alignItems: 'center' }}>
          <IconButton
            icon={favorite ? "star-check" : "star-check-outline"}
            iconColor="#100916ff"
            size={20}
            onPress={() => {
            
            }}
          />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  avatarSection: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'blue',
  },
  detailsSection: {
    flex: 1,
    backgroundColor: 'white',
  },
});

export default ProfileContact;
