import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { supabase } from '../lib/supabase';

const NoteDetailsScreen = ({ route, navigation }) => {
    const { note } = route.params;

    const [title, setTitle] = useState(note.title);
    const [content, setContent] = useState(note.content);
    const [isEditing, setIsEditing] = useState(false);

    // Fonction pour mettre à jour la note dans Supabase
    const updateNote = async () => {
        const { error } = await supabase
            .from('notes')
            .update({ title, content })
            .eq('id', note.id);

        if (error) {
            console.error("❌ Erreur de mise à jour :", error);
        } else {
            console.log("✅ Note mise à jour !");
            setIsEditing(false);
            navigation.goBack(); // Retour à l'écran précédent après mise à jour
        }
    };

    return (
        <View style={styles.container}>
            {isEditing ? (
                <>
                    <TextInput
                        style={styles.inputTitle}
                        value={title}
                        onChangeText={setTitle}
                        placeholder="Titre de la note"
                    />
                    <TextInput
                        style={styles.inputContent}
                        value={content}
                        onChangeText={setContent}
                        placeholder="Contenu de la note"
                        multiline
                    />
                    <TouchableOpacity style={styles.saveButton} onPress={updateNote}>
                        <Text style={styles.saveButtonText}>Enregistrer</Text>
                    </TouchableOpacity>
                </>
            ) : (
                <>
                    <Text style={styles.title}>{note.title}</Text>
                    <Text style={styles.content}>{note.content}</Text>
                    <TouchableOpacity style={styles.editButton} onPress={() => setIsEditing(true)}>
                        <Ionicons name="pencil" size={24} color="white" />
                        <Text style={styles.editButtonText}>Modifier</Text>
                    </TouchableOpacity>
                </>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: 'white',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    content: {
        fontSize: 18,
        color: 'gray',
    },
    inputTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        borderBottomWidth: 1,
        marginBottom: 10,
    },
    inputContent: {
        fontSize: 16,
        borderWidth: 1,
        borderColor: '#ddd',
        padding: 10,
        borderRadius: 5,
        height: 100,
        textAlignVertical: 'top',
    },
    editButton: {
        flexDirection: 'row',
        backgroundColor: '#2196F3',
        padding: 10,
        borderRadius: 5,
        alignItems: 'center',
        marginTop: 20,
    },
    editButtonText: {
        color: 'white',
        marginLeft: 10,
        fontSize: 16,
    },
    saveButton: {
        backgroundColor: '#2196F3',
        padding: 10,
        borderRadius: 5,
        alignItems: 'center',
        marginTop: 20,
    },
    saveButtonText: {
        color: 'white',
        fontSize: 16,
    },
});

export default NoteDetailsScreen;
