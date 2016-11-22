
const palette = {
  lightBlue: '#48BBEC',
  grey: '#787F82',
  white: 'white',
};

export const uiblocks = {
  textInput: {
    fontSize: 18,
    height: 36,
    padding: 4,
    marginRight: 5,
    marginBottom: 20,
    borderWidth: 1,
    borderRadius: 8,
    borderColor: palette.lightBlue,
    color: palette.lightBlue,
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
    text: {
      fontSize: 18,
      color: palette.white,
    },
  }
};
