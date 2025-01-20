import React, { useEffect, useState } from "react";
import { View, Text, Button, StyleSheet, ActivityIndicator } from "react-native";
import { auth, firestore } from "../firebase"; // Ensure firestore is initialized in your firebase.js
import { doc, getDoc } from "firebase/firestore";
import { useRouter } from "expo-router";

export default function Profile() {
  const [userData, setUserData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const user = auth.currentUser;
  const router = useRouter();

  useEffect(() => {
    const fetchUserData = async () => {
      if (user) {
        const userDocRef = doc(firestore, "users", user.uid); // Reference to the user's document in Firestore
        const docSnap = await getDoc(userDocRef);

        if (docSnap.exists()) {
          setUserData(docSnap.data());
        } else {
          console.log("No user data found!");
        }
      }
      setLoading(false);
    };

    fetchUserData();
  }, [user]);

  const handleLogout = () => {
    auth.signOut();
    router.replace("/auth/login");
  };

  if (loading) {
    return <ActivityIndicator size="large" color="#78b3ce" style={styles.loader} />;
  }

  return (
    <View style={styles.container}>
      {userData ? (
        <>
          <Text style={styles.title}>Welcome to AudioSnap, {userData.name}!</Text>
          <Text style={styles.text}>Username: {userData.username}</Text>
          <Text style={styles.text}>Email: {user?.email}</Text>
        </>
      ) : (
        <Text style={styles.text}>User data is loading...</Text>
      )}
      <Button title="Logout" onPress={handleLogout} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", padding: 16 },
  title: { fontSize: 34, marginBottom: 16, fontWeight: "bold", color: '#78b3ce' },
  text: { fontSize: 18, color: '#78b3ce', marginBottom: 16 },
  loader: { flex: 1, justifyContent: "center" },
});
