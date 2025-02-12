import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, Keyboard, StyleSheet, KeyboardAvoidingView, Platform, TouchableWithoutFeedback } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { supabase } from '../lib/supabase';

const TasksScreen = () => {
    const [tasks, setTasks] = useState([]);
    const [taskText, setTaskText] = useState('');
    const [userId, setUserId] = useState(null);

    // Charger les tâches au démarrage
    useEffect(() => {
        const fetchTasks = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return;

            setUserId(user.id);

            const { data, error } = await supabase
                .from('tasks')
                .select('*')
                .eq('user_id', user.id)
                .order('created_at', { ascending: false });

            if (error) {
                console.error('Erreur de chargement des tâches:', error);
            } else {
                setTasks(data);
            }
        };

        fetchTasks();
    }, []);

    // Ajouter une tâche
    const addTask = async () => {
        if (taskText.trim() === '' || !userId) return;

        const { data, error } = await supabase
            .from('tasks')
            .insert([{ text: taskText, completed: false, user_id: userId }])
            .select()
            .single();

        if (error) {
            console.error('Erreur lors de l’ajout de la tâche:', error);
        } else {
            setTasks([data, ...tasks]);
            setTaskText('');
            Keyboard.dismiss();
        }
    };

    // Supprimer une tâche
    const deleteTask = async (taskId) => {
        const { error } = await supabase
            .from('tasks')
            .delete()
            .eq('id', taskId); // Supprimer la tâche de la BDD

        if (error) {
            console.error('Erreur lors de la suppression:', error);
        } else {
            // Supprimer la tâche de l'état local pour la mise à jour de l'UI
            setTasks(tasks.filter(task => task.id !== taskId));
        }
    };

    // Marquer une tâche comme terminée
    const toggleTaskCompletion = async (taskId, currentStatus) => {
        const { data, error } = await supabase
            .from('tasks')
            .update({ completed: !currentStatus })
            .eq('id', taskId)
            .select()
            .single();

        if (error) {
            console.error('Erreur lors de la mise à jour de la tâche:', error);
        } else {
            setTasks(tasks.map(task => (task.id === taskId ? data : task)));
        }
    };

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            keyboardVerticalOffset={100}
            style={styles.container}
        >
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <View style={styles.innerContainer}>
                    <Text style={styles.title}>Mes Tâches</Text>
                    <FlatList
                        data={tasks}
                        keyExtractor={(item) => item.id.toString()}
                        renderItem={({ item }) => (
                            <View style={styles.taskContainer}>
                                <TouchableOpacity onPress={() => toggleTaskCompletion(item.id, item.completed)}>
                                    <Ionicons name={item.completed ? "checkmark-circle" : "ellipse-outline"} size={24} color={item.completed ? "green" : "gray"} />
                                </TouchableOpacity>
                                <Text style={[styles.taskText, item.completed && styles.taskCompleted]}>{item.text}</Text>
                                <TouchableOpacity onPress={() => deleteTask(item.id)}>
                                    <Ionicons name="trash" size={24} color="red" />
                                </TouchableOpacity>
                            </View>
                        )}
                        contentContainerStyle={{ flexGrow: 1, paddingBottom: 100 }}
                    />
                    <View style={styles.inputContainer}>
                        <TextInput
                            style={styles.input}
                            placeholder="Ajouter une tâche"
                            value={taskText}
                            onChangeText={setTaskText}
                            onSubmitEditing={addTask}
                        />
                        <TouchableOpacity style={styles.addButton} onPress={addTask}>
                            <Ionicons name="add" size={24} color="white" />
                        </TouchableOpacity>
                    </View>
                </View>
            </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    innerContainer: {
        flex: 1,
        padding: 20,
        justifyContent: 'flex-end',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 20,
        color: '#2196F3'
    },
    taskContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 10,
        borderBottomWidth: 1,
        borderColor: '#2196F3',
    },
    taskText: {
        flex: 1,
        fontSize: 18,
        marginLeft: 10,
    },
    taskCompleted: {
        textDecorationLine: 'line-through',
        color: '#2196F3',
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderTopWidth: 1,
        paddingTop: 10,
        backgroundColor: 'white',
        paddingBottom: 10,
    },
    input: {
        flex: 1,
        height: 40,
        borderColor: '#2196F3',
        borderWidth: 1,
        borderRadius: 5,
        paddingHorizontal: 10,
    },
    addButton: {
        marginLeft: 10,
        backgroundColor: '#2196F3',
        padding: 10,
        borderRadius: 5,
    },
});

export default TasksScreen;
