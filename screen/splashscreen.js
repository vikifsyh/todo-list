import React, {Component} from 'react';
import {View, Image, StatusBar} from 'react-native';
import {StackActions} from '@react-navigation/native';

class splashscreen extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    setTimeout(() => {
      this.props.navigation.dispatch(StackActions.replace('home'));
    }, 2000);
  }
  render() {
    return (
      <View style={{flex: 1}}>
        <StatusBar
          translucent
          backgroundColor={'transparent'}
          barStyle={'dark-content'}
        />
        <View
          style={{
            flex: 1,
            backgroundColor: '#1e1e1e',
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <Image source={require('../image/splash.png')} />
        </View>
      </View>
    );
  }
}

export default splashscreen;
