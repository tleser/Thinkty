import React, { useState, useEffect } from 'react';
import {
    View, Text, TextInput, TouchableOpacity, FlatList, Keyboard,
    StyleSheet, KeyboardAvoidingView, Platform, TouchableWithoutFeedback
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { supabase } from '../lib/supabase';

const NotesScreen = () => {
    const [notes, setNotes] = useState([]);
    const [title, setTitle] = useState('');
    const [noteText, setNoteText] = useState('');
    const [userId, setUserId] = useState(null);
    const navigation = useNavigation();

    // Charger les notes au démarrage
    useEffect(() => {
        const fetchNotes = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return;

            setUserId(user.id);

            const { data, error } = await supabase
                .from('notes')
                .select('*')
                .eq('user_id', user.id)  // Utilisation correcte de "user_id"
                .order('created_at', { ascending: false });

            if (error) {
                console.error('❌ Erreur de chargement des notes:', error);
            } else {
                console.log("📄 Notes récupérées:", data);
                setNotes(data);
            }
        };

        fetchNotes();
    }, []);

    // Ajouter une note
    const addNote = async () => {
        if (title.trim() === '' || noteText.trim() === '' || !userId) return;

        console.log("Tentative d'ajout de note...");

        const { data, error } = await supabase
            .from('notes')
            .insert([{
                title,
                content: noteText,  // Utilisation correcte de "content"
                user_id: userId,    // Utilisation correcte de "user_id"
                is_private: false   // Valeur par défaut
            }])
            .select()
            .single();

        if (error) {
            console.error('❌ Erreur lors de l’ajout de la note:', error);
        } else {
            console.log("✅ Note ajoutée avec succès:", data);
            setNotes([data, ...notes]);
            setTitle('');
            setNoteText('');
            Keyboard.dismiss();
        }
    };

    // Supprimer une note
    const deleteNote = async (noteId) => {
        const { error } = await supabase
            .from('notes')
            .delete()
            .eq('id', noteId);

        if (error) {
            console.error('❌ Erreur lors de la suppression:', error);
        } else {
            setNotes(notes.filter(note => note.id !== noteId));
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
                    <Text style={styles.title}>Mes Notes</Text>

                    <FlatList
                        data={notes}
                        keyExtractor={(item) => item.id.toString()}
                        renderItem={({ item }) => (
                            <TouchableOpacity
                                onPress={() => navigation.navigate('Détail de la note', { note: item })}
                                style={styles.noteContainer}
                            >
                                <View style={{ flex: 1 }}>
                                    <Text style={styles.noteTitle}>{item.title}</Text>
                                    <Text numberOfLines={1} style={styles.noteText}>{item.content}</Text>
                                </View>
                                <TouchableOpacity onPress={() => deleteNote(item.id)}>
                                    <Ionicons name="trash" size={24} color="red" />
                                </TouchableOpacity>
                            </TouchableOpacity>
                        )}
                        contentContainerStyle={{ flexGrow: 1, paddingBottom: 100 }}
                    />

                    {/* Zone de texte avec titre */}
                    <View style={styles.inputContainer}>
                        <TextInput
                            style={styles.titleInput}
                            placeholder="Titre de la note..."
                            value={title}
                            onChangeText={setTitle}
                        />
                        <TextInput
                            style={styles.textArea}
                            placeholder="Écris ta note ici..."
                            value={noteText}
                            onChangeText={setNoteText}
                            multiline={true}
                            numberOfLines={4}
                        />
                        <TouchableOpacity style={styles.addButton} onPress={addNote}>
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
        color: '#2196F3',
    },
    noteContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 10,
        borderBottomWidth: 1,
        borderColor: '#2196F3',
    },
    noteTitle: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    noteText: {
        fontSize: 16,
        color: 'gray',
    },
    inputContainer: {
        borderTopWidth: 1,
        paddingTop: 10,
        backgroundColor: 'white',
        paddingBottom: 10,
    },
    titleInput: {
        height: 40,
        borderColor: '#2196F3',
        borderWidth: 1,
        borderRadius: 5,
        paddingHorizontal: 10,
        marginBottom: 5,
    },
    textArea: {
        height: 80,
        borderColor: '#2196F3',
        borderWidth: 1,
        borderRadius: 5,
        paddingHorizontal: 10,
        textAlignVertical: 'top',
    },
    addButton: {
        marginTop: 10,
        backgroundColor: '#2196F3',
        padding: 10,
        borderRadius: 5,
        alignItems: 'center',
    },
});

export default NotesScreen;
