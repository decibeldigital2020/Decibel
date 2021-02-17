import React from 'react';
import { 
    Button,
    Dimensions,
    FlatList,  
    Image, 
    Modal,
    ScrollView,
    StyleSheet, 
    Text,
    TouchableOpacity, 
    TouchableHighlight,
    View
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { connect } from 'react-redux';
import { HERO_IMAGE_RATIO, ORIENTATIONS, RESOURCE_TYPE } from '../constants';
import { styleConstants } from '../constants/styles';
import {
    getIssuePageNumberFromFilename,
    getPreviewPageNumberFromFilename
} from '../util/issueRetrievalUtil';

const window = Dimensions.get("window");
const MAX_ZOOM_FACTOR = 1.5;
const SCROLL_WAIT_DURATION = 300;

const ImageListViewer = ({ filenames, goBack, orientation, resourceType }) => {

    const [aspectInverse, setAspectInverse] = React.useState(false);
    const [menuOpen, setMenuOpen] = React.useState(false);
    const [selectedPage, setSelectedPage] = React.useState(0);
    const [flatListRef, setFlatListRef] = React.useState();

    const detectAndSetOrientation = () => {
        if ((orientation === ORIENTATIONS.PORTRAIT && window.height < window.width) 
            || (orientation === ORIENTATIONS.LANDSCAPE && window.width < window.height)) {
            setAspectInverse(true);
        } else {
            setAspectInverse(false);
        }
    }

    React.useEffect(() => {
        detectAndSetOrientation();
    });

    React.useEffect(() => {
        detectAndSetOrientation();
    }, [orientation]);

    let imageViewStyle, height, width;

    if (aspectInverse) {
        width = window.height;
        height = window.width;
    } else {
        width = window.width;
        height = window.height;
    }

    let portraitHeightRatio = Math.floor(HERO_IMAGE_RATIO*width);
    let landscapeWidthRatio = Math.floor(height/HERO_IMAGE_RATIO);
    
    if (orientation === ORIENTATIONS.PORTRAIT) {
        height = portraitHeightRatio;
        imageViewStyle = {
            flex: 1,
            width: width,
            height: height
        };
    } else {
        width = landscapeWidthRatio;
        imageViewStyle = {
            flex: 1,
            width: width,
            height: height
        };
    }

    return <View style={styles.container}>       
        <FlatList
            data={filenames}
            horizontal
            keyExtractor={item => item}
            initialNumToRender={15}
            maximumZoomScale={1}
            minimumZoomScale={1}
            onScrollToIndexFailed={info => {
                // console.log(info.averageItemLength, info);
                flatListRef.scrollToOffset && flatListRef.scrollToOffset({ offset: info.averageItemLength * info.index, animated: true });
                const wait = new Promise(resolve => setTimeout(resolve, SCROLL_WAIT_DURATION));
                wait.then(() => {
                    // console.log(flatListRef.scrollToIndex);
                    flatListRef.scrollToIndex && flatListRef.scrollToIndex({ index: selectedPage, animated: true });
                }).catch(err => {
                    console.log(err)
                });
            }}
            ref={(ref) => { setFlatListRef(ref); }}
            style={styles.flatList}
            windowSize={21}
            renderItem={({item}) => 
                <TouchableOpacity 
                    style={imageViewStyle} 
                    activeOpacity={1} 
                    onPress={() => setMenuOpen(!menuOpen)}>
                    <Image 
                        height={height}
                        width={width}
                        source={{ uri: item }}
                        style={imageViewStyle}
                    />
                </TouchableOpacity>
            }
        />
        <Modal
            animationType="fade"
            transparent={true}
            visible={menuOpen}
            onRequestClose={() => {}}
            supportedOrientations={
                [
                    'portrait',
                    'portrait-upside-down',
                    'landscape',
                    'landscape-left',
                    'landscape-right'
                ]
            }>
            <TouchableOpacity 
                activeOpacity={1} 
                onPress={() => {setMenuOpen(false)}}
                style={orientation === ORIENTATIONS.LANDSCAPE ? styles.modalLandscape : styles.modal}>
                <TouchableHighlight style={styles.pickerView}>
                    <Picker
                        selectedValue={selectedPage}
                        style={styles.pagePicker}
                        itemStyle={styles.pagePickerItem}
                        onValueChange={(itemValue, itemIndex) => {setSelectedPage(itemValue)}}>
                        { filenames
                            .map(filename => resourceType === RESOURCE_TYPE.PREVIEW_IMG ? getPreviewPageNumberFromFilename(filename) : getIssuePageNumberFromFilename(filename))
                            .map(page => (
                                <Picker.Item label={"Page " + (page+1)} value={page} key={"PagePicker" + page} />
                            ))
                        }
                    </Picker>
                </TouchableHighlight>
                <View style={styles.modalButtonGroup}>
                    <View style={styles.actionButton}>
                        <Button
                            color={styleConstants.button.color}
                            title={"Go To Selected Page"}
                            onPress={() => {
                                flatListRef && flatListRef.scrollToIndex({animated: true, index: "" + selectedPage});
                                setMenuOpen(false);
                            }} 
                        />
                    </View>
                    <View style={styles.actionButton}>
                        <Button
                            color={styleConstants.button.color}
                            title={"Close This Menu"}
                            onPress={() => {
                                setMenuOpen(false);
                            }} 
                        />
                    </View>
                    <View style={styles.actionButton}>
                        <Button
                            color={styleConstants.button.color}
                            title={"Back To Issue List"}
                            onPress={() => {
                                goBack && goBack();
                            }} 
                        />
                    </View>
                </View>
            </TouchableOpacity>
        </Modal>
    </View>
}

const styles = StyleSheet.create({
    actionButton: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'center',
        backgroundColor: "#000",
        borderRadius: 15,
        padding: 2,
        maxHeight: 60,
        marginBottom: 5,
        marginRight: 5
    },
    activatedButton: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'center',
        backgroundColor: "#333",
        borderRadius: 15,
        padding: 2,
        maxHeight: 60,
        marginBottom: 5,
        marginRight: 5
    },
    container: {
        flex: 1,
        overflow: 'visible'
    },
    flatList: {
        flexGrow: 0,
        overflow: 'visible',
        marginTop: 'auto',
        marginBottom: 'auto'
    },
    image: {
        flex: 1,
        resizeMode: 'cover',
        backgroundColor: "#111"
    },
    menuTouchOpener: {

    },
    modal: {
        flex: 1,
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        marginTop: 60,
        backgroundColor: 'rgba(52, 52, 52, 0.8)'
    },
    modalLandscape: {
        flex: 1,
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        marginTop: 60,
        backgroundColor: 'rgba(52, 52, 52, 0.8)'
    },
    modalText: {
        flex: 1,
        fontWeight: "500",
        fontSize: 20,
        color: "#FFF",
        flexDirection: "column",
        justifyContent: "center",
        maxHeight: 100,
        width: "90%"
    },
    modalButtonGroup: {
        flex: 1,
        flexDirection: "column",
        justifyContent: "space-around",
        maxHeight: 300,
        width: "90%"
    },
    pickerView: {
        flex: 1,
        maxHeight: 200,
        width: "90%",
        borderRadius: 15,
        marginBottom: 20,
        marginRight: 5
    },
    pagePicker: {
        borderRadius: 15
    },
    pagePickerItem: {
        backgroundColor: "#000",
        color: "#DDD",
        tintColor: "#DDD",
        borderRadius: 15
    }
});

const mapStateToProps = state => ({
    orientation: state.orientation
});

const mapDispatchToProps = dispatch => ({

});

export default connect(mapStateToProps, mapDispatchToProps)(ImageListViewer);