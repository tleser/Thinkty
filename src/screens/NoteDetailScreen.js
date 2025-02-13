import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const NoteDetailScreen = ({ route }) => {
    const { note } = route.params;

    return (
        <View style={styles.container}>
            <Text style={styles.title}>{note.title}</Text>
            <Text style={styles.content}>{note.content}</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#fff',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    content: {
        fontSize: 18,
    },
});

export default NoteDetailScreen;
