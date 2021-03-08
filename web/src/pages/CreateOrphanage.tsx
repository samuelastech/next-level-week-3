import React, { useState, FormEvent, ChangeEvent } from "react";
import { FiPlus } from "react-icons/fi";
import { MapContainer, TileLayer, Marker, useMapEvents, MapConsumer } from 'react-leaflet';
import Leaflet, { LeafletMouseEvent } from 'leaflet';
import '../styles/pages/create-orphanage.css';
import Sidebar from "../components/Sidebar";
import mapIcon from "../utils/mapIcon";
import api from "../services/api";
import { useHistory} from 'react-router-dom';

export default function CreateOrphanage(){
    const history = useHistory();
    const [position, setPosition] = useState({ latitude: 0, longitude: 0 });
    const [name, setName] = useState('');
    const [about, setAbout] = useState('');
    const [instructions, setInstructions] = useState('');
    const [opening_hours, setOpeningHours] = useState('');
    const [open_on_weekends, setOpenOnWeekends] = useState(true);
    const [images, setImages] = useState<File[]>([]);
    const [previewImages, setPreviewImages] = useState<string[]>([]);

    async function handleSubmit(event: FormEvent){
        event.preventDefault();
        const { latitude, longitude } = position;
        
        const data = new FormData();
        data.append('name', name);
        data.append('about', about);
        data.append('latitude', String(latitude));
        data.append('longitude', String(longitude));
        data.append('instructions', instructions);
        data.append('opening_hours', opening_hours);
        data.append('open_on_weekends', String(open_on_weekends));
        
        images.forEach(image => {
            data.append('images', image);
        });
        console.log(data);
        
        await api.post('orphanages', data);
        
        alert('Cadastro realizado com Sucesso!');

        history.push('/app');
    }

    function handleSelecteImages(event: ChangeEvent<HTMLInputElement>){
        if(!event.target.files){
            return;
        }

        const selectedImages = Array.from(event.target.files)
        setImages(selectedImages);
        const selectedImagesPreview = selectedImages.map(image =>{
            return URL.createObjectURL(image);
        });
        setPreviewImages(selectedImagesPreview);
    }

    return(
        <div id="page-create-orphanage">
            <Sidebar/>
            <main>
                <form onSubmit={handleSubmit} className="create-orphanage-form">
                    <fieldset>
                        <legend>Dados</legend>
                        <MapContainer 
                            center={[-23.6511316, -46.8900892]}
                            zoom={14}
                            style={{ width: '100%', height: 280 }}
                        >
                            <TileLayer
                                url={`https://api.mapbox.com/styles/v1/samuelmarte/ckl8fq1pr51l017pcwnlt6cs0/tiles/256/{z}/{x}/{y}@2x?access_token=${process.env.REACT_APP_MAPBOX_TOKEN}`}
                            />
                            {/* <Marker
                                icon={mapIcon}
                                position={[-23.6511316, -46.8900892]}
                                interactive={false}
                            /> */}
                            <MapConsumer>
                                {map=>{
                                    map.on("click", function(event: LeafletMouseEvent){
                                        const { lat, lng } = event.latlng;
                                        setPosition({
                                            latitude: lat,
                                            longitude: lng
                                        });
                                    });
                                    return null;
                                }}
                            </MapConsumer>
                            { position.latitude != 0 && (
                                <Marker 
                                    icon={mapIcon}
                                    position={
                                        [position.latitude,
                                        position.longitude]}
                                    interactive={false}
                                />
                            )}
                        </MapContainer>
                        <div className="input-block">
                            <label htmlFor="name">Nome</label>
                            <input id="name" value={name} onChange={event => setName(event.target.value)} />
                        </div>
                        <div className="input-block">
                            <label htmlFor="about">Sobre <span>Máximo de 300 caracteres</span></label>
                            <textarea id="name" maxLength={300} value={about} onChange={event => setAbout(event.target.value)} />
                        </div>
                        <div className="input-block">
                            <label htmlFor="images">Fotos</label>
                            <div className="images-container">
                                {previewImages.map(image=>{
                                    return(
                                        <img key={image} src={image} alt={name} />
                                    )
                                })}
                                <label htmlFor="image[]" className="new-image">
                                    <FiPlus size={24} color="#15b6d6" />
                                </label>
                            </div>
                            <input type="file" multiple onChange={handleSelecteImages} id="image[]" />
                        </div>
                    </fieldset>
                    <fieldset>
                        <legend>Visitação</legend>
                        <div className="input-block">
                            <label htmlFor="instructions">Instruções</label>
                            <textarea id="instructions" value={instructions} onChange={event => setInstructions(event.target.value)} />
                        </div>
                        <div className="input-block">
                            <label htmlFor="opening_hours">Horário de funcionamento</label>
                            <input id="opening_hours" value={opening_hours} onChange={event => setOpeningHours(event.target.value)} />
                        </div>
                        <div className="input-block">
                            <label htmlFor="open_on_weekends">Atende fim de Semana</label>
                            <div className="button-select">
                                <button
                                    type="button"
                                    className={open_on_weekends ? 'active' : ''}
                                    onClick={()=>setOpenOnWeekends(true)}>Sim
                                </button>
                                <button
                                    type="button"
                                    className={!open_on_weekends ? 'active' : ''}
                                    onClick={()=>setOpenOnWeekends(false)}>Não
                                </button>
                            </div>
                        </div>
                    </fieldset>

                    <button type="submit" className="confirm-button">
                        Confirmar
                    </button>
                </form>
            </main>
        </div>
    );
}