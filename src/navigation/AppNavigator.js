import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import MainScreen from '../screens/MainScreen';
import AboutScreen from '../screens/AboutScreen';
import TasksScreen from '../screens/TasksScreen';

const Stack = createStackNavigator();

const AppNavigator = () => {
    return (
        <Stack.Navigator>
            <Stack.Screen name="Accueil" component={MainScreen} />
            <Stack.Screen name="À propos" component={AboutScreen} />
            <Stack.Screen name="Mes Tâches" component={TasksScreen} />
        </Stack.Navigator>
    );
};

export default AppNavigator;