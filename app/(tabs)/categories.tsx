import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { 
  Wine as Engine, 
  Snowflake as AirConditioning, 
  Zap as Alternator, 
  Disc, 
  Car as Body, 
  Thermometer as Radiator, 
  Bolt as Electric, 
  Gauge, 
  Cog as Suspension, 
  Wind as Exhaust 
} from 'lucide-react-native';

const categories = [
  { id: 1, name: 'Motor', icon: Suspension, color: '#4CAF50' },
  { id: 2, name: 'Aire Acondicionado', icon: AirConditioning, color: '#03A9F4' },
  { id: 3, name: 'Alternador/Encendido', icon: Alternator, color: '#FFC107' },
  { id: 4, name: 'Frenos', icon: Disc, color: '#F44336' },
  { id: 5, name: 'Carrocería', icon: Body, color: '#9E9E9E' },
  { id: 6, name: 'Radiador y partes', icon: Radiator, color: '#FF5722' },
  { id: 7, name: 'Eléctrico', icon: Electric, color: '#673AB7' },
  { id: 8, name: 'Transmisión', icon: Gauge, color: '#9C27B0' },
  { id: 9, name: 'Suspensión y Dirección', icon: Suspension, color: '#2196F3' },
  { id: 10, name: 'Sistema de escape', icon: Exhaust, color: '#795548' },
];

export default function Categories() {
  const router = useRouter();

  return (
    <ScrollView style={styles.container}>
      <View style={styles.grid}>
        {categories.map((category) => {
          const Icon = category.icon;
          return (
            <TouchableOpacity
              key={category.id}
              style={styles.categoryCard}
              onPress={() => router.push({
                pathname: '/search',
                params: { category: category.name }
              })}
            >
              <View style={[styles.iconContainer, { backgroundColor: category.color }]}>
                <Icon size={32} color="white" />
              </View>
              <Text style={styles.categoryName}>{category.name}</Text>
            </TouchableOpacity>
          );
        })}
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