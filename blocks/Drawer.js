import React, { Component, PropTypes } from 'react';
import {
  View,
  StyleSheet,
  Image,
  Text,
  Platform,
  DrawerLayoutAndroid,
  TouchableOpacity,
} from 'react-native';


import { uiblocks, images } from '../globstyle';

export default class Drawer {

  static wrapView(view, text, openSettings) {
    if (Platform.OS !== 'android') {
      return view;
    }

    let drawer = null;
    let menu = null;

    let menuBtn = (<View style={styles.noBtn} />);
    if ( openSettings ) {
      menu = (
        <View style={styles.menuContainer}>
          <View style={styles.menuHeading}>
            <Text style={styles.menuHeadingText}>ss</Text>
          </View>
          <TouchableOpacity style={ styles.menuRow }
            onPress={() => {openSettings(); drawer.closeDrawer() } }>
            <Image source={images.settings.icon} style={styles.menuIcons}/>
            <Text style={styles.menuText}>Settings</Text>
          </TouchableOpacity>
        </View>
      );
      menuBtn = (
        <TouchableOpacity style={ styles.button }
          onPress={ () => drawer.openDrawer() }>
          <Image source={images.drawer.icon} style={styles.settingsBtn}/>
        </TouchableOpacity>
      );
    }

    const finalView = (
      <DrawerLayoutAndroid
        style={{flex: 1}}
        drawerWidth={200}
        drawerPosition={DrawerLayoutAndroid.positions.Left}
        renderNavigationView={() => menu}
        drawerLockMode={'locked-closed'}
        ref={(draw) => {drawer = draw}}>
        <View style={ styles.navbar }>
          { menuBtn }
          <Text style={styles.text}>{ text }</Text>
        </View>
        {view}
      </DrawerLayoutAndroid>
    );

    return finalView;
  }
  
}

const { button } = uiblocks.navbar.settings;

const styles = StyleSheet.create({
  menuContainer:{
    flex: 1,
    alignItems: 'center',
  },
  menuRow: {
    flexDirection: 'row',
  },
  menuHeading:{
    marginTop: 100,
    borderBottomWidth: 2,
    width: 180,
    paddingBottom: 20,
    marginBottom: 20,
  },
  menuHeadingText: {
    textAlign: 'center',
  },
  menuIcons: {
    margin: 5,
    ...button
  },
  menuText: {
    margin: 5,
  },
  navbar: {
    padding: 5,
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#787F82',
    height: 50,
    backgroundColor: '#f2f2f2',
  },
  button: {
    margin: 8,
  },
  noBtn: {
    margin: 10,
  },
  text: {
    margin: 5,
    fontSize: 20,
    fontWeight: 'bold',
  },
  settingsBtn: {
    ...button
  },
});

