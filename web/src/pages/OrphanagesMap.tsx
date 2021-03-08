import React, { useEffect, useState } from 'react';
import '../styles/pages/orphanages-map.css';
import mapMarkerImg from '../img/map-marker.svg';
import { Link } from 'react-router-dom';
import { FiPlus, FiArrowRight } from 'react-icons/fi';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import mapIcon from '../utils/mapIcon';
import api from '../services/api';

interface Orphanage{
    id: number;
    latitude: number;
    longitude: number;
    name: string;
}

function OrphanagesMap() {
    
    const [orphanages, setOrphanages] = useState<Orphanage[]>([]);
    useEffect(()=>{
        api.get('orphanages').then(response=>{
            console.log(response.data);
            setOrphanages(response.data);
        });
    }, []);

    return(
        <div id="page-map">
            <aside>
                <header>
                    <img src={mapMarkerImg} alt="Happy"/>
                    <h2>Escolha um orfanato no mapa</h2>
                    <p>Muitas crianças estão esperando sua visita.</p>
                </header>

                <footer>
                    <strong>Embu das Artes</strong>
                    <span>São Paulo</span>
                </footer>
            </aside>
            
            <MapContainer 
                center={[-23.6511316, -46.8900892]}
                zoom={14}
                style={{ width: '100%', height: '100%' }}
            >
                <TileLayer
                    url={`https://api.mapbox.com/styles/v1/samuelmarte/ckl8fq1pr51l017pcwnlt6cs0/tiles/256/{z}/{x}/{y}@2x?access_token=${process.env.REACT_APP_MAPBOX_TOKEN}`}
                />
    
                {orphanages.map(orphanage => {
                    return(
                        <Marker
                            key={orphanage.id}
                            icon={mapIcon}
                            position={[orphanage.latitude , orphanage.longitude]}
                        >
                            <Popup closeButton={false} minWidth={240} maxWidth={240} className="map-popup" >
                                {orphanage.name}
                                <Link to={`/orphanages/${orphanage.id}`}>
                                    <FiArrowRight size={20} color="#FFF" />
                                </Link>
                            </Popup>
                        </Marker>
                    );
                })}
            </MapContainer>

            <Link to="/orphanages/create" className="create-orphanage">
                <FiPlus size={32} color="#FFF" />
            </Link>
        </div>
    );
}

export default OrphanagesMap;