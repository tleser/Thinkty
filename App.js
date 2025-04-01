import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import AuthNavigator from './src/navigation/AuthNavigator';
import AppNavigator from './src/navigation/AppNavigator';
import { supabase } from './src/lib/supabase';
import * as FileSystem from 'expo-file-system';
import { btoa } from 'react-native-quick-base64';

export default function App() {
  const [session, setSession] = useState(null);
  const [isKeyLoaded, setIsKeyLoaded] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setSession(data.session));
    supabase.auth.onAuthStateChange((_event, session) => setSession(session));
  }, []);

  // Définition du chemin du fichier pour stocker la clé
  const secretKeyPath = FileSystem.documentDirectory + 'secret.key';

  // Fonction pour générer une clé aléatoire
  const generateSecretKey = () => {
    let buf = new Uint8Array(32); // Taille raisonnable pour une clé de chiffrement
    buf.forEach((_, i) => (buf[i] = Math.floor(isaac.random() * 256)));
    return btoa(buf); // Conversion correcte
  };

  // Fonction pour récupérer ou créer la clé
  const getSecretKey = async () => {
    try {
      const fileInfo = await FileSystem.getInfoAsync(secretKeyPath);
      let secretKey;

      if (fileInfo.exists) {
        // Lire la clé existante
        secretKey = await FileSystem.readAsStringAsync(secretKeyPath);
        console.log('Clé secrète lue :', secretKey);
      } else {
        // Générer une nouvelle clé et l'enregistrer
        secretKey = generateSecretKey();
        await FileSystem.writeAsStringAsync(secretKeyPath, secretKey);
        console.log('Nouvelle clé secrète générée et stockée :', secretKey);
      }

      global.secretkey = secretKey; // Assigner la clé globalement
      setIsKeyLoaded(true); // Mettre à jour l'état pour signaler que la clé est chargée
    } catch (error) {
      console.error('Erreur lors de l’accès à la clé secrète:', error);
    }
  };

  // Charger la clé secrète au démarrage
  useEffect(() => {
    getSecretKey();
  }, []);

  // Attendre que la clé soit chargée avant d'afficher l'UI
  if (!isKeyLoaded) {
    return null; // Évite d'afficher l'UI tant que la clé n'est pas chargée
  }

  return (
    <NavigationContainer>
      {session ? <AppNavigator /> : <AuthNavigator />}
    </NavigationContainer>
  );
}