import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { MaterialCommunityIcons, FontAwesome5, Feather } from '@expo/vector-icons';

const categories = [
  { id: 1, name: 'Motor', icon: (props) => <MaterialCommunityIcons name="engine" {...props} />, color: '#4CAF50' },
  { id: 2, name: 'Aire Acondicionado', icon: (props) => <MaterialCommunityIcons name="air-conditioner" {...props} />, color: '#03A9F4' },
  { id: 3, name: 'Alternador/Encendido', icon: (props) => <MaterialCommunityIcons name="car-battery" {...props} />, color: '#FFC107' },
  { id: 4, name: 'Frenos', icon: (props) => <MaterialCommunityIcons name="car-brake-abs" {...props} />, color: '#F44336' },
  { id: 5, name: 'Carrocería', icon: (props) => <FontAwesome5 name="car-side" {...props} />, color: '#9E9E9E' },
  { id: 6, name: 'Radiador y partes', icon: (props) => <MaterialCommunityIcons name="radiator" {...props} />, color: '#FF5722' },
  { id: 7, name: 'Eléctrico', icon: (props) => <Feather name="zap" {...props} />, color: '#673AB7' },
  { id: 8, name: 'Transmisión', icon: (props) => <MaterialCommunityIcons name="car-shift-pattern" {...props} />, color: '#9C27B0' },
  { id: 9, name: 'Suspensión y Dirección', icon: (props) => <MaterialCommunityIcons name="car-suspension" {...props} />, color: '#2196F3' },
  { id: 10, name: 'Sistema de escape', icon: (props) => <MaterialCommunityIcons name="tailpipe" {...props} />, color: '#795548' },
];

export default function Categories() {
  const router = useRouter();

  return (
    <ScrollView style={styles.container}>
      <View style={styles.grid}>
        {categories.map((category) => (
          <TouchableOpacity
            key={category.id}
            style={styles.categoryCard}
            onPress={() => router.push({
              pathname: '/search',
              params: { category: category.name }
            })}
          >
            <View style={[styles.iconContainer, { backgroundColor: category.color }]}>
              {category.icon({ size: 32, color: 'white' })}
            </View>
            <Text style={styles.categoryName}>{category.name}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 10,
  },
  categoryCard: {
    width: '45%',
    backgroundColor: 'white',
    margin: '2.5%',
    borderRadius: 15,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  iconContainer: {
    width: 70,
    height: 70,
    borderRadius: 35,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  categoryName: {
    fontFamily: 'Inter-Bold',
    fontSize: 16,
    textAlign: 'center',
  },
});