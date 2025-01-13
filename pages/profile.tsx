// pages/profile.tsx
import React from "react";
import { View, Text, Button, StyleSheet } from "react-native";
import { auth } from "../firebase";
import { useRouter } from "expo-router";

export default function Profile() {
  const user = auth.currentUser;
  const router = useRouter();

  const handleLogout = () => {
    auth.signOut();
    router.replace("/auth/login");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Profile</Text>
      <Text>Email: {user?.email}</Text>
      <Button title="Logout" onPress={handleLogout} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", padding: 16 },
  title: { fontSize: 24, marginBottom: 16 },
});