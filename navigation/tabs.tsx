import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { NavigationContainer } from '@react-navigation/native';
import Home from "../pages/index";
import Record from "../pages/record";
import Profile from "../pages/profile";
import Login from '../pages/login';
import Register from '../pages/register';
import { useAuth } from '../app/context/AuthContext';

const Tab = createBottomTabNavigator();

export function Tabs() {
  const { user } = useAuth(); // Use context or auth state to determine if the user is logged in

  return (
    
      <Tab.Navigator>
        {user ? (
          <>
            <Tab.Screen name="Record" component={Record} />
            {/* Add other tabs for authenticated users */}
          </>
        ) : (
          <>
            <Tab.Screen name="Login" component={Login} />
            <Tab.Screen name="Register" component={Register} />
          </>
        )}
      </Tab.Navigator>
  )
}
