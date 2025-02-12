import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

const AboutScreen = ({ navigation }) => {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>À propos de Thinkty</Text>
            <Text style={styles.description}>
                Thinkty est une application mobile conçue pour offrir un espace sécurisé aux utilisateurs.
                Grâce à Thinkty, vous pouvez gérer vos tâches, prendre des notes et stocker vos mots de passe
                en toute sécurité. Ce projet a été développé avec passion par Tobias Leser dans le cadre de ses études en BTS SIO.
            </Text>

            <TouchableOpacity style={styles.button} onPress={() => navigation.goBack()}>
                <Text style={styles.buttonText}>Retour</Text>
            </TouchableOpacity>

            <Text style={styles.copyright}>© 2025 Tobias Leser</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
        backgroundColor: 'white',
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#2196F3',
        textAlign: 'center',
        marginBottom: 20,
    },
    description: {
        fontSize: 16,
        color: '#333',
        textAlign: 'center',
        marginBottom: 40,
        lineHeight: 22,
    },
    button: {
        backgroundColor: '#2196F3',
        padding: 15,
        borderRadius: 5,
        alignItems: 'center',
        width: '80%',
    },
    buttonText: {
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold',
    },
    copyright: {
        position: 'absolute',
        bottom: 20,
        fontSize: 14,
        color: '#2196F3',
        textAlign: 'center',
    },
});

export default AboutScreen;