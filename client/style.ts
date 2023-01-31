import { Platform, StyleSheet } from 'react-native';

export const Color = (darkMode: boolean) => {
  return !darkMode ? LightColor() : DarkColor();
}
export const Style = (darkMode: boolean) => {
  return !darkMode ? LightStyle : DarkStyle;
}
export const LoginStyle = (darkMode: boolean) => {
  return !darkMode ? LightLoginStyle : DarkLoginStyle;
}

export const FontSize = {
  tiny:12,
  small:14,
  default:16,
  large:20,
  huge:25
}

export const Radius = {
  small:4,
  default:10,
  large:20,
  round:9999
}

export const Content = {
  width:1000,
  mobileWidth: 1000
}

// Start Light Theme
export const LightStyle = StyleSheet.create({
  errorText: {
    textAlign: 'center',
    width: '100%'
  },
  errorMsgMobile: {
    paddingBottom: 10,
  },
  errorMsg: {
    paddingBottom: 20,
  },
  boldFont: {
    fontFamily: 'Inter-Bold',
  },
  dropdownDefault: {
    fontSize: FontSize.default,
    color: Color(false).text,
    fontFamily: 'Inter-Regular',
    backgroundColor: Color(false).white,
    borderColor: Color(false).border,
    borderRadius: Radius.default,
    borderWidth: 1,
    height: 40,
    paddingLeft: 10,
    paddingRight: 25,
    paddingTop: 5,
    paddingBottom: 5,
    outlineStyle: 'none'
  },
  inputDefault: {
    fontSize: FontSize.default,
    color: Color(false).text,
    fontFamily: 'Inter-Regular',
    backgroundColor: Color(false).white,
    borderColor: Color(false).border,
    borderRadius: Radius.default,
    borderWidth: 1,
    height: 35,
    paddingLeft: 10,
    paddingRight: 10,
    paddingTop: 5,
    paddingBottom: 5,
    outlineStyle: 'none'
  },
  textHuge: {
    fontSize: FontSize.huge,
    color: Color(false).text,
    fontFamily: 'Inter-Regular'
  },
  textLarge: {
    fontSize: FontSize.large,
    color: Color(false).text,
    fontFamily: 'Inter-Regular'
  },
  textDefault: {
    fontSize: FontSize.default,
    color: Color(false).text,
    fontFamily: 'Inter-Regular'
  },
  textSmall: {
    fontSize: FontSize.small,
    color: Color(false).text,
    fontFamily: 'Inter-Regular'
  },
  textTiny: {
    fontSize: FontSize.tiny,
    color: Color(false).text,
    fontFamily: 'Inter-Regular'
  },
  textTinyTertiary: {
    fontSize: FontSize.tiny,
    color: Color(false).textTertiary,
    fontFamily: 'Inter-Regular'
  },
  textSmallDefault: {
    fontSize: FontSize.small,
    color: Color(false).default,
    fontFamily: 'Inter-Regular'
  },
  textDefaultDefault: {
    fontSize: FontSize.default,
    color: Color(false).default,
    fontFamily: 'Inter-Regular'
  },
  textDefaultTertiary: {
    fontSize: FontSize.default,
    color: Color(false).textTertiary,
    fontFamily: 'Inter-Regular'
  },
  textDefaultSecondary: {
    fontSize: FontSize.default,
    color: Color(false).textSecondary,
    fontFamily: 'Inter-Regular'
  },
  textSmallDanger: {
    fontSize: FontSize.small,
    color: Color(false).danger,
    fontFamily: 'Inter-Regular'
  },
  textDanger: {
    fontSize: FontSize.default,
    color: Color(false).danger,
    fontFamily: 'Inter-Regular'
  },
  textSmallSecondary: {
    fontSize: FontSize.small,
    color: Color(false).text,
    fontFamily: 'Inter-Regular'
  },
  textSecondary: {
    fontSize: FontSize.default,
    color: Color(false).text,
    fontFamily: 'Inter-Regular'
  },
  buttonSuccess: {
    backgroundColor: Color(false).success,
    ...Platform.select({
      web: {
        shadowColor: Color(false).successSecondary,
        shadowOffset: {width: -3, height: 3},
        shadowOpacity: 1,
        shadowRadius: 0,
      }
    }),
  },
  buttonGold: {
    backgroundColor: Color(false).gold,
    ...Platform.select({
      web: {
        shadowColor: Color(false).goldSecondary,
        shadowOffset: {width: -3, height: 3},
        shadowOpacity: 1,
        shadowRadius: 0,
      }
    }),
  },
  buttonDefault: {
    backgroundColor: Color(false).default,
    ...Platform.select({
      web: {
        shadowColor: Color(false).defaultSecondary,
        shadowOffset: {width: -3, height: 3},
        shadowOpacity: 1,
        shadowRadius: 0,
      }
    }),
  },
  buttonNormal: {
    backgroundColor: Color(false).textSecondary,
    ...Platform.select({
      web: {
        shadowColor: Color(false).textTertiary,
        shadowOffset: {width: -3, height: 3},
        shadowOpacity: 1,
        shadowRadius: 0,
      }
    }),
  },
  buttonDefaultInverted: {
    backgroundColor: Color(false).none,
    borderColor: Color(false).default,
    borderWidth: 1,
  },
  buttonDefaultInvertedText: {
    color: Color(false).default,
    fontSize: FontSize.small,
    fontFamily: 'Inter-SemiBold'
  },
  buttonGoldInverted: {
    backgroundColor: Color(false).none,
    borderColor: Color(false).gold,
    borderWidth: 1,
  },
  buttonGoldInvertedText: {
    color: Color(false).gold,
    fontSize: FontSize.small,
    fontFamily: 'Inter-SemiBold'
  },
  buttonInverted: {
    backgroundColor: Color(false).none,
    borderColor: Color(false).textTertiary,
    borderWidth: 1,
  },
  buttonInvertedText: {
    color: Color(false).textTertiary,
    fontSize: FontSize.small,
    fontFamily: 'Inter-SemiBold'
  },
  buttonDisabled: {
    backgroundColor: Color(false).disabledButton,
    ...Platform.select({
      web: {
        shadowColor: Color(false).disabledButtonSecondary,
        shadowOffset: {width: -3, height: 3},
        shadowOpacity: 1,
        shadowRadius: 0,
      }
    }),
  },
  buttonWarning: {
    backgroundColor: Color(false).warning,
    ...Platform.select({
      web: {
        shadowColor: Color(false).warningSecondary,
        shadowOffset: {width: -3, height: 3},
        shadowOpacity: 1,
        shadowRadius: 0,
      }
    }),
  },
  buttonDanger: {
    backgroundColor: Color(false).danger,
    ...Platform.select({
      web: {
        shadowColor: Color(false).dangerSecondary,
        shadowOffset: {width: -3, height: 3},
        shadowOpacity: 1,
        shadowRadius: 0,
      }
    }),
  },
  button: {
    paddingLeft: 20,
    paddingRight: 20,
    paddingTop: 8,
    paddingBottom: 8,
    borderRadius: Radius.default,
    marginLeft:3,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
  },
  labelDefault: {
    fontSize: FontSize.default,
    color: Color(false).text,
    fontFamily: 'Inter-Regular',
    marginBottom: 5
  },
  alignRight: {
    marginRight: 0,
    marginLeft: 'auto'
  },
  alignCenter: {
    margin: 'auto'
  },
  checkboxContainer: {
    display: 'flex',
    flexDirection: 'row',
    gap: 5,
    alignItems: 'center'
  },
  checkbox: {
    borderColor: Color(false).border,
    borderWidth: 1,
    height: 18,
    width: 18,
    borderRadius: Radius.small,
    position: 'relative',
    backgroundColor: Color(false).white
  },
  checkboxMark: {
    borderRightWidth: 3,
    borderBottomWidth: 3,
    borderRightColor: Color(false).white,
    borderBottomColor: Color(false).white,
    transform: [{rotate: '45deg'}],
    height: 14,
    width: 7,
    position: 'absolute',
    top: 0,
    left: 5,
  },
  checkboxMarkContainer: {
    position: 'absolute',
    top: -1,
    left: -1,
    backgroundColor: Color(false).default,
    width: 18,
    height: 18,
    borderRadius: Radius.small
  },
  checkboxLabel: {
    fontFamily: 'Inter-Regular',
    fontSize: FontSize.default,
    color: Color(false).text,
    marginLeft: 5,
    ...Platform.select({
      web: {
        marginLeft: 0
      }
    }),
  },
  verticalGroup: {
    marginTop: 10
  },
  horizontalGroup: {
      marginRight: 10
  },
  maskLoading: {
    margin: 'auto',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%'

  },
  maskPrompt: {
      height: '100%',
      width: '100%',
      backgroundColor: Color(false).promptMask,
      position: 'absolute',
      borderRadius: Radius.large,
      top: 0,
      left: 0
  },
  maskPromptMobile: {
    height: '100%',
    width: '100%',
    backgroundColor: Color(false).promptMaskMobile,
    position: 'absolute',
    borderRadius: Radius.large,
    top: 0,
    left: 0
  },
});

export const LightLoginStyle = StyleSheet.create({
  logo: {
    marginLeft: 'auto',
    marginRight: 'auto',
    marginBottom: 40,
  },
  errorMessage: {
    textAlign: 'center',
    fontSize: FontSize.small,
    color: Color(false).danger,
    fontFamily: 'Inter-Regular',
    maxHeight: 150,
    overflowY: 'auto',
    margin: 'auto',
    width: '100%',
    marginTop: 40
  },
  previousPageText: {
    display: 'flex',
    flexDirection: 'row',
    marginBottom: 0,
    marginTop: 'auto',
    justifyContent: 'center',
    alignItems: 'center',
  },
  previousPageAction: {
    marginLeft: 5
  },
  actionText: {
    marginTop: 5,
    marginBottom: 40
  },
  submitButton: {
    marginBottom: 40
  },
  inputStyle: {
    marginBottom: 15
  },
  rightTextHint: {
    marginTop: 5,
    marginBottom: 40,
    marginRight: 0,
    marginLeft: 'auto'
  },
  resendText: {
    marginBottom: 5,
    marginRight: 0,
    marginLeft: 'auto'
  },
  timerText: {
    marginTop: 5,
    marginBottom: 40,
    marginRight: 0,
    marginLeft: 'auto',
    height: 15
  },
  mainContent: {
    marginTop: 40,
    marginBottom: 'auto'
  },
  sentText: {
    marginBottom: 0,
    marginTop: 0,
    color: Color(false).textTertiary,
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: FontSize.default
  },
  reqItem: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    gap: 5,
    display: 'flex'
  },
});

function LightColor() {
  return {
    actualWhite: '#FFFFFF',
    white:'#FFFFFF',
    black:'#000000',
    blackMask: '#00000075',
    success:'#54BE66',
    successSecondary:'#4BAB5B',
    default:'#418DFC',
    defaultSecondary:'#3A7EE2',
    danger:'#DC0041',
    dangerSecondary:'#C6003A',
    warning:'#dc9500',
    warningSecondary:'#B07700',
    text:'#050505',
    textSecondary:'#65676B',
    textTertiary:'#4B4B4B',
    textDisabled:'#A9ABAE',
    border:'#D2D4D9',
    borderSecondary:'#B3B4B9',
    holder:'#F0F2F5',
    holderSecondary:'#E4E6E9',
    holderTertiary:'#CDCFD1',
    imgBackground:'#E4E6EB',
    icon:'#1D1F23',
    grey: '#CDCFD1',
    transparent: 'transparent',
    none: 'transparent',
    gold: '#edb74d',
    goldSecondary: '#d5a445',
    darkgrey: '#383c3b',
    holderMask: '#F0F2F5BF',
    whiteMask: '#FFFFFFBF',
    textMask: '#505050',
    defaultLight: '#d9e8fe',
    whiteUnderlay: '#FFFFFF30',
    defaultUnderlay: '#66a3fc',
    goldUnderlay: '#f0c570',
    successUnderlay: '#76cb84',
    dangerUnderlay: '#e33266',
    warningUnderlay: '#e3aa32',
    background:'#F0F2F5',
    contentBackground: '#FFFFFF',
    contentBackgroundSecondary: '#FFFFFF',
    shadow: '#000000',
    titleText: '#000000',
    subTitleText: '#65676B',
    separator: '#D2D4D9',
    disabledButton: '#D2D4D9',
    disabledButtonSecondary: '#B3B4B9',
    promptMask: '#FFFFFFBF',
    promptMaskMobile: '#F0F2F5BF',
    contentHolder: '#F0F2F5',
    contentHolderSecondary: '#E4E6E9',
    disabledText: '#4B4B4B',
    disabledTextInput: '#F0F2F5',
    input: '#FFFFFF',
    maskText: '#65676B',
    placeHolderText: '#050505',
    contentDialogBackground: '#F0F2F5',
    contentDialogBackgroundSecondary: '#E4E6E9',
    userIcon: '#D2D4D9',
    statusBar: '#FFFFFF'
  }
}

// End Light Theme

// Start Dark Theme

export const DarkStyle = StyleSheet.create({
  errorText: {
    textAlign: 'center',
    width: '100%'
  },
  errorMsgMobile: {
    paddingBottom: 10,
  },
  errorMsg: {
    paddingBottom: 20,
  },
  boldFont: {
    fontFamily: 'Inter-Bold',
  },
  dropdownDefault: {
    fontSize: FontSize.default,
    color: Color(true).text,
    fontFamily: 'Inter-Regular',
    backgroundColor: Color(true).white,
    borderColor: Color(true).border,
    borderRadius: Radius.default,
    borderWidth: 1,
    height: 40,
    paddingLeft: 10,
    paddingRight: 25,
    paddingTop: 5,
    paddingBottom: 5,
    outlineStyle: 'none'
  },
  inputDefault: {
    fontSize: FontSize.default,
    color: Color(true).text,
    fontFamily: 'Inter-Regular',
    backgroundColor: Color(true).white,
    borderColor: Color(true).border,
    borderRadius: Radius.default,
    borderWidth: 1,
    height: 35,
    paddingLeft: 10,
    paddingRight: 10,
    paddingTop: 5,
    paddingBottom: 5,
    outlineStyle: 'none'
  },
  textHuge: {
    fontSize: FontSize.huge,
    color: Color(true).text,
    fontFamily: 'Inter-Regular'
  },
  textLarge: {
    fontSize: FontSize.large,
    color: Color(true).text,
    fontFamily: 'Inter-Regular'
  },
  textDefault: {
    fontSize: FontSize.default,
    color: Color(true).text,
    fontFamily: 'Inter-Regular'
  },
  textSmall: {
    fontSize: FontSize.small,
    color: Color(true).text,
    fontFamily: 'Inter-Regular'
  },
  textTiny: {
    fontSize: FontSize.tiny,
    color: Color(true).text,
    fontFamily: 'Inter-Regular'
  },
  textTinyTertiary: {
    fontSize: FontSize.tiny,
    color: Color(true).textTertiary,
    fontFamily: 'Inter-Regular'
  },
  textSmallDefault: {
    fontSize: FontSize.small,
    color: Color(true).default,
    fontFamily: 'Inter-Regular'
  },
  textDefaultDefault: {
    fontSize: FontSize.default,
    color: Color(true).default,
    fontFamily: 'Inter-Regular'
  },
  textDefaultTertiary: {
    fontSize: FontSize.default,
    color: Color(true).textTertiary,
    fontFamily: 'Inter-Regular'
  },
  textDefaultSecondary: {
    fontSize: FontSize.default,
    color: Color(true).textSecondary,
    fontFamily: 'Inter-Regular'
  },
  textSmallDanger: {
    fontSize: FontSize.small,
    color: Color(true).danger,
    fontFamily: 'Inter-Regular'
  },
  textDanger: {
    fontSize: FontSize.default,
    color: Color(true).danger,
    fontFamily: 'Inter-Regular'
  },
  textSmallSecondary: {
    fontSize: FontSize.small,
    color: Color(true).text,
    fontFamily: 'Inter-Regular'
  },
  textSecondary: {
    fontSize: FontSize.default,
    color: Color(true).text,
    fontFamily: 'Inter-Regular'
  },
  buttonSuccess: {
    backgroundColor: Color(true).success,
    ...Platform.select({
      web: {
        shadowColor: Color(true).successSecondary,
        shadowOffset: {width: -3, height: 3},
        shadowOpacity: 1,
        shadowRadius: 0,
      }
    }),
  },
  buttonGold: {
    backgroundColor: Color(true).gold,
    ...Platform.select({
      web: {
        shadowColor: Color(true).goldSecondary,
        shadowOffset: {width: -3, height: 3},
        shadowOpacity: 1,
        shadowRadius: 0,
      }
    }),
  },
  buttonDefault: {
    backgroundColor: Color(true).default,
    ...Platform.select({
      web: {
        shadowColor: Color(true).defaultSecondary,
        shadowOffset: {width: -3, height: 3},
        shadowOpacity: 1,
        shadowRadius: 0,
      }
    }),
  },
  buttonNormal: {
    backgroundColor: Color(true).textSecondary,
    ...Platform.select({
      web: {
        shadowColor: Color(true).textTertiary,
        shadowOffset: {width: -3, height: 3},
        shadowOpacity: 1,
        shadowRadius: 0,
      }
    }),
  },
  buttonDefaultInverted: {
    backgroundColor: Color(true).none,
    borderColor: Color(true).default,
    borderWidth: 1,
  },
  buttonDefaultInvertedText: {
    color: Color(true).default,
    fontSize: FontSize.small,
    fontFamily: 'Inter-SemiBold'
  },
  buttonGoldInverted: {
    backgroundColor: Color(true).none,
    borderColor: Color(true).gold,
    borderWidth: 1,
  },
  buttonGoldInvertedText: {
    color: Color(true).gold,
    fontSize: FontSize.small,
    fontFamily: 'Inter-SemiBold'
  },
  buttonInverted: {
    backgroundColor: Color(true).none,
    borderColor: Color(true).textTertiary,
    borderWidth: 1,
  },
  buttonInvertedText: {
    color: Color(true).textTertiary,
    fontSize: FontSize.small,
    fontFamily: 'Inter-SemiBold'
  },
  buttonDisabled: {
    backgroundColor: Color(true).disabledButton,
    ...Platform.select({
      web: {
        shadowColor: Color(true).disabledButtonSecondary,
        shadowOffset: {width: -3, height: 3},
        shadowOpacity: 1,
        shadowRadius: 0,
      }
    }),
  },
  buttonWarning: {
    backgroundColor: Color(true).warning,
    ...Platform.select({
      web: {
        shadowColor: Color(true).warningSecondary,
        shadowOffset: {width: -3, height: 3},
        shadowOpacity: 1,
        shadowRadius: 0,
      }
    }),
  },
  buttonDanger: {
    backgroundColor: Color(true).danger,
    ...Platform.select({
      web: {
        shadowColor: Color(true).dangerSecondary,
        shadowOffset: {width: -3, height: 3},
        shadowOpacity: 1,
        shadowRadius: 0,
      }
    }),
  },
  button: {
    paddingLeft: 20,
    paddingRight: 20,
    paddingTop: 8,
    paddingBottom: 8,
    borderRadius: Radius.default,
    marginLeft:3,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
  },
  labelDefault: {
    fontSize: FontSize.default,
    color: Color(true).text,
    fontFamily: 'Inter-Regular',
    marginBottom: 5
  },
  alignRight: {
    marginRight: 0,
    marginLeft: 'auto'
  },
  alignCenter: {
    margin: 'auto'
  },
  checkboxContainer: {
    display: 'flex',
    flexDirection: 'row',
    gap: 5,
    alignItems: 'center'
  },
  checkbox: {
    borderColor: Color(true).border,
    borderWidth: 1,
    height: 18,
    width: 18,
    borderRadius: Radius.small,
    position: 'relative',
    backgroundColor: Color(true).white
  },
  checkboxMark: {
    borderRightWidth: 3,
    borderBottomWidth: 3,
    borderRightColor: Color(true).white,
    borderBottomColor: Color(true).white,
    transform: [{rotate: '45deg'}],
    height: 14,
    width: 7,
    position: 'absolute',
    top: 0,
    left: 5,
  },
  checkboxMarkContainer: {
    position: 'absolute',
    top: -1,
    left: -1,
    backgroundColor: Color(true).default,
    width: 18,
    height: 18,
    borderRadius: Radius.small
  },
  checkboxLabel: {
    fontFamily: 'Inter-Regular',
    fontSize: FontSize.default,
    color: Color(true).text,
    marginLeft: 5,
    ...Platform.select({
      web: {
        marginLeft: 0
      }
    }),
  },
  verticalGroup: {
    marginTop: 10
  },
  horizontalGroup: {
      marginRight: 10
  },
  maskLoading: {
    margin: 'auto',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%'

  },
  maskPrompt: {
      height: '100%',
      width: '100%',
      backgroundColor: Color(true).promptMask,
      position: 'absolute',
      borderRadius: Radius.large,
      top: 0,
      left: 0
  },
  maskPromptMobile: {
    height: '100%',
    width: '100%',
    backgroundColor: Color(true).promptMaskMobile,
    position: 'absolute',
    borderRadius: Radius.large,
    top: 0,
    left: 0
  },
});

export const DarkLoginStyle = StyleSheet.create({
  logo: {
    marginLeft: 'auto',
    marginRight: 'auto',
    marginBottom: 40,
  },
  errorMessage: {
    textAlign: 'center',
    fontSize: FontSize.small,
    color: Color(true).danger,
    fontFamily: 'Inter-Regular',
    maxHeight: 150,
    overflowY: 'auto',
    margin: 'auto',
    width: '100%',
    marginTop: 40
  },
  previousPageText: {
    display: 'flex',
    flexDirection: 'row',
    marginBottom: 0,
    marginTop: 'auto',
    justifyContent: 'center',
    alignItems: 'center',
  },
  previousPageAction: {
    marginLeft: 5
  },
  actionText: {
    marginTop: 5,
    marginBottom: 40
  },
  submitButton: {
    marginBottom: 40
  },
  inputStyle: {
    marginBottom: 15
  },
  rightTextHint: {
    marginTop: 5,
    marginBottom: 40,
    marginRight: 0,
    marginLeft: 'auto'
  },
  resendText: {
    marginBottom: 5,
    marginRight: 0,
    marginLeft: 'auto'
  },
  timerText: {
    marginTop: 5,
    marginBottom: 40,
    marginRight: 0,
    marginLeft: 'auto',
    height: 15
  },
  mainContent: {
    marginTop: 40,
    marginBottom: 'auto'
  },
  sentText: {
    marginBottom: 0,
    marginTop: 0,
    color: Color(true).textTertiary,
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: FontSize.default
  },
  reqItem: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    gap: 5,
    display: 'flex'
  },
});

function DarkColor() {
  return {
    actualWhite: '#FFFFFF',
    white:'#242526',
    black:'#ffffff',
    blackMask: '#00000075',
    success:'#54BE66',
    successSecondary:'#4BAB5B',
    default:'#418DFC',
    defaultSecondary:'#3A7EE2',
    danger:'#DC0041',
    dangerSecondary:'#C6003A',
    warning:'#dc9500',
    warningSecondary:'#B07700',
    text:'#FFFFFF',
    textSecondary:'#FFFFFF',
    textTertiary:'#e7e7e7',
    textDisabled:'#7b7d7e',
    border:'transparent',
    borderSecondary:'#B3B4B9',
    holder:'#4E4F50',
    holderSecondary:'#3A3B3C',
    holderTertiary:'#CDCFD1',
    imgBackground:'#3A3B3C',
    icon:'#FFFFFF',
    grey: '#CDCFD1',
    transparent: 'transparent',
    none: 'transparent',
    gold: '#edb74d',
    goldSecondary: '#d5a445',
    darkgrey: '#383c3b',
    holderMask: '#F0F2F5BF',
    whiteMask: '#141414bf',
    textMask: '#FFFFFF',
    defaultLight: '#d9e8fe',
    whiteUnderlay: '#FFFFFF30',
    defaultUnderlay: '#66a3fc',
    goldUnderlay: '#f0c570',
    successUnderlay: '#76cb84',
    dangerUnderlay: '#e33266',
    warningUnderlay: '#e3aa32',
    background: '#141414',
    contentBackground: '#191919',
    contentBackgroundSecondary: '#141414',
    shadow: '#000000',
    titleText: '#e7e7e7',
    subTitleText: '#e7e7e7',
    separator: '#3A3B3C',
    disabledButton: '#4E4F50',
    disabledButtonSecondary: '#3A3B3C',
    promptMask: '#191919bf',
    promptMaskMobile: '#141414bf',
    contentHolder: '#1e1e1e',
    contentHolderSecondary: '#1b1b1b',
    disabledText: '#777777',
    disabledTextInput: '#1b1b1b',
    input: '#242526',
    maskText: '#888888',
    placeHolderText: '#888888',
    contentDialogBackground: '#242526',
    contentDialogBackgroundSecondary: '#202122',
    userIcon: '#D2D4D9',
    statusBar: '#141414'
  }
}

// End Dark Theme