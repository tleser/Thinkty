import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, Modal, Alert, StyleSheet, KeyboardAvoidingView, ScrollView, Platform } from 'react-native';
import { supabase } from '../lib/supabase';
import CryptoJS from 'crypto-js';

const SECRET_KEY = "une_clé_secrète_très_sécurisée"; // 🔹 Stocke cette clé dans un .env pour plus de sécurité

const encryptPassword = (password) => {
    return CryptoJS.AES.encrypt(password, SECRET_KEY).toString();
};

const decryptPassword = (encryptedPassword) => {
    const bytes = CryptoJS.AES.decrypt(encryptedPassword, SECRET_KEY);
    return bytes.toString(CryptoJS.enc.Utf8);
};

const ProfileScreen = () => {
    const [email, setEmail] = useState('');
    const [generalPassword, setGeneralPassword] = useState('');
    const [newGeneralPassword, setNewGeneralPassword] = useState('');
    const [accountPassword, setAccountPassword] = useState('');
    const [modalVisible, setModalVisible] = useState(false);

    useEffect(() => {
        const fetchProfile = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (user) {
                setEmail(user.email);
                const { data, error } = await supabase
                    .from('profiles')
                    .select('general_password')
                    .eq('user_id', user.id)
                    .single();

                if (error) {
                    console.error(error);
                } else {
                    setGeneralPassword(decryptPassword(data.general_password));
                }
            }
        };

        fetchProfile();
    }, []);

    const handleVerifyAndUpdatePassword = async () => {
        if (!newGeneralPassword) {
            Alert.alert("Erreur", "Le nouveau mot de passe ne peut pas être vide.");
            return;
        }

        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password: accountPassword
        });

        if (error) {
            Alert.alert("Erreur", "Mot de passe incorrect.");
            return;
        }

        const encryptedPassword = encryptPassword(newGeneralPassword);

        const { error: updateError } = await supabase
            .from('profiles')
            .update({ general_password: encryptedPassword })
            .eq('user_id', data.user.id);

        if (updateError) {
            Alert.alert("Erreur", "Impossible de mettre à jour le mot de passe.");
        } else {
            Alert.alert("Succès", "Mot de passe général mis à jour !");
            setModalVisible(false);
            setNewGeneralPassword('');
            setAccountPassword('');
        }
    };

    return (
        <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={styles.container}>
            <ScrollView contentContainerStyle={styles.scrollView} keyboardShouldPersistTaps="handled">
                <Text style={styles.title}>Mon Profil</Text>
                <Text style={styles.label}>Adresse Email :</Text>
                <Text style={styles.email}>{email}</Text>
                <TouchableOpacity style={styles.button} onPress={() => setModalVisible(true)}>
                    <Text style={styles.buttonText}>Modifier le mot de passe général</Text>
                </TouchableOpacity>

                <Modal visible={modalVisible} animationType="slide" transparent>
                    <View style={styles.modalContainer}>
                        <View style={styles.modalContent}>
                            <Text style={styles.modalTitle}>Modifier le mot de passe général</Text>
                            <Text style={styles.label}>Mot de passe de votre compte :</Text>
                            <TextInput style={styles.input} placeholder="Mot de passe du compte" secureTextEntry value={accountPassword} onChangeText={setAccountPassword} />
                            <Text style={styles.label}>Nouveau mot de passe général :</Text>
                            <TextInput style={styles.input} placeholder="Nouveau mot de passe général" secureTextEntry value={newGeneralPassword} onChangeText={setNewGeneralPassword} />
                            <View style={styles.buttonContainer}>
                                <TouchableOpacity style={styles.cancelButton} onPress={() => setModalVisible(false)}>
                                    <Text style={styles.buttonText}>Annuler</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={styles.confirmButton} onPress={handleVerifyAndUpdatePassword}>
                                    <Text style={styles.buttonText}>Confirmer</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </Modal>
            </ScrollView>
        </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#fff' },
    scrollView: { flexGrow: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
    title: { fontSize: 24, fontWeight: 'bold', textAlign: 'center', marginBottom: 20, color: '#2196F3' },
    label: { fontSize: 16, fontWeight: 'bold', marginTop: 10 },
    email: { fontSize: 16, marginBottom: 20, color: 'gray' },
    button: { backgroundColor: '#2196F3', padding: 15, borderRadius: 5, alignItems: 'center' },
    buttonText: { color: 'white', fontSize: 16, fontWeight: 'bold' },
    modalContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0, 0, 0, 0.5)' },
    modalContent: { width: '80%', backgroundColor: 'white', padding: 20, borderRadius: 10, alignItems: 'center' },
    modalTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 10 },
    input: { width: '100%', padding: 10, borderWidth: 1, borderColor: '#ccc', borderRadius: 5, marginBottom: 10 },
    buttonContainer: { flexDirection: 'row', justifyContent: 'space-between', width: '100%' },
    cancelButton: { backgroundColor: 'red', padding: 10, borderRadius: 5, flex: 1, marginRight: 5, alignItems: 'center' },
    confirmButton: { backgroundColor: '#2196F3', padding: 10, borderRadius: 5, flex: 1, marginLeft: 5, alignItems: 'center' },
});

export default ProfileScreen;