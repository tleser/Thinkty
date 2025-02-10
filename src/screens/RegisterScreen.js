import React, { useState } from 'react';
import { View, Text, TextInput, Button, Alert, StyleSheet, Image } from 'react-native';
import { supabase } from '../lib/supabase';

const RegisterScreen = ({ navigation }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleRegister = async () => {
        const { error } = await supabase.auth.signUp({
            email,
            password,
        });

        if (error) {
            Alert.alert('Erreur', error.message);
        } else {
            Alert.alert('Succès', 'Un email de confirmation a été envoyé.');
            navigation.navigate('Login');
        }
    };

    return (
        <View style={styles.container}>
            {/* Ajout de l'image ici */}
            <Image
                source={require('../img/thinktyapp.png')}
                style={styles.logo}
                resizeMode="contain"
            />

            <Text style={styles.title}>Thinkty</Text>
            <Text style={styles.slogan}>Think in Security</Text>

            <TextInput
                placeholder="Email"
                onChangeText={setEmail}
                value={email}
                style={styles.input}
            />
            <TextInput
                placeholder="Mot de passe"
                secureTextEntry
                onChangeText={setPassword}
                value={password}
                style={styles.input}
            />

            <View style={styles.buttonContainer}>
                <Button title="S'inscrire" onPress={handleRegister} />
            </View>

            <Text style={styles.loginText}>
                Déjà un compte ?{' '}
                <Text style={styles.link} onPress={() => navigation.navigate('Login')}>
                    Se connecter
                </Text>
            </Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center', // Centre tous les éléments
        padding: 20,
    },
    logo: {
        width: 100,  // Taille de l'image
        height: 100,
        marginBottom: 20,  // Espacement entre l'image et le titre
    },
    title: {
        fontSize: 36,
        fontWeight: 'bold',
        color: '#2196F3',
        textAlign: 'center',
        marginBottom: 10,
    },
    slogan: {
        fontSize: 18,
        color: '#888',
        textAlign: 'center',
        marginBottom: 20,
    },
    input: {
        width: '100%',
        height: 40,
        borderColor: '#ddd',
        borderWidth: 1,
        borderRadius: 5,
        marginBottom: 20,
        paddingLeft: 10,
    },
    buttonContainer: {
        marginTop: 20,
        width: '100%', // Largeur du bouton
    },
    loginText: {
        textAlign: 'center',
        marginTop: 20,
    },
    link: {
        color: '#2196F3',
        textDecorationLine: 'underline',
    },
});

export default RegisterScreen;