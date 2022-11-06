import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import React, { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import _Button from '../../components/control/button';
import _Text from '../../components/control/text';
import { acceptableSymbols, config, env, includesSymbol, includesUpperContains, isAtLeastEightChars, textMatches } from '../../helper';
import { Color, LoginStyle, Style } from '../../style';
import _TextInput from '../control/text-input';

const UpdatePassword = (props: any, {navigation}:any) => {
  const [message, setMessage] = useState('');
  const [hasSymbol, setHasSymbol] = useState(false);
  const [hasCharLimit, setHasCharLimit] = useState(false);
  const [hasUpperCase, setHasUpperCase] = useState(false);
  const [isMatching, setIsMatching] = useState(false);
  const [disabled, setDisabled] = useState(true);
  const [pValue, setPValue] = useState('');
  const [verifyPValue, setVerifyPValue] = useState('');
  const [pwdError,setPwdError] = useState(false);
  const [verifyPwdError,setVerifyPwdError] = useState(false);

  const TEMP = () => {
    setPValue('');
    setVerifyPValue('');
    setPwdError(false);
    setVerifyPwdError(false);
    props.updatePasswordPressed();
  }

  useEffect(() => {
    checkDisabledBtn();
  });

  const checkDisabledBtn = () => {
      setDisabled(!hasSymbol || !hasCharLimit || !hasUpperCase || !isMatching);
  }

  const getValidAttribute = (valid: boolean) => {
      return valid ? styles.green : styles.red;
  }

  const handleChange = (value: string) => {
      setPValue(value);
      setHasSymbol(includesSymbol(value) ? true : false);
      setHasCharLimit(isAtLeastEightChars(value));
      setHasUpperCase(includesUpperContains(value))
      setIsMatching(textMatches(value, verifyPValue));

      checkDisabledBtn();
  }

  const handleVerifyChange = (value: string) => {
      setVerifyPValue(value);
      setIsMatching(textMatches(value, pValue));
      checkDisabledBtn();
  }

  const backToLogin = () => {
      setMessage('');
      setPValue('');
      setVerifyPValue('');
      setDisabled(true);
      setPwdError(false);
      setVerifyPwdError(false);
      handleChange(pValue)
      handleVerifyChange(verifyPValue)
      props.loginPressed();
  };

  const doPasswordUpdate = async () => 
  {
      setPwdError(false);
      setVerifyPwdError(false);
      
      let obj;
      if (props.isPasswordReset)
          obj = {type:'reset', password_id:props.passwordID, password:pValue, passwordVerify:verifyPValue};
      else
          obj = {type:'activate', password_id:props.passwordID, password:pValue, passwordVerify:verifyPValue};

      let js = JSON.stringify(obj);

      try
      {    
          const response = await fetch(`${env.URL}/api/update-password`,
              {method:'POST',body:js,headers:{'Content-Type': 'application/json'}});

          let res = JSON.parse(await response.text());

          if(res.error)
          {
              setPwdError(true);
              setVerifyPwdError(true);
              setMessage(res.error);
          }
          else
          {
              setPValue('');
              setVerifyPValue('');
              setPwdError(false);
              setVerifyPwdError(false);
              props.updatePasswordPressed();
          }
      }
      catch(e)
      {
          TEMP(); // JA REMOVE
          setMessage('An unexpected error occurred while updating your password. Please try again.');
          return;
      }    
  };
  
  return (
    <View
    style={props.style}>
      <_Text
      style={[Style.textHuge, Style.boldFont]}
      >
        Update Password
      </_Text>
      <_Text
      style={[Style.textDefaultTertiary, LoginStyle.actionText]}
      >
        Enter a new account password
      </_Text>
      <_TextInput
      type="password"
      label="Password"
      style={LoginStyle.inputStyle}
      onChangeText={(e: any) => {handleChange(e)}}
      value={pValue}
      />
    <_TextInput
      type="password"
      label="Verify Password"
      onChangeText={(e: any) => {handleVerifyChange(e)}}
      value={verifyPValue}
      />
      <View
      style={styles.requirements}
      >
        <View
        style={LoginStyle.reqItem}
        >
          { hasCharLimit ? (
            <FontAwesomeIcon style={styles.green} icon="check" />
            ) :
            (<FontAwesomeIcon style={styles.red} icon="xmark" />
            )
          }
          <_Text
          style={[Style.textSmallDefault, getValidAttribute(hasCharLimit)]}
          >
            Includes at least 8 characters
          </_Text>
        </View>
        <View
        style={LoginStyle.reqItem}
        >
          { hasSymbol ? (
            <FontAwesomeIcon style={styles.green} icon="check" />
            ) :
            (<FontAwesomeIcon style={styles.red} icon="xmark" />
            )
          }
          <_Text
          style={[Style.textSmallDefault, getValidAttribute(hasSymbol)]}
          >
            Includes a symbol {acceptableSymbols()}
          </_Text>
        </View>
        <View
        style={LoginStyle.reqItem}
        >
          { hasUpperCase ? (
            <FontAwesomeIcon style={styles.green} icon="check" />
            ) :
            (<FontAwesomeIcon style={styles.red} icon="xmark" />
            )
          }
          <_Text
          style={[Style.textSmallDefault, getValidAttribute(hasUpperCase)]}
          >
            Includes at least one uppercase letter
          </_Text>
        </View>
        <View
        style={LoginStyle.reqItem}
        >
          { isMatching ? (
            <FontAwesomeIcon style={styles.green} icon="check" />
            ) :
            (<FontAwesomeIcon style={styles.red} icon="xmark" />
            )
          }
          <_Text
          style={[Style.textSmallDefault, getValidAttribute(isMatching)]}
          >
            Passwords match
          </_Text>
        </View>
      </View>
      <View
      style={Style.alignRight}
      >
        <_Button
        style={props.btnStyle(disabled)}
        onPress={() => doPasswordUpdate()}
        disabled={disabled}
        >
          Update Password
        </_Button>
      </View>
      <_Text
      style={LoginStyle.errorMessage}
      >
        {message}
      </_Text>
        <View
        style={LoginStyle.previousPageText}
        >
        <_Text
        style={Style.textDefaultTertiary}
        >
          Go back to
        </_Text>
        <_Text
        style={[Style.textDefaultDefault, Style.boldFont]}
        onPress={() => backToLogin()}
        >login</_Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  red: {
    color: Color.danger
  },
  green: {
    color: Color.success
  },
  requirements: {
    marginTop: 15,
    marginBottom: 40
  }
});

export default UpdatePassword;