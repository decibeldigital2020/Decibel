import React from 'react';
import { TouchableOpacity, FlatList, StyleSheet } from 'react-native';

const ImageListViewer = ({filenames}) => {
    return <TouchableOpacity style={styles.container}>
        <FlatList
            data={filenames}
            horizontal
            keyExtractor={item => item}
            renderItem={({item}) => {
                return <Image 
                    source={{ uri: item }}
                    style={styles.image}
                />
            }}
        />
    </TouchableOpacity>
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: "column",
        justifyContent: "center",
        backgroundColor: "#000"
    },
    image: {
        height: "100%"
    }
})

export default ImageListViewer;