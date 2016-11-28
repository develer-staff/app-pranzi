import React, { Component, PropTypes } from 'react';
import {
  View,
} from 'react-native';
import NavBar, { NavGroup, NavButton, NavButtonText, NavTitle } from 'react-native-nav';

export default class CustomNavBar extends Component {
  renderButton() {
    if (this.props.actionText) {
      return (
        <NavButtonText>
          { this.props.actionText }
        </NavButtonText>
      );
    } else if (this.props.actionIcon) {
      return this.props.actionIcon;
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
