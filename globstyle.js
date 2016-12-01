
const palette = {
  lightBlue: '#48BBEC',
  darkBlue: '#225C75',
  navBarGrey: '#f2f2f2',
  lightGrey: '#787F82',
  grey: '#656565',
  white: 'white',
};

const fonts = {
  normalFont: {
    fontSize: 18,
  },
  boldFont: {
    fontWeight: 'bold',
    fontSize: 18,
  },
  bigFont: {
    fontSize: 20,
    fontWeight: 'bold',
  },
};

const commonPages = {
  padding: 30,
  marginTop: 60,
};

export const pages = {
  insertLunch: {
    ...commonPages
  },
  insertUsername: {
    ...commonPages
  },
  selectNotificationDays: {
    ...commonPages
  },
  settings: {
    ...commonPages
  },
  menuHeading: {
    marginTop: 100,
    borderBottomWidth: 2,
    width: 180,
    paddingBottom: 20,
    marginBottom: 20,
  },
  navBar: {
    padding: 5,
    borderBottomWidth: 1,
    height: 50,
    borderBottomColor: palette.lightGrey,
    backgroundColor: palette.navBarGrey,
  },
  navBarBtn: {
    margin: 8,
  },
  navBarNoBtn: {
    margin: 10,
  },
  navBarText: {
    margin: 5,
    ...fonts.bigFont
  },
};

export const uiblocks = {
  activityIndicator: {
    marginTop: 20,
  },
  text: {
    marginBottom: 20,
    marginTop: 20,
    fontSize: fonts.normalFont.fontSize,
    color: palette.grey,
  },
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
      borderColor: palette.lightGrey,
      backgroundColor: palette.lightGrey,
    },
    pressed: {
      borderColor: palette.darkBlue,
      backgroundColor: palette.darkBlue,
    },
    checkMark: {
      color: palette.white,
      marginRight: 10,
      ...fonts.boldFont
    },
    text: {
      color: palette.white,
      ...fonts.normalFont
    },
  },
  navbar: {
    settings: {
      button: {
        height: 20,
        width: 20,
      },
    },
  },
};

export const images = {
  settings: {
    icon: require('./imgs/wheel.png'),
  },
  drawer: {
    icon: require('./imgs/ic_drawer.png'),
  },
};
