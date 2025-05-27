import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert, TextInput, Modal, Button, Linking, Image, ScrollView } from 'react-native';
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
  const [selectedCompany, setSelectedCompany] = useState(null);

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

  const handleSelectResult = async (item) => {
    try {
      // Intenta obtener el detalle (foto)
      const response = await axios.get(`https://servicio.repara503.site/consulta-partes-API/api/usados/${item.id}`);
      const detalle = response.data;
      setSelectedResult({ ...item, foto: detalle.foto });
      setModalVisible(true);
    } catch (error) {
      // Si falla, igual muestra el modal sin foto
      setSelectedResult(item);
      setModalVisible(true);
    }
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

  const groupResultsByCompany = (results) => {
    return results.reduce((acc, item) => {
      const empresa = item.nombreEmpresa || 'Otra';
      if (!acc[empresa]) acc[empresa] = [];
      acc[empresa].push(item);
      return acc;
    }, {});
  };

  const getCompanyImage = (empresa) => {
    if (empresa === 'Pana Autoparts') return require('../../assets/images/pana2.jpeg');
    if (empresa === 'Rivas Autoparts') return require('../../assets/images/Rivas.jpeg');
    if (empresa === 'Repara503') return require('../../assets/images/repara503.jpeg');
    return require('../../assets/images/imagen_repuestos.jpg');
  };

  // Agrupa los resultados por empresa
  const groupedResults = groupResultsByCompany(results);

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
      <TouchableOpacity
        style={[styles.searchButton, { backgroundColor: '#FF0000' }]}
        onPress={fetchData}
      >
        <Text style={styles.searchButtonText}>Buscar</Text>
      </TouchableOpacity>

      {/* Resultados */}
      {loading ? (
        <Text style={styles.loadingText}>Cargando...</Text>
      ) : selectedCompany ? (
        <>
          <TouchableOpacity
            style={[styles.resultCard, { backgroundColor: '#ffeaea', marginBottom: 16 }]}
            onPress={() => setSelectedCompany(null)}
          >
            <Text style={{ fontWeight: 'bold', color: '#FF0000' }}>← Volver a empresas</Text>
          </TouchableOpacity>
          <FlatList
            data={groupedResults[selectedCompany]}
            keyExtractor={(item, index) => `${item.id ?? ''}-${index}`}
            renderItem={({ item }) => (
              <TouchableOpacity onPress={() => handleSelectResult(item)}>
                <View style={styles.resultCard}>
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
        </>
      ) : (
        <FlatList
          data={Object.keys(groupedResults)}
          keyExtractor={(empresa) => empresa}
          renderItem={({ item: empresa }) => (
            <TouchableOpacity
              style={styles.resultCard}
              onPress={() => setSelectedCompany(empresa)}
            >
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Image
                  source={getCompanyImage(empresa)}
                  style={{ width: 60, height: 60, borderRadius: 30, marginRight: 16 }}
                  resizeMode="cover"
                />
                <View>
                  <Text style={{ fontSize: 18, fontWeight: 'bold' }}>{empresa}</Text>
                  <Text style={{ fontSize: 16, color: '#555' }}>
                    {groupedResults[empresa].length} resultado(s)
                  </Text>
                </View>
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
              <ScrollView contentContainerStyle={{ alignItems: 'center' }}>
                <Text style={styles.modalTitle}>Detalles de la Parte</Text>
                <Text style={styles.modalText}>
                  <Text style={styles.boldText}>Empresa:</Text> {selectedResult.nombreEmpresa}
                </Text>
                <Text style={styles.modalText}>
                  <Text style={styles.boldText}>Marca:</Text> {selectedResult.marca || 'No disponible'}
                </Text>
                <Text style={styles.modalText}>
                  <Text style={styles.boldText}>Modelo:</Text> {selectedResult.modelo}
                </Text>
                <Text style={styles.modalText}>
                  <Text style={styles.boldText}>Año:</Text> {selectedResult.ano}
                </Text>
                <Text style={styles.modalText}>
                  <Text style={styles.boldText}>Cantidad:</Text> {selectedResult.cantidad || 'No disponible'}
                </Text>
                <Text style={styles.modalText}>
                  <Text style={styles.boldText}>Venta:</Text> {selectedResult.venta || 'No disponible'}
                </Text>
                <Text style={styles.modalText}>
                  <Text style={styles.boldText}>Descripción:</Text> {selectedResult.descripcion || 'No disponible'}
                </Text>
                <Text style={styles.modalText}>
                  <Text style={styles.boldText}>Observaciones:</Text> {selectedResult.observaciones || 'No disponible'}
                </Text>
                <Text style={styles.modalText}>
                  <Text style={styles.boldText}>Equivalencias:</Text> {selectedResult.equivalencias || 'No disponible'}
                </Text>
                {
                  selectedResult.foto && selectedResult.foto.trim() !== '' ? (
                    <Image
                      source={{ uri: `data:image/png;base64,${selectedResult.foto.replace(/\s/g, '')}` }}
                      style={styles.modalImage}
                      resizeMode="contain"
                    />
                  ) : (
                    <Image
                      source={require('../../assets/images/imagen_repuestos.jpg')}
                      style={styles.modalImage}
                      resizeMode="contain"
                    />
                  )
                }

                {/* Contacto por defecto */}
                <View
                  style={{
                    backgroundColor: 'white',
                    borderRadius: 10,
                    padding: 16,
                    marginVertical: 10,
                    alignSelf: 'stretch',
                  }}
                >
                  <Text style={{ fontSize: 20, fontWeight: 'bold', marginBottom: 8 }}>
                    {selectedResult.nombreEmpresa}
                  </Text>
                  {/* Dirección y teléfono por defecto */}
                  {selectedResult.nombreEmpresa === 'Pana Autoparts' && (
                    <>
                      <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 6 }}>
                        <Text style={{ color: 'red', fontSize: 18, marginRight: 6 }}>📍</Text>
                        <TouchableOpacity
                          onPress={() =>
                            Linking.openURL('https://maps.app.goo.gl/9wQ9QwQwQwQwQwQw8')
                          }
                        >
                          <Text style={{ fontSize: 16, textDecorationLine: 'underline', color: '#007AFF' }}>
                            17 Av. Nte. y 1a Calle Pte. #123, San Salvador
                          </Text>
                        </TouchableOpacity>
                      </View>
                      <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 6 }}>
                        <Text style={{ color: 'green', fontSize: 18, marginRight: 6 }}>📞</Text>
                        <TouchableOpacity onPress={() => Linking.openURL('tel:22577777')}>
                          <Text style={{ fontSize: 16, textDecorationLine: 'underline', color: '#007AFF' }}>
                            2257-7777
                          </Text>
                        </TouchableOpacity>
                      </View>
                    </>
                  )}
                  {selectedResult.nombreEmpresa === 'Rivas Autoparts' && (
                    <>
                      <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 6 }}>
                        <Text style={{ color: 'red', fontSize: 18, marginRight: 6 }}>📍</Text>
                        <TouchableOpacity
                          onPress={() =>
                            Linking.openURL('https://maps.app.goo.gl/cjQDVno6mtMMN3Gy9')
                          }
                        >
                          <Text style={{ fontSize: 16, textDecorationLine: 'underline', color: '#007AFF' }}>
                            45A Avenida Sur, San Salvador, El Salvador
                          </Text>
                        </TouchableOpacity>
                      </View>
                      <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 6 }}>
                        <Text style={{ color: 'green', fontSize: 18, marginRight: 6 }}>📞</Text>
                        <TouchableOpacity onPress={() => Linking.openURL('tel:22736000')}>
                          <Text style={{ fontSize: 16, textDecorationLine: 'underline', color: '#007AFF' }}>
                            2273-6000
                          </Text>
                        </TouchableOpacity>
                      </View>
                    </>
                  )}
                </View>

                {/* Botones de acción */}
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 16, width: '100%' }}>
                  <TouchableOpacity
                    style={{
                      backgroundColor: '#ccc',
                      paddingVertical: 10,
                      paddingHorizontal: 20,
                      borderRadius: 8,
                      marginRight: 8,
                      flex: 1,
                    }}
                    onPress={() => setModalVisible(false)}
                  >
                    <Text style={{ color: '#333', fontWeight: 'bold', textAlign: 'center' }}>Regresar</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={{
                      backgroundColor: '#FF0000', // Rojo fuerte
                      paddingVertical: 10,
                      paddingHorizontal: 20,
                      borderRadius: 8,
                      marginLeft: 8,
                      flex: 1,
                    }}
                    onPress={() => handleContact(selectedResult.nombreEmpresa)}
                  >
                    <Text style={{ color: 'white', fontWeight: 'bold', textAlign: 'center' }}>Contactar empresa</Text>
                  </TouchableOpacity>
                </View>
              </ScrollView>
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
    backgroundColor: '#f9f9f9',
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  picker: {
    height: 50,
    width: '100%',
    marginBottom: 16,
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 16,
  },
  searchButton: {
    backgroundColor: '#FF0000',
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
    marginBottom: 16,
  },
  searchButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  loadingText: {
    textAlign: 'center',
    fontSize: 18,
    marginTop: 20,
  },
  resultCard: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 16,
    marginBottom: 16,
    elevation: 2,
  },
  resultText: {
    fontSize: 14,
    marginBottom: 4,
  },
  partName: {
    fontWeight: 'bold',
  },
  boldText: {
    fontWeight: 'bold',
    color: '#333',
  },
  noResultsText: {
    textAlign: 'center',
    fontSize: 16,
    color: '#777',
    marginTop: 20,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
  modalContent: {
    width: '90%',
    maxWidth: 500,
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 16,
    elevation: 4,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
    textAlign: 'center',
  },
  modalText: {
    fontSize: 14,
    marginBottom: 8,
    color: '#333',
  },
  modalImage: {
    width: '100%',
    height: 200,
    borderRadius: 10,
    marginVertical: 12,
  },
});
