import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, Alert, Modal, StyleSheet } from 'react-native';
import { supabase } from '../lib/supabase';
import CryptoJS from 'crypto-js';

const SECRET_KEY = 'your-secret-key'; // Stocke cette clé en toute sécurité (peut être amélioré pour être plus sécurisé)

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
    const [generalPassword, setGeneralPassword] = useState(''); // Pour stocker le mot de passe général temporairement

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
                fetchGeneralPassword(data.user.id); // Récupérer le mot de passe général
            }
        };
        fetchUser();
    }, []);

    const fetchPasswords = async (userId) => {
        console.log("Récupération des mots de passe pour l'utilisateur", userId);
        const { data, error } = await supabase
            .from('passwords')
            .select('*')
            .eq('user_id', userId);

        if (error) {
            console.error("Erreur récupération mots de passe :", error);
        } else {
            console.log("Mots de passe récupérés :", data);
            setPasswords(data);
        }
    };

    // Récupérer le mot de passe général depuis la table "profiles"
    const fetchGeneralPassword = async (userId) => {
        const { data, error } = await supabase
            .from('profiles')
            .select('general_password')
            .eq('user_id', userId)
            .single(); // Récupère uniquement une ligne

        if (error) {
            console.error("Erreur récupération du mot de passe général :", error);
        } else {
            console.log("Mot de passe général récupéré :", data);
            setGeneralPassword(data.general_password);
        }
    };

    const handleAddPassword = async () => {
        console.log("Tentative d'ajout d'un mot de passe"); // Ajoutons un log ici pour voir si la fonction est appelée

        if (!title || !username || !password) {
            Alert.alert('Erreur', 'Veuillez remplir tous les champs.');
            console.log("Champs manquants");
            return;
        }

        if (!userId) {
            Alert.alert('Erreur', "Utilisateur non trouvé.");
            console.log("Utilisateur non trouvé");
            return;
        }

        const encryptedPassword = encryptPassword(password);
        console.log("Mot de passe crypté", encryptedPassword); // Vérifie que le mot de passe est bien crypté

        try {
            // Ajouter un mot de passe à la base de données
            const { data, error } = await supabase
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
                console.log('Mot de passe ajouté avec succès', data);
                Alert.alert('Succès', 'Mot de passe ajouté.');
                fetchPasswords(userId); // Met à jour la liste des mots de passe
                setModalVisible(false); // Ferme la modale
                setTitle('');
                setUsername('');
                setPassword('');
            }
        } catch (error) {
            console.error("Erreur lors de l'ajout du mot de passe:", error);
            Alert.alert('Erreur', "Une erreur s'est produite lors de l'ajout.");
        }
    };

    const handleRevealPassword = (passwordItem) => {
        // Demander le mot de passe général pour vérifier
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
                        // Vérifier si le mot de passe général est correct
                        if (inputPassword === generalPassword) {
                            try {
                                // Déchiffrer le mot de passe
                                const decryptedPassword = decryptPassword(passwordItem.hashed_password);
                                Alert.alert("Mot de passe", `Le mot de passe est : ${decryptedPassword}`);
                            } catch (error) {
                                Alert.alert("Erreur", "Impossible de décrypter le mot de passe.");
                            }
                        } else {
                            Alert.alert("Erreur", "Mot de passe général incorrect.");
                        }
                    }
                }
            ],
            "secure-text"
        );
    };

    const handleDeletePassword = async (passwordItem) => {
        const { error } = await supabase
            .from('passwords')
            .delete()
            .eq('id', passwordItem.id)
            .eq('user_id', userId);

        if (error) {
            console.error("Erreur suppression mot de passe :", error);
            Alert.alert('Erreur', "Impossible de supprimer le mot de passe.");
        } else {
            Alert.alert('Succès', 'Mot de passe supprimé.');
            fetchPasswords(userId); // Met à jour la liste après suppression
        }
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
                        <TouchableOpacity
                            style={styles.deleteButton}
                            onPress={() => handleDeletePassword(item)}
                        >
                            <Text style={styles.buttonText}>Supprimer</Text>
                        </TouchableOpacity>
                    </View>
                )}
            />

            <TouchableOpacity style={styles.addButton} onPress={() => setModalVisible(true)}>
                <Text style={styles.buttonText}>Ajouter un mot de passe</Text>
            </TouchableOpacity>

            {/* Modal pour ajouter un mot de passe */}
            <Modal
                visible={modalVisible}
                animationType="slide"
                transparent={true}
                onRequestClose={() => setModalVisible(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <TextInput
                            style={styles.input}
                            placeholder="Titre"
                            value={title}
                            onChangeText={setTitle}
                        />
                        <TextInput
                            style={styles.input}
                            placeholder="Nom d'utilisateur"
                            value={username}
                            onChangeText={setUsername}
                        />
                        <TextInput
                            style={styles.input}
                            placeholder="Mot de passe"
                            secureTextEntry
                            value={password}
                            onChangeText={setPassword}
                        />
                        <TouchableOpacity style={styles.addButton} onPress={handleAddPassword}>
                            <Text style={styles.buttonText}>Ajouter</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={styles.addButton}
                            onPress={() => setModalVisible(false)}
                        >
                            <Text style={styles.buttonText}>Annuler</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, padding: 20 },
    title: { fontSize: 24, fontWeight: 'bold', textAlign: 'center', marginBottom: 20 },
    passwordItem: { padding: 10, borderBottomWidth: 1, borderBottomColor: '#ccc' },
    passwordText: { fontSize: 16 },
    revealButton: { backgroundColor: '#4CAF50', padding: 10, borderRadius: 5, marginTop: 5 },
    deleteButton: { backgroundColor: '#F44336', padding: 10, borderRadius: 5, marginTop: 5 },
    addButton: { backgroundColor: '#2196F3', padding: 15, borderRadius: 5, marginTop: 20, alignItems: 'center' },
    buttonText: { color: 'white', fontSize: 16, fontWeight: 'bold' },
    modalOverlay: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        backgroundColor: 'white',
        padding: 20,
        borderRadius: 10,
        width: '80%',
    },
    input: {
        height: 40,
        borderColor: '#ccc',
        borderWidth: 1,
        marginBottom: 10,
        paddingLeft: 10,
        borderRadius: 5,
    },
});

export default PasswordScreen;