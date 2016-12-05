import React from 'react';
import {
  View,
  StyleSheet,
  Image,
  Text,
  Platform,
  DrawerLayoutAndroid,
  TouchableOpacity,
} from 'react-native';

import { uiblocks, images, pages } from '../globstyle';

export default class Drawer {

  static wrapView(view, text, openSettings) {
    if (Platform.OS !== 'android') {
      return view;
    }

    let drawer = null;
    let menu = null;

    let menuBtn = (<View style={styles.noBtn} />);
    let drawerLock = 'locked-closed';
    if (openSettings) {
      menu = (
        <View style={styles.menuContainer}>
          <View style={styles.menuHeading}>
            <Text style={styles.menuHeadingText}>App Pranzi</Text>
          </View>
          <TouchableOpacity style={ styles.menuRow }
            onPress={() => { openSettings(); drawer.closeDrawer(); }}>
            <Image source={ images.settings.icon } style={ styles.menuIcons }/>
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
      drawerLock = 'unlocked';
    }

    const finalView = (
      <DrawerLayoutAndroid
        style={{flex: 1}}
        drawerWidth={250}
        drawerPosition={DrawerLayoutAndroid.positions.Left}
        renderNavigationView={() => menu}
        drawerLockMode={ drawerLock }
        ref={(draw) => { drawer = draw; }}>
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
const { menuHeading, navBar, navBarBtn, navBarNoBtn, navBarText } = pages;

const styles = StyleSheet.create({
  menuContainer: {
    flex: 1,
    alignItems: 'center',
  },
  menuRow: {
    flexDirection: 'row',
  },
  menuHeading: {
    ...menuHeading
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
    flexDirection: 'row',
    ...navBar
  },
  button: {
    ...navBarBtn
  },
  noBtn: {
    ...navBarNoBtn
  },
  text: {
    ...navBarText
  },
  settingsBtn: {
    ...button
  },
});

