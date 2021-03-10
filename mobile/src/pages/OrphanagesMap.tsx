import React, { useEffect, useState } from 'react';
import MapView, { Marker, Callout, PROVIDER_GOOGLE } from 'react-native-maps';
import mapMarker from '../images/map-marker.png';
import { Feather } from '@expo/vector-icons';
import { StyleSheet, Text, View, Dimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { RectButton } from 'react-native-gesture-handler';
import api from '../services/api';

interface Orphanage{
    id: number;
    name: string; 
    latitude: number;
    longitude: number;
}

export default function OrpahanagesMap(){
    const [orphanages, setOrphanages] = useState<Orphanage[]>([]);
    const navigation = useNavigation();

    useEffect(()=>{
      api.get('/orphanages')
        .then(response=>{
            console.log("The request has returned an response!");
            setOrphanages(response.data);
       })
       .catch(error=>{
         if (error.response) {
            console.log("The request was made and the server responded with a status code | that falls out of the range of 2xx"); 
            console.log(error.response.data);
            console.log(error.response.status);
            console.log(error.response.headers);
            } else if (error.request) {
              console.log("The request was made but no response was received");
              console.log(error.request);
            } else {
              console.log("Something happened in setting up the request that triggered an Error");
              console.log('Error', error.message);
            }
       })
    },[]);

    function handleNavigationToOrphanageDetails(){navigation.navigate('OrphanageDetail');}
    function handleNavigationToCreateOrphanage(){navigation.navigate('SelectMapPosition');}

    return(
        <View style={styles.container}>
            <MapView
                style={styles.map}
                provider={PROVIDER_GOOGLE}
                initialRegion={{
                  latitude: -23.6511316,
                  longitude: -46.8900892,
                  latitudeDelta: 0.008,
                  longitudeDelta: 0.008,
                }}>
                {orphanages.map(orphanage=>{
                    return(
                        <Marker
                            key={orphanage.id}
                            icon={mapMarker}
                            calloutAnchor={{
                                x: 2.7,
                                y: 0.8,
                            }}
                            coordinate={{ 
                                latitude: orphanage.latitude,
                                longitude: orphanage.longitude,
                            }}>
                            <Callout tooltip onPress={handleNavigationToOrphanageDetails}>
                                <View style={styles.calloutContainer}>
                                    <Text style={styles.calloutText}>{orphanage.name}</Text>
                                </View>
                            </Callout>
                        </Marker>
                    );
                })}
            </MapView>
            <View style={styles.footer}>
                <Text style={styles.footerText}>2 orfanatos encontrados</Text>
                <RectButton style={styles.createOrphanageButton} onPress={handleNavigationToCreateOrphanage}>
                    <Feather name="plus" size={20} color="#FFF" />
                </RectButton>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
    },
  
    map: {
      width: Dimensions.get('window').width,
      height: Dimensions.get('window').height
    },
  
    calloutContainer:{
      width: 160,
      height: 46,
      paddingHorizontal: 16,
      backgroundColor: 'rgba(255, 255, 255, 0.8)',
      borderRadius: 16,
      justifyContent: 'center',
    },
  
    calloutText:{
      color: '#0089a5',
      fontFamily: 'Nunito_700Bold',
      fontSize: 14,
    },
  
    footer:{
      position: 'absolute',
      left: 24,
      right: 24,
      bottom: 32,
  
      backgroundColor: '#FFF',
      borderRadius: 28,
      height: 56,
      paddingLeft: 24,
  
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
  
      elevation: 3,
    },
  
    footerText:{
      fontFamily: 'Nunito_700Bold',
      color: '#8fa7b3',
    },
  
    createOrphanageButton:{
      width: 56,
      height: 56,
      backgroundColor: '#15c3d6',
      borderRadius: 20,
  
      justifyContent: 'center',
      alignItems: 'center',
    },
  });