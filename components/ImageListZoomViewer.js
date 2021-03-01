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
    getIssueFilenames,
    getIssuePreviewFilenames,
    getIssuePageNumberFromFilename,
    getPreviewPageNumberFromFilename
} from '../util/issueRetrievalUtil';
import ImageListZoomViewerStyles from '../styles/ImageListZoomViewer';
import ImageZoom from 'react-native-image-pan-zoom';

const window = Dimensions.get("window");
const MAX_ZOOM_FACTOR = 1.5;
const SCROLL_WAIT_DURATION = 300;
const SAFE_AREA_LANDSCAPE_VERTICAL_PADDING = 30;

const ImageListZoomViewer = ({ fileCacheMap, navigation, orientation, resourceName, resourceType }) => {

    const [aspectInverse, setAspectInverse] = React.useState(false);
    const [menuOpen, setMenuOpen] = React.useState(false);
    const [selectedPage, setSelectedPage] = React.useState(0);
    const [flatListRef, setFlatListRef] = React.useState();
    const [filenames, setFilenames] = React.useState();

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

    React.useEffect(() => {
        if (resourceType === RESOURCE_TYPE.PREVIEW_IMG) {
            setFilenames(getIssuePreviewFilenames(resourceName, fileCacheMap));
        } else {
            setFilenames(getIssueFilenames(resourceName, fileCacheMap));
        }
    }, [resourceName, resourceType, fileCacheMap]);

    let imageViewStyle, height, width, screenHeight, screenWidth;

    if (aspectInverse) {
        width = screenWidth = window.height;
        height = screenHeight = window.width;
    } else {
        width = screenWidth = window.width;
        height = screenHeight = window.height;
    }

    if (orientation === ORIENTATIONS.PORTRAIT) {
        height = Math.floor(HERO_IMAGE_RATIO*width);
        imageViewStyle = {
            flex: 1,
            width: width,
            height: height
        };
    } else {
        height = height - SAFE_AREA_LANDSCAPE_VERTICAL_PADDING;
        width = Math.floor(height/HERO_IMAGE_RATIO);
        imageViewStyle = {
            flex: 1,
            width: width,
            height: height
        };
    }

    if (!filenames) {
        return null;
    }

    const goBack = () => {
        navigation && navigation.navigate && navigation.navigate('RootTabNavigator');
    }

    const imageZoomWidth = screenWidth;
    const imageZoomHeight = screenHeight;

    return <View style={styles.container}>
        <ImageZoom
                        cropWidth={imageZoomWidth}
                        cropHeight={imageZoomHeight}
                        imageWidth={imageZoomWidth}
                        imageHeight={imageZoomHeight}
                        onLongPress={() => setMenuOpen(!menuOpen)}
                        style={styles.imageZoom}
                        >
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
                    onLongPress={() => setMenuOpen(!menuOpen)}>
                    <Image 
                        height={height}
                        width={width}
                        source={{ uri: item }}
                        style={imageViewStyle}
                    />
                </TouchableOpacity>
            }
        />
        </ImageZoom>
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
                                goBack();
                            }} 
                        />
                    </View>
                </View>
            </TouchableOpacity>
        </Modal>
    </View>
}

const styles = StyleSheet.create(ImageListZoomViewerStyles);

const mapStateToProps = state => ({
    fileCacheMap: state.fileCacheMap,
    orientation: state.orientation
});

const mapDispatchToProps = dispatch => ({

});

export default connect(mapStateToProps, mapDispatchToProps)(ImageListZoomViewer);