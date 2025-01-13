// Record.tsx
import React, { useEffect, useState } from 'react';
import { View, Text, Button } from 'react-native';
import { getAuth, onAuthStateChanged, signOut } from 'firebase/auth';
import { auth } from '../firebase';

const Record = ({ navigation }: { navigation: any }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
      } else {
        navigation.navigate('Login'); // Redirect to login if user is not authenticated
      }
    });

    return unsubscribe;
  }, [navigation]);

  const handleLogout = async () => {
    await signOut(auth);
    navigation.navigate('Login'); // Navigate to Login screen after logout
  };

  return (
    <View>
      {user ? (
        <>
          <Text>Welcome, {user.email}</Text>
          <Button title="Logout" onPress={handleLogout} />
          {/* Add your recording functionality here */}
        </>
      ) : (
        <Text>Loading...</Text>
      )}
    </View>
  );
};

export default Record;
