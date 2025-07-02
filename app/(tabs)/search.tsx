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
      const response = await axios.get(`https://servicio.repara503.site/consulta-partes-API/api/usados/${item.id}`);
      const detalle = response.data;
      console.log('Detalle recibido de la API:', detalle);
      setSelectedResult({ ...item, ...detalle });
      setModalVisible(true);
    } catch (error) {
      setSelectedResult(item);
      setModalVisible(true);
    }
  };



  const groupResultsByCompany = (results) => {
    return results.reduce((acc, item) => {
      const empresa = item.nombreEmpresa || 'Otra';
      if (!acc[empresa]) acc[empresa] = [];
      acc[empresa].push(item);
      return acc;
    }, {});
  };

  
  // Agrupa los resultados por empresa
  const groupedResults = groupResultsByCompany(results);

  return (
    <View style={styles.container}>
      {/* Selector de Marca */}
      <Text style={styles.label}>Seleccione una Marca:</Text>
      <View style={{ borderWidth: 1, borderColor: '#ccc', borderRadius: 8, marginBottom: 16, backgroundColor: '#fff' }}>
        <Picker
          selectedValue={selectedBrand}
          onValueChange={(itemValue) => setSelectedBrand(itemValue)}
          style={{
            backgroundColor: '#444', // gris oscuro
            color: '#fff',            // letras blancas
            borderRadius: 8,
            marginBottom: 10,
          }}
          dropdownIconColor="#fff"    // icono blanco
        >
          <Picker.Item label="Seleccione una marca" value="" color="#888" />
          {Object.keys(catalog).map((brand) => (
            <Picker.Item
              key={brand}
              label={brand}
              value={brand}
              color="#fff" // letras blancas en cada opción
            />
          ))}
        </Picker>
      </View>

      {/* Selector de Modelo */}
      {selectedBrand ? (
        <>
          <Text style={styles.label}>Seleccione un Modelo:</Text>
          <Picker
            selectedValue={selectedModel}
            onValueChange={(itemValue) => setSelectedModel(itemValue)}
            style={{
              backgroundColor: '#444', // gris oscuro
              color: '#fff',           // letras blancas
              borderRadius: 8,
              marginBottom: 10,
            }}
            dropdownIconColor="#fff"   // icono blanco
          >
            {catalog[selectedBrand]?.map((model) => (
              <Picker.Item
                key={model}
                label={model}
                value={model}
                color="#fff" // letras blancas en cada opción
              />
            ))}
          </Picker>
        </>
      ) : null}

      {/* Campo de entrada para la parte */}
      {selectedModel ? (
        <>
          <Text style={styles.label}>Ingrese la Parte a Buscar:</Text>
          <TextInput
            style={{
              backgroundColor: '#444', // gris oscuro
              color: '#fff',           // letras blancas
              borderRadius: 8,
              paddingHorizontal: 12,
              paddingVertical: 8,
              marginBottom: 10,
              fontSize: 16,
            }}
            placeholder="Ejemplo: Alternador"
            placeholderTextColor="#ccc"
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
  renderItem={({ item: empresa }) => {
    const representativeItem = groupedResults[empresa]?.[0];
    const logoUrl = representativeItem?.datosEmpresa?.logourl;

    return (
      <TouchableOpacity
        style={styles.resultCard}
        onPress={() => setSelectedCompany(empresa)}
      >
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          {logoUrl ? (
            <Image
              source={{ uri: logoUrl }}
              style={{ width: 60, height: 60, borderRadius: 30, marginRight: 16 }}
              resizeMode="cover"
            />
          ) : (
            <Image
              source={require('../../assets/images/imagen_repuestos.jpg')}
              style={{ width: 60, height: 60, borderRadius: 30, marginRight: 16 }}
              resizeMode="cover"
            />
          )}
          <View>
            <Text style={{ fontSize: 18, fontWeight: 'bold' }}>{empresa}</Text>
            <Text style={{ fontSize: 16, color: '#555' }}>
              {groupedResults[empresa].length} resultado(s)
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  }}
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
              <ScrollView contentContainerStyle={{ alignItems: 'center', paddingBottom: 32 }}>
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
                  <Text style={styles.boldText}>Cantidad:</Text> {selectedResult.cantidad ? selectedResult.cantidad : 0}
                </Text>
                <Text style={styles.modalText}>
                  <Text style={styles.boldText}>Venta:</Text> {selectedResult.venta ? selectedResult.venta : 0}
                </Text>
                <Text style={styles.modalText}>
                  <Text style={styles.boldText}>Descripción:</Text> {selectedResult.descripcion ? selectedResult.descripcion : ''}
                </Text>
                <Text style={styles.modalText}>
                  <Text style={styles.boldText}>Observaciones:</Text> {selectedResult.observaciones ? selectedResult.observaciones : ''}
                </Text>
                <Text style={styles.modalText}>
                  <Text style={styles.boldText}>Equivalencias:</Text> {selectedResult.equivalencias ? selectedResult.equivalencias : ''}
                </Text>
                {selectedResult?.foto && selectedResult.foto.startsWith('http') ? (
                    <Image
                        source={{ uri: selectedResult.foto }}
                            style={styles.modalImage}
                                resizeMode="contain"
                                  />
                                  ) : (
                                      <Image
                                          source={require('../../assets/images/imagen_repuestos.jpg')}
                                              style={styles.modalImage}
                                                  resizeMode="contain"
                                                    />
                                                    )}

                {/* Datos de la empresa (nueva sección) */}
                {selectedResult.datosEmpresa ? (
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
                      {selectedResult.datosEmpresa.nombreEmpresa || selectedResult.nombreEmpresa}
                    </Text>
                    {/* Dirección */}
                    {selectedResult.datosEmpresa.direccion ? (
                      <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 6 }}>
                        <Text style={{ color: 'red', fontSize: 18, marginRight: 6 }}>📍</Text>
                        {selectedResult.datosEmpresa.mapa ? (
                          <TouchableOpacity
                            onPress={() => Linking.openURL(selectedResult.datosEmpresa.mapa)}
                          >
                            <Text style={{ fontSize: 16, color: '#007AFF', textDecorationLine: 'underline' }}>
                              {selectedResult.datosEmpresa.direccion}
                            </Text>
                          </TouchableOpacity>
                        ) : (
                          <Text style={{ fontSize: 16 }}>{selectedResult.datosEmpresa.direccion}</Text>
                        )}
                      </View>
                    ) : null}
                    {/* Teléfonos */}
                    {selectedResult.datosEmpresa.telefono ? (
                      <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 6 }}>
                        <Text style={{ color: 'green', fontSize: 18, marginRight: 6 }}>📞</Text>
                        <Text style={{ fontSize: 16 }}>{selectedResult.datosEmpresa.telefono}</Text>
                      </View>
                    ) : null}
                    {selectedResult.datosEmpresa.wa1 ? (
                      <TouchableOpacity
                        style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 6 }}
                        onPress={() => Linking.openURL(selectedResult.datosEmpresa.wa1)}
                      >
                        <Text style={{ fontSize: 18, marginRight: 6 }}>🟢</Text>
                        <Text style={{ fontSize: 16, color: '#25D366', textDecorationLine: 'underline' }}>
                          {selectedResult.datosEmpresa.wa1.replace('https://wa.me/', '+')}
                        </Text>
                      </TouchableOpacity>
                    ) : null}
                    {selectedResult.datosEmpresa.wa2 ? (
                      <TouchableOpacity
                        style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 6 }}
                        onPress={() => Linking.openURL(selectedResult.datosEmpresa.wa2)}
                      >
                        <Text style={{ fontSize: 18, marginRight: 6 }}>🟢</Text>
                        <Text style={{ fontSize: 16, color: '#25D366', textDecorationLine: 'underline' }}>
                          {selectedResult.datosEmpresa.wa2.replace('https://wa.me/', '+')}
                        </Text>
                      </TouchableOpacity>
                    ) : null}
                  </View>
                ) : (
                  <Text style={{ color: '#777', marginTop: 10 }}>No hay información de contacto disponible.</Text>
                )}

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
                    style={styles.contactButton}
                    onPress={() => {
                      if (
                        selectedResult &&
                        selectedResult.datosEmpresa &&
                        selectedResult.datosEmpresa.telefono
                      ) {
                        Linking.openURL(`tel:${selectedResult.datosEmpresa.telefono}`);
                      } else {
                        Alert.alert('Error', 'No hay número de teléfono disponible.');
                      }
                    }}
                  >
                    <Text style={styles.contactButtonText}>Contactar empresa</Text>
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
  contactButton: {
    backgroundColor: '#FF0000', // Rojo fuerte
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginLeft: 8,
    flex: 1,
  },
  contactButtonText: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
});
