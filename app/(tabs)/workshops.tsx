import { View, Text, StyleSheet, FlatList, TouchableOpacity, Linking } from 'react-native';
import { MaterialCommunityIcons, FontAwesome5, Feather } from '@expo/vector-icons';

const workshops = [
	{
		id: '1',
		name: 'Taller Mecánico Express',
		location: 'San Salvador, Calle Principal #123',
		phone: '+503 7123-4567',
	},
	{
		id: '2',
		name: 'Auto Service Pro',
		location: 'Santa Tecla, Av. Las Palmeras #456',
		phone: '+503 7234-5678',
	},
];

const categories = [
	{ id: 1, name: 'Motor', icon: (props) => <MaterialCommunityIcons name="engine" {...props} />, color: '#4CAF50' },
	{ id: 2, name: 'Escape', icon: (props) => <MaterialCommunityIcons name="tailpipe" {...props} />, color: '#FF9800' },
	{ id: 3, name: 'Suspensión', icon: (props) => <MaterialCommunityIcons name="car-suspension" {...props} />, color: '#2196F3' },
	{ id: 4, name: 'Aire Acondicionado', icon: (props) => <MaterialCommunityIcons name="air-conditioner" {...props} />, color: '#03A9F4' },
	{ id: 5, name: 'Alternador/Encendido', icon: (props) => <MaterialCommunityIcons name="car-battery" {...props} />, color: '#FFC107' },
	{ id: 6, name: 'Frenos', icon: (props) => <MaterialCommunityIcons name="car-brake-abs" {...props} />, color: '#F44336' },
	{ id: 7, name: 'Carrocería', icon: (props) => <FontAwesome5 name="car-side" {...props} />, color: '#9E9E9E' },
	{ id: 8, name: 'Radiador y partes', icon: (props) => <MaterialCommunityIcons name="radiator" {...props} />, color: '#FF5722' },
	{ id: 9, name: 'Eléctrico', icon: (props) => <Feather name="zap" {...props} />, color: '#673AB7' },
	{ id: 10, name: 'Transmisión', icon: (props) => <MaterialCommunityIcons name="car-shift-pattern" {...props} />, color: '#9C27B0' },
];

export default function Workshops() {
	const handleCall = (phoneNumber: string) => {
		Linking.openURL(`tel:${phoneNumber}`);
	};

	const handleLocation = (location: string) => {
		Linking.openURL(`https://maps.google.com/?q=${encodeURIComponent(location)}`);
	};

	return (
		<View style={styles.container}>
			<FlatList
				data={workshops}
				keyExtractor={(item) => item.id}
				renderItem={({ item }) => (
					<View style={styles.workshopCard}>
						<Text style={styles.workshopName}>{item.name}</Text>

						<TouchableOpacity
							style={styles.infoRow}
							onPress={() => handleLocation(item.location)}
						>
							<MaterialCommunityIcons name="map-marker" size={20} color="#FF0000" />
							<Text style={styles.infoText}>{item.location}</Text>
						</TouchableOpacity>

						<TouchableOpacity
							style={styles.infoRow}
							onPress={() => handleCall(item.phone)}
						>
							<Feather name="phone" size={20} color="#FF0000" />
							<Text style={styles.infoText}>{item.phone}</Text>
						</TouchableOpacity>

						<TouchableOpacity
							style={styles.contactButton}
							onPress={() => handleCall(item.phone)}
						>
							<Text style={styles.contactButtonText}>Contactar Taller</Text>
						</TouchableOpacity>
					</View>
				)}
			/>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#f5f5f5',
		padding: 10,
	},
	workshopCard: {
		backgroundColor: 'white',
		padding: 20,
		borderRadius: 15,
		marginBottom: 15,
		shadowColor: '#000',
		shadowOffset: {
			width: 0,
			height: 2,
		},
		shadowOpacity: 0.25,
		shadowRadius: 3.84,
		elevation: 5,
	},
	workshopName: {
		fontFamily: 'Inter-Bold',
		fontSize: 20,
		marginBottom: 15,
	},
	infoRow: {
		flexDirection: 'row',
		alignItems: 'center',
		marginBottom: 10,
	},
	infoText: {
		fontFamily: 'Inter-Regular',
		marginLeft: 10,
		flex: 1,
	},
	contactButton: {
		backgroundColor: '#FF0000',
		padding: 15,
		borderRadius: 10,
		alignItems: 'center',
		marginTop: 10,
	},
	contactButtonText: {
		color: 'white',
		fontFamily: 'Inter-Bold',
		fontSize: 16,
	},
});