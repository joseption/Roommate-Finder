import { faDirections } from '@fortawesome/free-solid-svg-icons';
import { Platform, StyleSheet } from 'react-native';

export const Color = {
    white:'#FFFFFF',
    black:'#000000',
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
    holderSecondary:'#E4E6E9'
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
  large:20
}

export const Style = StyleSheet.create({
  boldFont: {
    fontFamily: 'Inter-Bold',
  },
  inputDefault: {
    fontSize: FontSize.default,
    color: Color.text,
    fontFamily: 'Inter-Regular',
    backgroundColor: Color.white,
    borderColor: Color.border,
    borderRadius: Radius.default,
    borderWidth: 1,
    height: 35,
    paddingLeft: 10,
    paddingRight: 10,
    paddingTop: 5,
    paddingBottom: 5
  },
  textHuge: {
    fontSize: FontSize.huge,
    color: Color.text,
    fontFamily: 'Inter-Regular'
  },
  textLarge: {
    fontSize: FontSize.large,
    color: Color.text,
    fontFamily: 'Inter-Regular'
  },
  textDefault: {
    fontSize: FontSize.default,
    color: Color.text,
    fontFamily: 'Inter-Regular'
  },
  textSmall: {
    fontSize: FontSize.small,
    color: Color.text,
    fontFamily: 'Inter-Regular'
  },
  textTiny: {
    fontSize: FontSize.tiny,
    color: Color.text,
    fontFamily: 'Inter-Regular'
  },
  textTinyTertiary: {
    fontSize: FontSize.tiny,
    color: Color.textTertiary,
    fontFamily: 'Inter-Regular'
  },
  textSmallDefault: {
    fontSize: FontSize.small,
    color: Color.default,
    fontFamily: 'Inter-Regular'
  },
  textDefaultDefault: {
    fontSize: FontSize.default,
    color: Color.default,
    fontFamily: 'Inter-Regular'
  },
  textDefaultTertiary: {
    fontSize: FontSize.default,
    color: Color.textTertiary,
    fontFamily: 'Inter-Regular'
  },
  textSmallDanger: {
    fontSize: FontSize.small,
    color: Color.danger,
    fontFamily: 'Inter-Regular'
  },
  textSmallSecondary: {
    fontSize: FontSize.small,
    color: Color.text,
    fontFamily: 'Inter-Regular'
  },
  buttonSuccess: {
    backgroundColor: Color.success,
    shadowColor: Color.successSecondary,
    shadowOffset: {width: -3, height: 3},
    shadowOpacity: 1,
    shadowRadius: 0,
  },
  buttonDefault: {
    backgroundColor: Color.default,
    shadowColor: Color.defaultSecondary,
    shadowOffset: {width: -3, height: 3},
    shadowOpacity: 1,
    shadowRadius: 0,
  },
  buttonDisabled: {
    backgroundColor: Color.holder,
    shadowColor: Color.holderSecondary,
    shadowOffset: {width: -3, height: 3},
    shadowOpacity: 1,
    shadowRadius: 0,
  },
  buttonWarning: {
    backgroundColor: Color.warning,
    shadowColor: Color.warningSecondary,
    shadowOffset: {width: -3, height: 3},
    shadowOpacity: 1,
    shadowRadius: 0,
  },
  buttonDanger: {
    backgroundColor: Color.danger,
    shadowColor: Color.dangerSecondary,
    shadowOffset: {width: -3, height: 3},
    shadowOpacity: 1,
    shadowRadius: 0,
  },
  button: {
    paddingLeft: 20,
    paddingRight: 20,
    paddingTop: 8,
    paddingBottom: 8,
    borderRadius: Radius.default,
    width:'fit-content',
    marginLeft:3
  },
  labelDefault: {
    fontSize: FontSize.default,
    color: Color.text,
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
});

export const LoginStyle = StyleSheet.create({
  logo: {
    height: 75,
    width: 200,
    marginLeft: 'auto',
    marginRight: 'auto',
    marginBottom: 40
  },
  errorMessage: {
    textAlign: 'center',
    fontSize: FontSize.small,
    color: Color.danger,
    fontFamily: 'Inter-Regular',
    maxHeight: 150,
    overflowY: 'auto',
    margin: 'auto'
  },
  previousPageText: {
    display: 'flex',
    gap: 5,
    flexDirection: 'row',
    marginBottom: 0,
    marginTop: 'auto',
    justifyContent: 'center'
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
    color: Color.textTertiary,
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
  }
});