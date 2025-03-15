import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import MainScreen from '../screens/MainScreen';
import AboutScreen from '../screens/AboutScreen';
import TasksScreen from '../screens/TasksScreen';
import NotesScreen from '../screens/NotesScreen';
import NoteDetailScreen from '../screens/NoteDetailScreen';
import ProfileScreen from '../screens/ProfileScreen';

const Stack = createStackNavigator();

const AppNavigator = () => {
    return (
        <Stack.Navigator>
            <Stack.Screen name="Accueil" component={MainScreen} />
            <Stack.Screen name="À propos" component={AboutScreen} />
            <Stack.Screen name="Mes Tâches" component={TasksScreen} />
            <Stack.Screen name="Mes Notes" component={NotesScreen} />
            <Stack.Screen name="Détail de la note" component={NoteDetailScreen} />
            <Stack.Screen name="Profil" component={ProfileScreen} />
        </Stack.Navigator>
    );
};

export default AppNavigator;