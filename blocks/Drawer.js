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

  static wrapView(view, text, openSettings, navigator) {
    if (Platform.OS !== 'android') {
      return view;
    }

    let drawer = null;
    let menu = null;
    let lockmode = 'locked-closed';

    let menuBtn = null;

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

      lockmode = 'unlocked';
    }else{
      menuBtn = (
        <TouchableOpacity style={ styles.button }
          onPress={ () => navigator.pop() }>
          <Image source={images.back.icon} style={styles.settingsBtn}/>
        </TouchableOpacity>
      );
    }

    const finalView = (
      <DrawerLayoutAndroid
        style={{flex: 1}}
        drawerWidth={200}
        drawerPosition={DrawerLayoutAndroid.positions.Left}
        renderNavigationView={() => menu}
        drawerLockMode={ lockmode }
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

const { button, itemBtn } = uiblocks.navbar.settings;
const { menuHeading, navBar, navBarBtn, navBarNoBtn, navBarText } = pages;

const styles = StyleSheet.create({
  menuContainer: {
    flex: 1,
  },
  menuRow: {
    flexDirection: 'row',
  },
  menuHeading: {
    paddingLeft: 16,
    ...menuHeading
  },
  menuHeadingText: {
  },
  menuIcons: {
    marginLeft: 16,
    marginTop: 4,
    ...itemBtn
  },
  menuText: {
    marginBottom: 5,
    marginLeft: 16,
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

