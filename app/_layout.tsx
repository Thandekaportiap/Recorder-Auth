import { StatusBar } from "expo-status-bar";
import { Tabs } from "../navigation/tabs";
import { AuthProvider } from "../app/context/AuthContext";

export default function App() {
  return (
    <AuthProvider>
      <Tabs />
      <StatusBar style="auto" />
    </AuthProvider>
  );
}


