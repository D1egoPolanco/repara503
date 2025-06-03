import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';

export default function Welcome() {
  const router = useRouter();

  return (
    <LinearGradient
      colors={['#FF0000', '#FFD700']}
      style={styles.container}
    >
      <View style={styles.content}>
        <Image
          source={{ uri: 'https://images.unsplash.com/photo-1631467685497-003bfefbe302?w=500' }}
          style={styles.logo}
        />
        <Text style={styles.title}>Repara503</Text>
        <Text style={styles.subtitle}>Tu marketplace de repuestos</Text>
        
        <TouchableOpacity
          style={styles.button}
          onPress={() => router.replace('/(tabs)')}
        >
          <Text style={styles.buttonText}>Comenzar</Text>
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  logo: {
    width: 150,
    height: 150,
    borderRadius: 75,
    marginBottom: 20,
  },
  title: {
    fontFamily: 'Inter-Bold',
    fontSize: 36,
    color: 'white',
    marginBottom: 10,
  },
  subtitle: {
    fontFamily: 'Inter-Regular',
    fontSize: 18,
    color: 'white',
    textAlign: 'center',
    marginBottom: 40,
  },
  button: {
    backgroundColor: 'white',
    paddingHorizontal: 40,
    paddingVertical: 15,
    borderRadius: 25,
  },
  buttonText: {
    fontFamily: 'Inter-Bold',
    fontSize: 18,
    color: '#FF0000',
  },
});