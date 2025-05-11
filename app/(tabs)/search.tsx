import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert, TextInput, Modal, Button, Linking, Image } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import axios from 'axios';

export default function Search() {
  const [catalog, setCatalog] = useState({}); // Estado para el catálogo dinámico
  const [selectedBrand, setSelectedBrand] = useState('');
  const [selectedModel, setSelectedModel] = useState('');
  const [part, setPart] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedResult, setSelectedResult] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  // Función para obtener el catálogo desde la API
  const fetchCatalog = async () => {
    try {
      const response = await axios.get('https://servicio.repara503.site/consulta-partes-API/api/usados/marcasymodelos');
      const data = response.data;

      // Transformar los datos en un formato adecuado para el Picker
      const transformedCatalog = data.reduce((acc, item) => {
        if (!acc[item.marca]) {
          acc[item.marca] = [];
        }
        acc[item.marca].push(item.modelo);
        return acc;
      }, {});

      setCatalog(transformedCatalog);
    } catch (error) {
      console.error('Error fetching catalog:', error);
      Alert.alert('Error', 'No se pudo obtener el catálogo. Intente nuevamente más tarde.');
    }
  };

  // Llamar a la API al montar el componente
  useEffect(() => {
    fetchCatalog();
  }, []);

  const fetchData = async () => {
    if (!selectedBrand || !selectedModel || !part) {
      Alert.alert('Error de Validación', 'Por favor, seleccione una marca, un modelo y escriba la parte a buscar.');
      return;
    }

    setLoading(true);
    try {
      const url = `https://servicio.repara503.site/consulta-partes-API/api/usados/parte?marca=${selectedBrand}&modelo=${selectedModel}&parte=${part}`;
      const response = await axios.get(url, {
        headers: {
          Accept: 'application/json',
        },
      });
      setResults(response.data);
    } catch (error) {
      console.error('Error fetching data:', error);
      Alert.alert('Error', 'No se pudo obtener la información. Intente nuevamente más tarde.');
    } finally {
      setLoading(false);
    }
  };

  const handleSelectResult = (item) => {
    setSelectedResult(item);
    setModalVisible(true);
  };

  const handleContact = (empresa) => {
    let phoneNumber = '';
    if (empresa === 'Pana Autoparts') {
      phoneNumber = 'tel:22577777';
    } else if (empresa === 'Rivas Autoparts') {
      phoneNumber = 'tel:22736000';
    } else {
      Alert.alert('Contacto', 'Empresa no reconocida.');
      return;
    }

    Linking.openURL(phoneNumber).catch((err) =>
      Alert.alert('Error', 'No se pudo abrir el marcador telefónico.')
    );
  };

  return (
    <View style={styles.container}>
      {/* Selector de Marca */}
      <Text style={styles.label}>Seleccione una Marca:</Text>
      <Picker
        selectedValue={selectedBrand}
        onValueChange={(itemValue) => {
          setSelectedBrand(itemValue);
          setSelectedModel('');
        }}
        style={styles.picker}
      >
        <Picker.Item label="Seleccione una marca" value="" />
        {Object.keys(catalog).map((brand) => (
          <Picker.Item key={brand} label={brand} value={brand} />
        ))}
      </Picker>

      {/* Selector de Modelo */}
      {selectedBrand ? (
        <>
          <Text style={styles.label}>Seleccione un Modelo:</Text>
          <Picker
            selectedValue={selectedModel}
            onValueChange={(itemValue) => setSelectedModel(itemValue)}
            style={styles.picker}
          >
            <Picker.Item label="Seleccione un modelo" value="" />
            {catalog[selectedBrand]?.map((model) => (
              <Picker.Item key={model} label={model} value={model} />
            ))}
          </Picker>
        </>
      ) : null}

      {/* Campo de entrada para la parte */}
      {selectedModel ? (
        <>
          <Text style={styles.label}>Ingrese la Parte a Buscar:</Text>
          <TextInput
            style={styles.input}
            placeholder="Ejemplo: Filtro de aire"
            value={part}
            onChangeText={setPart}
          />
        </>
      ) : null}

      {/* Botón de búsqueda */}
      <TouchableOpacity style={styles.searchButton} onPress={fetchData}>
        <Text style={styles.searchButtonText}>Buscar</Text>
      </TouchableOpacity>

      {/* Resultados */}
      {loading ? (
        <Text style={styles.loadingText}>Cargando...</Text>
      ) : (
        <FlatList
          data={results}
          keyExtractor={(item, index) => item.id || index.toString()}
          renderItem={({ item }) => (
            <TouchableOpacity onPress={() => handleSelectResult(item)}>
              <View style={styles.resultCard}>
                {/* Imagen genérica */}
                <Image
                  source={require('../../assets/images/imagen_repuestos.jpg')} // Ruta de la imagen
                  style={styles.resultImage}
                  resizeMode="contain"
                />
                <Text style={styles.resultText}>
                  <Text style={styles.partName}>Parte:</Text> {item.descripcion}
                </Text>
                <Text style={styles.resultText}>
                  <Text style={styles.boldText}>Modelo:</Text> {item.modelo}
                </Text>
                <Text style={styles.resultText}>
                  <Text style={styles.boldText}>Año:</Text> {item.ano}
                </Text>
                <Text style={styles.resultText}>
                  <Text style={styles.boldText}>Empresa:</Text> {item.nombreEmpresa}
                </Text>
              </View>
            </TouchableOpacity>
          )}
          ListEmptyComponent={<Text style={styles.noResultsText}>No se encontraron resultados.</Text>}
        />
      )}

      {/* Modal para mostrar detalles del resultado seleccionado */}
      {selectedResult && (
        <Modal
          visible={modalVisible}
          animationType="slide"
          transparent={true}
          onRequestClose={() => setModalVisible(false)}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              {/* Imagen genérica en la modal */}
              <Image
                source={require('../../assets/images/imagen_repuestos.jpg')} // Ruta de la imagen
                style={styles.modalImage}
                resizeMode="contain"
              />
              <Text style={styles.modalTitle}>Detalles de la Parte</Text>
              <Text style={styles.modalText}>
                <Text style={styles.boldText}>Parte:</Text> {selectedResult.descripcion}
              </Text>
              <Text style={styles.modalText}>
                <Text style={styles.boldText}>Modelo:</Text> {selectedResult.modelo}
              </Text>
              <Text style={styles.modalText}>
                <Text style={styles.boldText}>Año:</Text> {selectedResult.ano}
              </Text>
              <Text style={styles.modalText}>
                <Text style={styles.boldText}>Empresa:</Text> {selectedResult.nombreEmpresa}
              </Text>
              {/* Nuevos campos */}
              <Text style={styles.modalText}>
                <Text style={styles.boldText}>Venta:</Text> {selectedResult.venta || 'No disponible'}
              </Text>
              <Text style={styles.modalText}>
                <Text style={styles.boldText}>Código de Inventario:</Text> {selectedResult.codigo_inventario}
              </Text>
              <Text style={styles.modalText}>
                <Text style={styles.boldText}>Equivalencias:</Text> {selectedResult.equivalencias}
              </Text>
              <Text style={styles.modalText}>
                <Text style={styles.boldText}>Tipo:</Text> {selectedResult.tipo}
              </Text>
              <TouchableOpacity
                style={styles.contactButton}
                onPress={() => handleContact(selectedResult.nombreEmpresa)}
              >
                <Text style={styles.contactButtonText}>Contactar Empresa para hacer pedido</Text>
              </TouchableOpacity>
              <Button title="Cerrar" onPress={() => setModalVisible(false)} />
            </View>
          </View>
        </Modal>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f5f5f5',
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  picker: {
    backgroundColor: '#fff',
    borderRadius: 8,
    marginBottom: 16,
  },
  input: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    marginBottom: 16,
  },
  searchButton: {
    backgroundColor: '#FF0000',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 16,
  },
  searchButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  loadingText: {
    textAlign: 'center',
    fontSize: 16,
    marginVertical: 16,
  },
  resultCard: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 8,
    marginBottom: 8,
  },
  resultImage: {
    width: '100%',
    height: 150,
    marginBottom: 10,
    borderRadius: 8,
  },
  resultText: {
    fontSize: 14,
    color: '#333',
    marginBottom: 4,
  },
  boldText: {
    fontWeight: 'bold',
  },
  noResultsText: {
    textAlign: 'center',
    fontSize: 16,
    color: '#555',
    marginTop: 20,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    width: '80%',
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  modalText: {
    fontSize: 16,
    marginBottom: 10,
  },
  contactButton: {
    backgroundColor: '#FF0000',
    padding: 10,
    borderRadius: 8,
    marginTop: 10,
  },
  contactButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  modalImage: {
    width: '100%',
    height: 200,
    marginBottom: 20,
    borderRadius: 8,
  },
});