import React from 'react';
import { connect } from 'react-redux';

const OrientationListener = ({ orientation, setOrientation }) => {
    React.useEffect(() => {
        setOrientation(orientation);
    }, [orientation]);
    return null;
}

const mapStateToProps = state => ({});

const mapDispatchToProps = dispatch => ({
    setOrientation: orientation => dispatch({ type: "ORIENTATION", payload: { orientation } })
});

export default connect(mapStateToProps, mapDispatchToProps)(OrientationListener);