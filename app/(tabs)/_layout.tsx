import { Tabs } from 'expo-router';
import { Car, Search, Wrench } from 'lucide-react-native';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: true,
        tabBarStyle: {
          backgroundColor: '#FF0000',
        },
        tabBarActiveTintColor: '#FFD700',
        tabBarInactiveTintColor: '#FFFFFF',
        headerStyle: {
          backgroundColor: '#FF0000',
        },
        headerTintColor: '#FFFFFF',
        headerTitleStyle: {
          fontFamily: 'Inter-Bold',
        },
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Categorías',
          tabBarIcon: ({ color, size }) => (
            <Car size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="search"
        options={{
          title: 'Buscar',
          tabBarIcon: ({ color, size }) => (
            <Search size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="workshops"
        options={{
          title: 'Talleres',
          tabBarIcon: ({ color, size }) => (
            <Wrench size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}