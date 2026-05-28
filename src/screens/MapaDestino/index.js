import "leaflet/dist/leaflet.css";

import L from "leaflet";

import {  MapContainer,  TileLayer,  Marker,  Popup,  Polyline} from "react-leaflet";

import {  useEffect,  useState} from "react";

// ÍCONE
const icon = new L.Icon({
  iconUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",

  shadowUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",

  iconSize: [25, 41],
  iconAnchor: [12, 41]
});

export default function App() {


  const [origemTexto, setOrigemTexto] = useState("");

  const [destinoTexto, setDestinoTexto] =  useState("");

  const [sugestoesOrigem, setSugestoesOrigem] = useState([]);

  const [sugestoesDestino, setSugestoesDestino] =  useState([]);

  const [origem, setOrigem] = useState(null);

  const [destino, setDestino] = useState(null);


  const [rota, setRota] = useState([]);

  const [distancia, setDistancia] =  useState("");

  const [tempo, setTempo] =  useState("");

  // BUSCA SUGESTÕES
  async function buscarSugestoes(texto, tipo) {

    if (texto.length < 3) {

      if (tipo === "origem") {
        setSugestoesOrigem([]);
      } else {
        setSugestoesDestino([]);
      }

      return;
    }

    try {

      const url =
        `https://nominatim.openstreetmap.org/search?format=json&q=${texto}&countrycodes=br`;

      const resposta =
        await fetch(url, {
          headers: {
            "Accept-Language": "pt-BR"
          }
        });

      const dados =
        await resposta.json();

      if (tipo === "origem") {

        setSugestoesOrigem(dados);

      } else {

        setSugestoesDestino(dados);
      }

    } catch (erro) {

      console.log("Erro:", erro);
    }
  }

  // AUTOCOMPLETE ORIGEM
  useEffect(() => {

    const timer = setTimeout(() => {

      buscarSugestoes(
        origemTexto,
        "origem"
      );

    }, 1000);

    return () => clearTimeout(timer);

  }, [origemTexto]);

  // AUTOCOMPLETE DESTINO
  useEffect(() => {

    const timer = setTimeout(() => {

      buscarSugestoes(
        destinoTexto,
        "destino"
      );

    }, 1000);

    return () => clearTimeout(timer);

  }, [destinoTexto]);

  // CALCULAR ROTA
  async function calcularRota(
    coordOrigem,
    coordDestino    
  ) {

    if (!coordOrigem || !coordDestino)
      return;

    setOrigem(coordOrigem);

    setDestino(coordDestino);


    const url =
      "https://router.project-osrm.org/route/v1/driving/" +
      coordOrigem[1] + "," + coordOrigem[0] + ";" +
      coordDestino[1] + "," + coordDestino[0] +
      "?overview=full&geometries=geojson";

    const resposta =
      await fetch(url);

    const dados =
      await resposta.json();

    if (dados.routes.length > 0) {

      const route =
        dados.routes[0];

      // COORDENADAS DA ROTA
      const coords =
        route.geometry.coordinates;

      const latlngs =
        coords.map(c => [c[1], c[0]]);

      setRota(latlngs);

      // DISTÂNCIA
      const km =
        (route.distance / 1000)
          .toFixed(2);

      setDistancia(km);

      // TEMPO
      const horas =
        (route.duration / 3600)
          .toFixed(2);

      setTempo(horas);


    }
  }

  // ATUALIZA ROTA AUTOMATICAMENTE
  useEffect(() => {

    if (origem && destino) {

      calcularRota(
        origem,
        destino
      );
    }

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
          width: 300,
          borderRadius: 10,
          boxShadow:
            "0 0 10px rgba(0,0,0,0.3)"
        }}
      >

        <h2>Buscar Rota</h2>

        {/* ORIGEM */}
        <input
          type="text"
          placeholder="Digite a origem"
          value={origemTexto}
          onChange={(e) =>
            setOrigemTexto(
              e.target.value
            )
          }
          style={{
            width: 290,
            padding: 10
          }}
        />

        {/* LISTA ORIGEM */}
        {sugestoesOrigem.map(
          (item, index) => (

            <div
              key={index}
              onClick={() => {

                const coord = [
                  parseFloat(item.lat),
                  parseFloat(item.lon)
                ];

                setOrigem(coord);

                setOrigemTexto(
                  item.display_name
                );

                setSugestoesOrigem([]);
              }}

              style={{
                padding: 8,
                cursor: "pointer",
                borderBottom:
                  "1px solid #ccc"
              }}
            >

              {item.display_name}

            </div>

          )
        )}

        <br />

        {/* DESTINO */}
        <input
          type="text"
          placeholder="Digite o destino"
          value={destinoTexto}
          onChange={(e) =>
            setDestinoTexto(
              e.target.value
            )
          }
          style={{
            width: 290,
            padding: 10
          }}
        />

        {/* LISTA DESTINO */}
        {sugestoesDestino.map(
          (item, index) => (

            <div
              key={index}
              onClick={() => {

                const coord = [
                  parseFloat(item.lat),
                  parseFloat(item.lon)
                ];

                setDestino(coord);

                setDestinoTexto(
                  item.display_name
                );

                setSugestoesDestino([]);
              }}

              style={{
                padding: 8,
                cursor: "pointer",
                borderBottom:
                  "1px solid #ccc"
              }}
            >

              {item.display_name}

            </div>

          )
        )}

        <hr />

        <h3>
          Distância:
          {" "}
          {distancia} km
        </h3>

        <h3>
          Tempo:
          {" "}
          {tempo} horas
        </h3>

      </div>

      {/* MAPA */}
      <MapContainer
        center={[-24.60, -47.60]}
        zoom={7}
        style={{
          width: "100%",
          height: "50%",
          top: 300
        }}
      >

        {/* MAPA BASE */}
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* ORIGEM */}
        {origem && (

          <Marker
            position={origem}
            icon={icon}
          >
            <Popup>
              Origem
            </Popup>
          </Marker>

        )}

        {/* DESTINO */}
        {destino && (

          <Marker
            position={destino}
            icon={icon}
          >
            <Popup>
              Destino
            </Popup>
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