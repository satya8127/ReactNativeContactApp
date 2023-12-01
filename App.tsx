import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import { Text } from 'react-native';
import ContactList from './tabs/Contacts';
import CreateContact from './tabs/NewContact';
import { createStackNavigator } from '@react-navigation/stack';
import MyProfile from './tabs/MyProfile';
import FavoriteContact from './tabs/FavoriteContact';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

const TabNavigator: React.FC = () => (
  <Tab.Navigator
    screenOptions={({ route }) => ({
      tabBarLabel: ({ focused, color }) => {     

        return <Text style={{ color, fontSize: 16, fontWeight: focused ? 'bold' : 'normal' }}>Contacts</Text>;
      },
      tabBarIcon:()=>{
          return <Text>👥 </Text>  
      }
    })}
  >
    <Tab.Screen name="ContactList" component={ContactList} />
    <Tab.Screen name="FavoriteContact" component={FavoriteContact} />
  </Tab.Navigator>
);

const App: React.FC = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="TabScreen"
          component={TabNavigator}
          options={{ headerShown: false }}
        />
        <Stack.Screen name="AddNewContact" component={CreateContact} />
        <Stack.Screen name="MyProfile" component={MyProfile } />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
