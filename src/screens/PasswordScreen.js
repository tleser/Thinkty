import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, Alert, Modal, StyleSheet } from 'react-native';
import { supabase } from '../lib/supabase';
import CryptoJS from 'crypto-js';

const SECRET_KEY = 'your-secret-key'; // Stocke cette clé en toute sécurité

const encryptPassword = (password) => {
    return CryptoJS.AES.encrypt(password, SECRET_KEY).toString();
};

const decryptPassword = (encryptedPassword) => {
    const bytes = CryptoJS.AES.decrypt(encryptedPassword, SECRET_KEY);
    return bytes.toString(CryptoJS.enc.Utf8);
};

const PasswordScreen = () => {
    const [passwords, setPasswords] = useState([]);
    const [modalVisible, setModalVisible] = useState(false);
    const [title, setTitle] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [userId, setUserId] = useState('');

    useEffect(() => {
        const fetchUser = async () => {
            const { data, error } = await supabase.auth.getUser();
            if (error) {
                console.error("Erreur récupération utilisateur :", error);
                return;
            }
            if (data?.user) {
                setUserId(data.user.id);
                fetchPasswords(data.user.id);
            }
        };
        fetchUser();
    }, []);

    const fetchPasswords = async (userId) => {
        const { data, error } = await supabase
            .from('passwords')
            .select('*')
            .eq('user_id', userId);

        if (error) {
            console.error("Erreur récupération mots de passe :", error);
        } else {
            setPasswords(data);
        }
    };

    const handleAddPassword = async () => {
        if (!title || !username || !password) {
            Alert.alert('Erreur', 'Veuillez remplir tous les champs.');
            return;
        }

        if (!userId) {
            Alert.alert('Erreur', "Utilisateur non trouvé.");
            return;
        }

        const encryptedPassword = encryptPassword(password);

        const { error } = await supabase
            .from('passwords')
            .insert([{
                user_id: userId,
                title,
                username,
                hashed_password: encryptedPassword
            }]);

        if (error) {
            console.error("Erreur ajout mot de passe :", error);
            Alert.alert('Erreur', "Impossible d'ajouter le mot de passe.");
        } else {
            Alert.alert('Succès', 'Mot de passe ajouté.');
            fetchPasswords(userId);
            setModalVisible(false);
            setTitle('');
            setUsername('');
            setPassword('');
        }
    };

    const handleRevealPassword = (passwordItem) => {
        Alert.prompt(
            "Vérification",
            "Entrez votre mot de passe général pour voir le mot de passe enregistré.",
            [
                {
                    text: "Annuler",
                    style: "cancel"
                },
                {
                    text: "OK",
                    onPress: (inputPassword) => {
                        try {
                            const decryptedPassword = decryptPassword(passwordItem.hashed_password);
                            Alert.alert("Mot de passe", `Le mot de passe est : ${decryptedPassword}`);
                        } catch (error) {
                            Alert.alert("Erreur", "Impossible de décrypter le mot de passe.");
                        }
                    }
                }
            ],
            "secure-text"
        );
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Mes mots de passe</Text>

            <FlatList
                data={passwords}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                    <View style={styles.passwordItem}>
                        <Text style={styles.passwordText}>{item.title} - {item.username}</Text>
                        <TouchableOpacity
                            style={styles.revealButton}
                            onPress={() => handleRevealPassword(item)}
                        >
                            <Text style={styles.buttonText}>Voir</Text>
                        </TouchableOpacity>
                    </View>
                )}
            />

            <TouchableOpacity style={styles.addButton} onPress={() => setModalVisible(true)}>
                <Text style={styles.buttonText}>Ajouter un mot de passe</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, padding: 20 },
    title: { fontSize: 24, fontWeight: 'bold', textAlign: 'center', marginBottom: 20 },
    passwordItem: { padding: 10, borderBottomWidth: 1, borderBottomColor: '#ccc' },
    passwordText: { fontSize: 16 },
    revealButton: { backgroundColor: '#4CAF50', padding: 10, borderRadius: 5 },
    addButton: { backgroundColor: '#2196F3', padding: 15, borderRadius: 5, marginTop: 20, alignItems: 'center' },
    buttonText: { color: 'white', fontSize: 16, fontWeight: 'bold' }
});

export default PasswordScreen;
