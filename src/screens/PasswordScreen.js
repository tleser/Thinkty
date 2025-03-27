import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, Alert, Modal, StyleSheet, ActivityIndicator } from 'react-native';
import { supabase } from '../lib/supabase';
import bcrypt from 'react-native-bcrypt';

const PasswordScreen = () => {
    const [passwords, setPasswords] = useState([]);
    const [modalVisible, setModalVisible] = useState(false);
    const [title, setTitle] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [userId, setUserId] = useState('');
    const [generalPassword, setGeneralPassword] = useState('');
    const [loadingReveal, setLoadingReveal] = useState(false); // État de chargement pour la révélation du mot de passe

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
                fetchGeneralPassword(data.user.id);
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

    const fetchGeneralPassword = async (userId) => {
        const { data, error } = await supabase
            .from('profiles')
            .select('general_password')
            .eq('user_id', userId)
            .single();

        if (error) {
            console.error("Erreur récupération du mot de passe général :", error);
        } else {
            console.log("Mot de passe général récupéré (hash) :", data.general_password);
            setGeneralPassword(data.general_password);
        }
    };

    const handleAddPassword = async () => {
        console.log("Tentative d'ajout d'un mot de passe");

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

        try {
            const { data, error } = await supabase
                .from('passwords')
                .insert([{
                    user_id: userId,
                    title,
                    username,
                    hashed_password: password
                }]);


            if (error) {
                console.error("Erreur ajout mot de passe :", error);
                Alert.alert('Erreur', "Impossible d'ajouter le mot de passe.");
            } else {
                console.log('Mot de passe ajouté avec succès', data);
                Alert.alert('Succès', 'Mot de passe ajouté.');
                fetchPasswords(userId);
                setModalVisible(false);
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
                    onPress: async (inputPassword) => {
                        console.log("Mot de passe saisi :", inputPassword);
                        console.log("Mot de passe général stocké (hash) :", generalPassword);

                        setLoadingReveal(true); // Démarre le chargement

                        bcrypt.compare(inputPassword, generalPassword, (err, isMatch) => {
                            setLoadingReveal(false); // Arrête le chargement

                            if (err) {
                                console.error("Erreur de comparaison bcrypt :", err);
                                Alert.alert("Erreur", "Une erreur est survenue.");
                                return;
                            }

                            if (isMatch) {
                                Alert.alert("Mot de passe", `Le mot de passe est : ${passwordItem.hashed_password}`);
                            } else {
                                Alert.alert("Erreur", "Mot de passe général incorrect.");
                            }
                        });
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
            fetchPasswords(userId);
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

            {loadingReveal && (
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color="#2196F3" />
                    <Text style={styles.loadingText}>Chargement...</Text>
                </View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, padding: 20 },
    title: { fontSize: 24, fontWeight: 'bold', textAlign: 'center', marginBottom: 20, color: '#2196F3' },
    passwordItem: { padding: 10, borderBottomWidth: 1, borderBottomColor: '#ccc' },
    passwordText: { fontSize: 16 },
    revealButton: { backgroundColor: '#2196F3', padding: 10, borderRadius: 5, marginTop: 5 },
    deleteButton: { backgroundColor: '#F44336', padding: 10, borderRadius: 5, marginTop: 5 },
    addButton: { backgroundColor: '#2196F3', padding: 15, borderRadius: 5, marginTop: 20, alignItems: 'center' },
    buttonText: { color: 'white', fontSize: 16, fontWeight: 'bold' },
    modalOverlay: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0, 0, 0, 0.5)' },
    modalContent: { backgroundColor: 'white', padding: 20, borderRadius: 10, width: '80%' },
    input: { height: 40, borderColor: '#2196F3', borderWidth: 1, marginBottom: 10, paddingLeft: 10, borderRadius: 5 },
    loadingContainer: { position: 'absolute', top: '50%', left: '50%', transform: [{ translateX: -50 }, { translateY: -50 }] },
    loadingText: { marginTop: 10, fontSize: 18, color: '#2196F3' },
});

export default PasswordScreen;