import React, { useState } from 'react';
import { Image, StyleSheet, TextInput, Button, View, ScrollView, Text, ActivityIndicator, Alert } from 'react-native';
import axios from 'axios';

import { HelloWave } from '@/components/HelloWave';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';

export default function HomeScreen() {
  const [brand, setBrand] = useState('');
  const [model, setModel] = useState('');
  const [part, setPart] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchData = async () => {
    // Validate inputs
    if (!brand || !model || !part) {
      Alert.alert('Validation Error', 'Please fill in all fields before searching.');
      return;
    }

    setLoading(true);
    try {
      const url = `https://servicio.repara503.site/consulta-partes-API/api/usados/parte?marca=${brand}&modelo=${model}&parte=${part}`;
      const response = await axios.get(url, {
        headers: {
          Accept: 'application/json',
        },
      });
      setResults(response.data);
    } catch (error) {
      console.error('Error fetching data:', error);
      Alert.alert('Error', 'Failed to fetch data. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#A1CEDC', dark: '#1D3D47' }}
      headerImage={
        <Image
          source={require('@/assets/images/partial-react-logo.png')}
          style={styles.reactLogo}
        />
      }>
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">Welcome!</ThemedText>
        <HelloWave />
      </ThemedView>

      {/* Search Section */}
      <ThemedView style={styles.searchContainer}>
        <TextInput
          style={styles.input}
          placeholder="Enter Brand"
          value={brand}
          onChangeText={setBrand}
          accessibilityLabel="Brand Input"
        />
        <TextInput
          style={styles.input}
          placeholder="Enter Model"
          value={model}
          onChangeText={setModel}
          accessibilityLabel="Model Input"
        />
        <TextInput
          style={styles.input}
          placeholder="Enter Part"
          value={part}
          onChangeText={setPart}
          accessibilityLabel="Part Input"
        />
        <Button title="Search" onPress={fetchData} accessibilityLabel="Search Button" />
      </ThemedView>

      {/* Results Section */}
      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <ScrollView style={styles.resultsContainer}>
          {results.length > 0 ? (
            results.map((item, index) => (
              <View key={item.id || index} style={styles.resultItem}>
                <Text style={styles.partName}>{item.name}</Text>
                <Text style={styles.partDetails}>Part Number: {item.partNumber}</Text>
                <Text style={styles.partPrice}>Price: {item.price}</Text>
              </View>
            ))
          ) : (
            <Text>No results found</Text>
          )}
        </ScrollView>
      )}
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  searchContainer: {
    padding: 16,
    gap: 8,
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 8,
  },
  resultsContainer: {
    padding: 16,
  },
  resultItem: {
    backgroundColor: '#f8f8f8',
    padding: 16,
    marginBottom: 8,
    borderRadius: 8,
  },
  partName: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  partDetails: {
    fontSize: 14,
    color: '#555',
  },
  partPrice: {
    fontSize: 14,
    color: '#2A9D8F',
    marginTop: 5,
  },
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: 'absolute',
  },
});
