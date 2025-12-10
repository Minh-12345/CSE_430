import React, { useEffect, useState } from 'react';
import {
    View, Text, FlatList, Image, StyleSheet,
    TouchableOpacity, Alert, TextInput, Modal, ScrollView, ActivityIndicator
} from 'react-native';
import bookApi from '../api/bookApi';

const ManageBooksScreen = ({ navigation }) => {
    const [books, setBooks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedBook, setSelectedBook] = useState(null);
    const [formData, setFormData] = useState({
        title: '',
        author: '',
        price: '',
        description: '',
        imageUrl: '',
        categoryId: '1'
    });

    useEffect(() => {
        loadBooks();
    }, []);

    const loadBooks = async () => {
        try {
            const res = await bookApi.getAll();
            setBooks(res.data);
            setLoading(false);
        } catch (error) {
            console.error("Error loading books:", error);
            setLoading(false);
        }
    };

    const handleDeleteBook = (bookId) => {
        Alert.alert(
            'Delete Confirmation',
            'Are you sure you want to delete this book?',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Delete',
                    style: 'destructive',
                    onPress: async () => {
                        try {
                            await bookApi.deleteBook(bookId);
                            Alert.alert('Success', 'Book deleted successfully');
                            loadBooks();
                        } catch (error) {
                            Alert.alert('Error', 'Failed to delete book');
                        }
                    }
                }
            ]
        );
    };

    const handleEditBook = (book) => {
        setSelectedBook(book);
        setFormData({
            title: book.title || book.Title || '',
            author: book.author || book.Author || '',
            price: String(book.price || book.Price || ''),
            description: book.description || book.Description || '',
            imageUrl: book.imageUrl || book.ImageUrl || '',
            categoryId: String(book.categoryId || book.CategoryId || '1')
        });
        setModalVisible(true);
    };

    const handleAddBook = () => {
        setSelectedBook(null);
        setFormData({
            title: '',
            author: '',
            price: '',
            description: '',
            imageUrl: '',
            categoryId: '1'
        });
        setModalVisible(true);
    };

    const handleSaveBook = async () => {
        if (!formData.title || !formData.author || !formData.price) {
            Alert.alert('Error', 'Please fill in all required fields');
            return;
        }

        try {
            const bookData = {
                title: formData.title,
                author: formData.author,
                price: parseFloat(formData.price),
                description: formData.description,
                imageUrl: formData.imageUrl,
                categoryId: parseInt(formData.categoryId),
                soldCount: selectedBook ? (selectedBook.soldCount || selectedBook.SoldCount || 0) : 0
            };

            if (selectedBook) {
                bookData.bookId = selectedBook.bookId || selectedBook.BookId;
                await bookApi.updateBook(bookData.bookId, bookData);
                Alert.alert('Success', 'Book updated successfully');
            } else {
                await bookApi.addBook(bookData);
                Alert.alert('Success', 'Book added successfully');
            }

            setModalVisible(false);
            loadBooks();
        } catch (error) {
            Alert.alert('Error', 'Failed to save book');
            console.error(error);
        }
    };

    const renderBookItem = ({ item }) => (
        <View style={styles.bookCard}>
            <Image
                source={{ uri: item.imageUrl || item.ImageUrl || 'https://via.placeholder.com/150' }}
                style={styles.bookImage}
            />
            <View style={styles.bookInfo}>
                <Text style={styles.bookTitle} numberOfLines={2}>
                    {item.title || item.Title}
                </Text>
                <Text style={styles.bookPrice}>
                    {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(item.price || item.Price || 0)}
                </Text>
                <Text style={styles.bookStock}>Kho: {item.stock || item.Stock || 0}</Text>
            </View>
            <View style={styles.actions}>
                <TouchableOpacity
                    style={styles.btnEdit}
                    onPress={() => handleEditBook(item)}
                >
                    <Text style={styles.btnEditText}>✏️</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={styles.btnDelete}
                    onPress={() => handleDeleteBook(item.bookId || item.BookId)}
                >
                    <Text style={styles.btnDeleteText}>🗑️</Text>
                </TouchableOpacity>
            </View>
        </View>
    );

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Text style={styles.backText}>{"< Back"}</Text>
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Manage Books</Text>
                <TouchableOpacity onPress={handleAddBook}>
                    <Text style={styles.addText}>+ Add</Text>
                </TouchableOpacity>
            </View>

            {loading ? (
                <ActivityIndicator size="large" color="#1976d2" style={{marginTop: 50}} />
            ) : (
                <FlatList
                    data={books}
                    renderItem={renderBookItem}
                    keyExtractor={item => (item.bookId || item.BookId).toString()}
                    contentContainerStyle={{ padding: 15 }}
                />
            )}

            <Modal
                visible={modalVisible}
                animationType="slide"
                transparent={true}
                onRequestClose={() => setModalVisible(false)}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>
                            {selectedBook ? 'Edit Book' : 'Add New Book'}
                        </Text>

                        <ScrollView style={styles.formScroll} showsVerticalScrollIndicator={false}>
                            <Text style={styles.label}>Title *</Text>
                            <TextInput
                                style={styles.input}
                                value={formData.title}
                                onChangeText={(text) => setFormData({...formData, title: text})}
                                placeholder="Enter book title"
                            />

                            <Text style={styles.label}>Author *</Text>
                            <TextInput
                                style={styles.input}
                                value={formData.author}
                                onChangeText={(text) => setFormData({...formData, author: text})}
                                placeholder="Enter author name"
                            />

                            <Text style={styles.label}>Price (VND) *</Text>
                            <TextInput
                                style={styles.input}
                                value={formData.price}
                                onChangeText={(text) => setFormData({...formData, price: text})}
                                placeholder="Enter price"
                                keyboardType="numeric"
                            />

                            <Text style={styles.label}>Description</Text>
                            <TextInput
                                style={[styles.input, styles.textArea]}
                                value={formData.description}
                                onChangeText={(text) => setFormData({...formData, description: text})}
                                placeholder="Enter description"
                                multiline
                                numberOfLines={4}
                            />

                            <Text style={styles.label}>Image URL</Text>
                            <TextInput
                                style={styles.input}
                                value={formData.imageUrl}
                                onChangeText={(text) => setFormData({...formData, imageUrl: text})}
                                placeholder="Enter image URL"
                            />

                            <Text style={styles.label}>Category ID</Text>
                            <TextInput
                                style={styles.input}
                                value={formData.categoryId}
                                onChangeText={(text) => setFormData({...formData, categoryId: text})}
                                placeholder="Enter category ID"
                                keyboardType="numeric"
                            />
                        </ScrollView>

                        <View style={styles.modalButtons}>
                            <TouchableOpacity
                                style={[styles.btnModal, styles.btnCancel]}
                                onPress={() => {
                                    setModalVisible(false);
                                    setSelectedBook(null);
                                }}
                            >
                                <Text style={styles.btnCancelText}>Cancel</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[styles.btnModal, styles.btnSave]}
                                onPress={handleSaveBook}
                            >
                                <Text style={styles.btnSaveText}>Save</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#f5f5f5' },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingTop: 50,
        paddingBottom: 15,
        paddingHorizontal: 15,
        backgroundColor: '#1976d2',
        elevation: 4
    },
    backText: { color: 'white', fontSize: 16 },
    headerTitle: { color: 'white', fontSize: 18, fontWeight: 'bold' },
    addText: { color: 'white', fontSize: 18, fontWeight: 'bold' },
    bookCard: {
        flexDirection: 'row',
        backgroundColor: 'white',
        padding: 10,
        borderRadius: 10,
        marginBottom: 10,
        elevation: 2
    },
    bookImage: { width: 60, height: 80, borderRadius: 5, marginRight: 10 },
    bookInfo: { flex: 1 },
    bookTitle: { fontSize: 14, fontWeight: 'bold', marginBottom: 5 },
    bookPrice: { color: '#d32f2f', fontWeight: 'bold', marginBottom: 3 },
    bookStock: { fontSize: 12, color: '#666' },
    actions: { justifyContent: 'center' },
    btnEdit: { padding: 8 },
    btnEditText: { fontSize: 20 },
    btnDelete: { padding: 8 },
    btnDeleteText: { fontSize: 20 },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.5)'
    },
    modalContent: {
        width: '90%',
        maxHeight: '80%',
        backgroundColor: 'white',
        padding: 20,
        borderRadius: 10
    },
    modalTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 15, textAlign: 'center' },
    formScroll: { maxHeight: 400 },
    label: { fontSize: 14, fontWeight: 'bold', marginTop: 10, marginBottom: 5, color: '#333' },
    input: {
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 5,
        padding: 10,
        fontSize: 14,
        backgroundColor: '#f9f9f9'
    },
    textArea: { height: 80, textAlignVertical: 'top' },
    modalButtons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 20
    },
    btnModal: {
        flex: 1,
        padding: 12,
        borderRadius: 5,
        alignItems: 'center',
        marginHorizontal: 5
    },
    btnCancel: { backgroundColor: '#f5f5f5', borderWidth: 1, borderColor: '#ddd' },
    btnCancelText: { color: '#666', fontWeight: 'bold' },
    btnSave: { backgroundColor: '#1976d2' },
    btnSaveText: { color: 'white', fontWeight: 'bold' }
});

export default ManageBooksScreen;
