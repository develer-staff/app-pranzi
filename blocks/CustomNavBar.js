import React, { Component, PropTypes } from 'react';
import {
  View,
  StyleSheet,
  Image,
} from 'react-native';
import NavBar, { NavGroup, NavButton, NavButtonText, NavTitle } from 'react-native-nav';

import { uiblocks } from '../globstyle';

export default class CustomNavBar extends Component {

  renderButton() {
    const { actionText, actionIcon } = this.props;

    if (actionText) {
      return (
        <NavButtonText>
          { actionText }
        </NavButtonText>
      );
    } else if (actionIcon) {
      return (<Image source={actionIcon} style={styles.settingsBtn}/>);
    }
  }

  render() {
    const button = this.renderButton();

    const { text, action } = this.props;

    return (
      <NavBar>
        <NavTitle>
          { text }
        </NavTitle>
        <NavGroup>
          <NavButton onPress={ action }>
            { button }
          </NavButton>
        </NavGroup>
      </NavBar>
    );
  }
}

CustomNavBar.propTypes = {
  text: PropTypes.string.isRequired,
  action: PropTypes.func,
  actionText: PropTypes.string,
  actionIcon: PropTypes.number,
};

const { button } = uiblocks.navbar.settings;

const styles = StyleSheet.create({
  settingsBtn: {
    ...button
  },
});
