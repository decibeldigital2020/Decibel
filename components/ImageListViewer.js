import React from 'react';
import { Dimensions, Image, View, FlatList, StyleSheet } from 'react-native';
import { connect } from 'react-redux';
import { ORIENTATIONS } from '../constants';

const window = Dimensions.get("window");

const ImageListViewer = ({ filenames, orientation }) => {

    const [aspectInverse, setAspectInverse] = React.useState(false);

    React.useEffect(() => {
        if ((orientation === ORIENTATIONS.PORTRAIT && window.height < window.width) 
            || (orientation === ORIENTATIONS.LANDSCAPE && window.width < window.height)) {
            setAspectInverse(true);
        } else {
            setAspectInverse(false);
        }
    });

    React.useEffect(() => {
        if ((orientation === ORIENTATIONS.PORTRAIT && window.height < window.width) 
            || (orientation === ORIENTATIONS.LANDSCAPE && window.width < window.height)) {
            setAspectInverse(true);
        } else {
            setAspectInverse(false);
        }
    }, [orientation]);

    console.log(orientation, window.width, window.height, aspectInverse);

    console.log(filenames);

    const imageViewStyles = !aspectInverse
        ? {
            width: window.width,
            height: window.height,
            backgroundColor: "#00F"
        }
        : {
            height: window.width,
            width: window.height,
            backgroundColor: "#00F"
        }

    return <View style={styles.container}>
        <FlatList
            data={filenames}
            horizontal
            keyExtractor={item => item}
            renderItem={({item}) => 
                <View style={imageViewStyles}>
                    <Image 
                        source={{ uri: item }}
                        style={styles.image}
                    />
                </View>
            }
            style={styles.flatList}
        />
    </View>
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: "column",
        justifyContent: "center",
        backgroundColor: "#000"
    },
    flatList: {
        backgroundColor: "#222",
        flex: 1
    },
    image: {
        flex: 1,
        resizeMode: 'contain',
        backgroundColor: "#000"
    }
});

const mapStateToProps = state => ({
    orientation: state.orientation
});

const mapDispatchToProps = dispatch => ({

});

export default connect(mapStateToProps, mapDispatchToProps)(ImageListViewer);