import React, { Component, PropTypes } from 'react';
import {
  View,
} from 'react-native';
import NavBar, { NavGroup, NavButton, NavButtonText, NavTitle } from 'react-native-nav';

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

    return (
      <NavBar>
        <NavTitle>
          { this.props.text }
        </NavTitle>
        <NavGroup>
          <NavButton onPress={ this.props.action }>
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
  actionIcon: PropTypes.element,
};
