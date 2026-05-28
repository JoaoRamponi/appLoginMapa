import React, { useState } from "react";

import {View, Text, TextInput, TouchableOpacity,  StyleSheet, Alert} from "react-native";

import Mapa from '../Mapa';
import MapaDestino from '../MapaDestino';

import {  useNavigation } from '@react-navigation/core';

export default function App() {

  const navigation = useNavigation();

  const [usuario, setUsuario] = useState("");
  const [senha, setSenha] = useState("");

  async function login() {
    try {

      const resposta = await fetch(
        "http://localhost/MOBILEAMS/login/logar.php",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            usuario: usuario,
            senha: senha,
          }),
        }
      );

      const dados = await resposta.json();

      if (dados.sucesso) {         
          "Tipo: " + dados.tipo      

        if (dados.tipo === "administrador") {

           alert("Login realizado como administrador");
           navigation.navigate("Mapa");
         }       
        else {
          alert("Login realizado como usuario comum");
          navigation.navigate("MapaDestino");
        }       

      } else {
        alert(
          "Erro",
          "Usuário ou senha inválidos"
        );
      }
    } catch (erro) {

      alert(
        "Erro",
        "Não foi possível conectar na API"
      );
    }
  }

  return (
    <View style={styles.container}>

      <Text style={styles.titulo}>
        Sistema Login
      </Text>

      <TextInput
        style={styles.input}
        placeholder="Usuário"
        value={usuario}
        onChangeText={setUsuario}
      />

      <TextInput
        style={styles.input}
        placeholder="Senha"
        secureTextEntry={true}
        value={senha}
        onChangeText={setSenha}
      />

      <TouchableOpacity
        style={styles.botao}
        onPress={login}
      >
        <Text style={styles.textoBotao}>
          Entrar
        </Text>
      </TouchableOpacity>

    </View>
  );
}

const styles = StyleSheet.create({

  container: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
    backgroundColor: "#f2f2f2",
  },

  titulo: {
    fontSize: 30,
    textAlign: "center",
    marginBottom: 30,
    fontWeight: "bold",
  },

  input: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    fontSize: 16,
  },

  botao: {
    backgroundColor: "#007bff",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
  },

  textoBotao: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
});