import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { supabase } from '../lib/supabase';

const MainScreen = ({ navigation }) => {
    const handleLogout = async () => {
        await supabase.auth.signOut();
        navigation.replace('Login'); // Redirige vers la page Login après déconnexion
    };

    const handleProfile = () => {
        // Logic to navigate to the Profile screen
        navigation.navigate('Profile'); // Remplace 'Profile' par le nom de l'écran du profil si nécessaire
    };

    const handleAbout = () => {
        // Logic to navigate to the About screen
        navigation.navigate('À propos'); // Remplace 'About' par le nom de l'écran À propos si nécessaire
    };

    return (
        <View style={styles.container}>
            <View style={styles.headerButtonContainer}>
                <TouchableOpacity style={styles.headerButton} onPress={handleAbout}>
                    <Text style={styles.headerButtonText}>À propos</Text>
                </TouchableOpacity>
            </View>

            {/* Image en dessous des boutons */}
            <Image
                source={require('../img/thinktyapp.png')}
                style={styles.logo}
                resizeMode="contain"
            />

            <Text style={styles.title}>Bienvenue sur Thinkty</Text>
            <Text style={styles.slogan}>Think in Security</Text>

            <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Mes Tâches')}>
                <Text style={styles.buttonText}> Mes Tâches</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Mes Notes')}>
                <Text style={styles.buttonText}>Mes Notes</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Passwords')}>
                <Text style={styles.buttonText}>   Mes Mots de Passe</Text>
            </TouchableOpacity>

            <View style={styles.footer}>
                <TouchableOpacity style={styles.profileButton} onPress={() => navigation.navigate('Profil')}>
                    <Text style={styles.profileText}>Mon Profil</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
                    <Text style={styles.logoutText}>Déconnexion</Text>
                </TouchableOpacity>
            </View>

            <Text style={styles.copyright}>© 2025 Tobias Leser</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'flex-start',
        alignItems: 'center',
        padding: 20,
    },

    headerButtonContainer: {
        position: 'absolute',
        top: 20,
        right: 20,
        zIndex: 1,
    },
    headerButton: {
        backgroundColor: '#2196F3',
        paddingVertical: 10,
        paddingHorizontal: 15,
        borderRadius: 8,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 5,
    },
    headerButtonText: {
        color: 'white',
        fontSize: 14,
        fontWeight: 'bold',
    },

    logo: {
        width: 150,
        height: 150,
        marginTop: 50,
        marginBottom: 20,
    },
    title: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#2196F3',
        textAlign: 'center',
        marginBottom: 10,
    },
    slogan: {
        fontSize: 18,
        color: '#888',
        textAlign: 'center',
        marginBottom: 30,
    },
    button: {
        width: '85%',
        backgroundColor: '#2196F3',
        paddingVertical: 15,
        borderRadius: 10,
        marginVertical: 10,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 5,
        elevation: 6,
    },
    buttonText: {
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold',
    },
    footer: {
        position: 'absolute',
        bottom: 60,
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '85%',
    },
    logoutButton: {
        backgroundColor: '#FF3B30',
        paddingVertical: 12,
        borderRadius: 10,
        width: '48%',
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 5,
    },
    logoutText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    profileButton: {
        backgroundColor: '#2196F3',
        paddingVertical: 12,
        borderRadius: 10,
        width: '48%',
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 5,
    },
    profileText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    copyright: {
        position: 'absolute',
        bottom: 20,
        left: 0,
        right: 0,
        fontSize: 15,
        color: '#2196F3',
        textAlign: 'center',
    },
});


export default MainScreen;