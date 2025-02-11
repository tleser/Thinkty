import React, { useState } from 'react';
import { View, Text, TextInput, Button, Alert, StyleSheet, Image, KeyboardAvoidingView, Platform, TouchableWithoutFeedback, Keyboard } from 'react-native';
import { supabase } from '../lib/supabase';

const LoginScreen = ({ navigation }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = async () => {
        const { error } = await supabase.auth.signInWithPassword({ email, password });

        if (error) {
            Alert.alert('Erreur', error.message);
        }
    };

    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
            <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
                <View style={styles.inner}>
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
                        <Button title="Se connecter" onPress={handleLogin} />
                    </View>

                    <Text style={styles.registerText}>
                        Pas encore inscrit ?{' '}
                        <Text style={styles.link} onPress={() => navigation.navigate('Register')}>
                            Inscription
                        </Text>
                    </Text>
                </View>
            </TouchableWithoutFeedback>

            <View style={styles.footer}>
                <Text style={styles.copyright}>© 2025 Tobias Leser</Text>
            </View>
        </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    inner: {
        alignItems: 'center',
        width: '100%',
    },
    logo: {
        width: 300,
        height: 200,
        marginBottom: 20,
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
        width: '100%',
    },
    registerText: {
        textAlign: 'center',
        marginTop: 20,
    },
    link: {
        color: '#2196F3',
        textDecorationLine: 'underline',
    },
    footer: {
        position: 'absolute',
        bottom: 0,
        width: '100%',
        alignItems: 'center',
        marginBottom: 10,
    },
    copyright: {
        fontSize: 15,
        color: '#2196F3',
        textAlign: 'center',
        bottom: 20,
    },
});

export default LoginScreen;