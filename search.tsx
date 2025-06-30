```tsx
import React from 'react';
import { FlatList, Text, TouchableOpacity, View, Image } from 'react-native';
import { styles } from './YourStylesFile'; // Asegúrate de importar tus estilos

const YourComponent = ({ groupedResults, setSelectedCompany }) => {
  return (
    <FlatList
      data={Object.keys(groupedResults)}
      keyExtractor={(empresa) => empresa}
      renderItem={({ item: empresa }) => {
        // Busca el primer resultado de la empresa para obtener el logourl
        const firstResult = groupedResults[empresa][0];
        const logoUrl = firstResult?.datosEmpresa?.logourl;

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
  );
};

export default YourComponent;
```