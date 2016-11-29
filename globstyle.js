
const palette = {
  lightBlue: '#48BBEC',
  darkBlue: '#225C75',
  grey: '#787F82',
  white: 'white',
};

const fonts = {
  normalFont: {
    fontSize: 18,
  }
};

export const uiblocks = {
  textInput: {
    height: 36,
    padding: 4,
    marginRight: 5,
    marginBottom: 20,
    borderWidth: 1,
    borderRadius: 8,
    borderColor: palette.lightBlue,
    color: palette.lightBlue,
    ...fonts.normalFont
  },
  button: {
    enabled: {
      height: 36,
      marginBottom: 10,
      borderWidth: 1,
      borderRadius: 8,
      borderColor: palette.lightBlue,
      backgroundColor: palette.lightBlue,
    },
    disabled: {
      borderColor: palette.grey,
      backgroundColor: palette.grey,
    },
    pressed: {
      borderColor: palette.darkBlue,
      backgroundColor: palette.darkBlue,
    },
    text: {
      color: palette.white,
      ...fonts.normalFont
    },
  }
};

export const images = {
  settings: {
    icon: require('./imgs/wheel.png'),
  }
};