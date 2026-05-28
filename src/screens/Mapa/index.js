import "leaflet/dist/leaflet.css";

import L from "leaflet";

import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Polyline,
  useMapEvents
} from "react-leaflet";

import { useEffect, useState } from "react";

// ÍCONE
const icon = new L.Icon({
  iconUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",

  shadowUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",

  iconSize: [25, 41],
  iconAnchor: [12, 41]
});

// CLIQUE NO MAPA
function CliqueMapa({
  setOrigem,
  setDestino,
  origem,
  destino
}) {

  useMapEvents({

    click(e) {

      const novaPosicao = [
        e.latlng.lat,
        e.latlng.lng
      ];

      // ORIGEM
      if (!origem) {

        setOrigem(novaPosicao);

      }

      // DESTINO
      else if (!destino) {

        setDestino(novaPosicao);

      }

      // REINICIA
      else {

        setOrigem(novaPosicao);

        setDestino(null);
      }
    }
  });

  return null;
}

export default function App() {

  const [origem, setOrigem] =
    useState(null);

  const [destino, setDestino] =
    useState(null);

  const [rota, setRota] =
    useState([]);

  // DISTÂNCIA
  const [km, setKm] =
    useState(0);

  // TEMPO
  const [tempo, setTempo] =
    useState("");

  // CALCULA ROTA
  useEffect(() => {

    if (!origem || !destino) return;

    const url =
      "https://router.project-osrm.org/route/v1/driving/" +
      origem[1] + "," + origem[0] + ";" +
      destino[1] + "," + destino[0] +
      "?overview=full&geometries=geojson";

    fetch(url)
      .then(res => res.json())
      .then(data => {

        if (data.routes.length > 0) {

          const route =
            data.routes[0];

          // COORDENADAS
          const coords =
            route.geometry.coordinates;

          const latlngs =
            coords.map(c => [c[1], c[0]]);

          setRota(latlngs);

          // DISTÂNCIA EM KM
          const distanciaKm =
            (route.distance / 1000).toFixed(2);

          setKm(distanciaKm);

          // TEMPO EM HORAS
          const tempoHoras =
            (route.duration / 3600).toFixed(2);

          setTempo(tempoHoras);
        }
      });

  }, [origem, destino]);

  return (

    <div
      style={{
        width: "100vw",
        height: "100vh",
        position: "relative"
      }}
    >

      {/* PAINEL */}
      <div
        style={{
          position: "absolute",
          top: 10,
          left: 10,
          zIndex: 1000,
          background: "white",
          padding: 15,
          borderRadius: 10,
          boxShadow: "0 0 10px rgba(0,0,0,0.3)"
        }}
      >

        <h2>Informações da Rota</h2>

        
        <p>
          Clique no mapa:
        </p>

 
        <p>
          <strong>Distância:</strong>
          {" "}
          {km} km
        </p>

        <p>
          <strong>Tempo:</strong>
          {" "}
          {tempo} horas
        </p>


      </div>

      {/* MAPA */}
      <MapContainer
        center={[-24.60, -47.70]}
        zoom={10}
        style={{
          width: "100%",
          height: "100%"
        }}
      >

        {/* EVENTO DE CLIQUE */}
        <CliqueMapa
          origem={origem}
          destino={destino}
          setOrigem={setOrigem}
          setDestino={setDestino}
        />

        {/* CAMADA DO MAPA */}
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* ORIGEM */}
        {origem && (

          <Marker
            position={origem}
            icon={icon}
          >
            <Popup>Origem</Popup>
          </Marker>

        )}

        {/* DESTINO */}
        {destino && (

          <Marker
            position={destino}
            icon={icon}
          >
            <Popup>Destino</Popup>
          </Marker>

        )}

        {/* ROTA */}
        {rota.length > 0 && (

          <Polyline
            positions={rota}
            color="blue"
            weight={5}
          />

        )}

      </MapContainer>

    </div>
  );
}