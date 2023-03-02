import { library } from "@fortawesome/fontawesome-svg-core";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { StackNavigationProp } from "@react-navigation/stack";
import { createContext } from "react";
import { Dimensions } from "react-native";
import { Content } from "./style";
import * as DeepLinking from 'expo-linking';
import { faClose, faCheck, faXmark, faMessage, faCaretDown, faUser, faPoll, faHouseFlag, faCheckDouble, faEdit, faGlobe, faSignOut, faUserPlus, faArrowLeft, faRefresh, faLock, faPowerOff, faKey, faHouse, faTreeCity, faBed, faSink, faFilter, faToggleOff, faToggleOn, faCertificate, faCakeCandles, faLocationDot, faPencil, faMagnifyingGlass, faList } from '@fortawesome/free-solid-svg-icons'
import AsyncStorage from "@react-native-async-storage/async-storage";
library.add(faList, faHouse, faMagnifyingGlass, faPencil, faLocationDot, faCakeCandles, faCertificate, faToggleOff, faToggleOn, faFilter, faSink, faBed, faTreeCity, faClose, faPowerOff, faKey, faRefresh, faArrowLeft, faUserPlus, faCheck, faXmark, faMessage, faCaretDown, faUser, faPoll, faHouseFlag, faCheckDouble, faEdit, faGlobe, faSignOut)

export const Stack = createNativeStackNavigator<Page>();

export const isMobile = () => {
    return Dimensions.get('window').width < Content.mobileWidth;
}

const prod = {
    URL: "https://roomfin.xyz"
};

const dev = {
   URL: "http://localhost:8080"
};
export const env = process.env.NODE_ENV === "development" ? dev : prod;

export const validateEmail = (email: string) => {
    return String(email)
    .toLowerCase()
    .match(
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@knights.ucf.edu$/
    );
};

export const acceptableSymbols = () => {
    return '(!, @, #, $, %, &, ?)';
}

export const includesSymbol = (text: string) => {
    return /[!@#$%&?]/.test(text);
};

export const isAtLeastEightChars = (text: string) => {
    return text.length >= 8;
};

export const includesUpperContains = (text: string) => {
    return /[A-Z]/.test(text);    
}

export const textMatches = (text1: string, text2: string) => {
    return text1 === text2 && text1.length > 0 && text2.length > 0;
}

export enum Listings_Screen {
  all,
  favorites,
  create
}

export const Context = createContext({} as any); 
export type navProp = StackNavigationProp<Page>;
export const NavTo = {
  Home: 'Home' as never,
  Auth: 'Auth' as never,
  ConfirmEmail: 'ConfirmEmail' as never,
  ResetPassword: 'ResetPassword' as never,
  UpdatePassword: 'UpdatePassword' as never,
  Login: 'Login' as never,
  Account: 'Account' as never,
  Profile: 'Profile' as never,
  MyProfile: 'MyProfile' as never,
  Survey: 'Survey' as never,
  Search: 'Search' as never,
  Filters: 'Filters' as never,
  Listings: 'Listings' as never,
  Messages: 'Messages' as never,
  Logout: 'Logout' as never,
}

export const LoginNavTo = {
  Login: '' as never,
  Register: 'register' as never,
  ActivateEmailSent: 'email-sent' as never,
  ForgotPassword: 'forgot-password' as never,
  PasswordResetSent: 'reset-sent' as never,
  UpdatePassword: 'update-password' as never,
  PasswordUpdated: 'password-updated' as never,
}

export type Page = {
  Home: undefined;
  Auth: undefined;
  ConfirmEmail: undefined;
  ResetPassword: undefined;
  UpdatePassword: undefined;
  Login: undefined;
  Account: undefined;
  Profile: undefined;
  Survey: undefined;
  Search: undefined;
  Listings: undefined;
  Messages: undefined;
  Logout: undefined;
}

export const config = {
  screens: {
    Home: '/',
    Auth: {
      screens: {
        ConfirmEmail: '/auth/confirmEmail',
        ResetPassword: '/auth/reset',
        UpdatePassword: '/auth/update',
      },
    },
    Login: '/login',
    Account: '/account',
    Profile: '/profile',
    Survey: '/survey',
    Matches: '/matches',
    Search: '/search',
    Listings: '/listings',
    Messages: '/messages',
    Logout: '/logout',
  },
};

const prefix = DeepLinking.createURL('/');
export const linking = {
  prefixes: [
    prefix,
    'roomfin://',
    'https://roomfin.xyz',
    'https://www.roomfin.xyz',
    'http://roomfin.xyz',
    'http://www.roomfin.xyz',
  ],
  config,
};

export const enum AccountScreenType {
  none, info, about, survey
}

export const getLocalStorage = async () => {
  try {
    const jsonValue = await AsyncStorage.getItem('@user_data');
    return jsonValue != null ? JSON.parse(jsonValue) : null;
  }
  catch {
    return null;
  }
}

export const setLocalStorage = async (data: Object | null) => {
  try {
    const jsonValue = !data ? '' : JSON.stringify(data);
    await AsyncStorage.setItem('@user_data', jsonValue);
    return true;
  }
  catch {
    return false;
  }
}

export const isLoggedIn = async () => {
  try {
    const jsonValue = await AsyncStorage.getItem('@user_data');
    const data = jsonValue != null ? JSON.parse(jsonValue) : null;
    if (data) {
      return data.refreshToken ? true : false;
    }
    else {
      return false;
    }
  }
  catch {
    return false;
  }
}

export const isSetup = async () => {
  try {
    const jsonValue = await AsyncStorage.getItem('@user_data');
    const data = jsonValue != null ? JSON.parse(jsonValue) : null;
    if (data && data.user) {
      return data.user.is_setup ? true : false;
    }
    else {
      return false;
    }
  }
  catch {
    return false;
  }
}

export const userId = async () => {
  try {
    const jsonValue = await AsyncStorage.getItem('@user_data');
    const data = jsonValue != null ? JSON.parse(jsonValue) : null;
    if (data && data.user) {
      return data.user.id;
    }
    else {
      return '';
    }
  }
  catch {
    return '';
  }
}

export const authTokenHeader = async () => {
  let data = await getLocalStorage();
  if (data) {
    return `token ${data.accessToken}`;
  }
  return '';
}

// For use with dark mode and other non-session based settings
export const getLocalAppSettings = async () => {
  try {
    const jsonValue = await AsyncStorage.getItem('@app_data');
    return jsonValue != null ? JSON.parse(jsonValue) : null;
  }
  catch {
    return null;
  }
}

// For use with dark mode and other non-session based settings
export const setLocalAppSettings = async (data: Object | null) => {
  try {
    const jsonValue = !data ? '' : JSON.stringify(data);
    await AsyncStorage.setItem('@app_data', jsonValue);
    return true;
  }
  catch {
    return false;
  }
}

// Set push message token
export const setLocalAppSettingsPushMessageToken = async (token: string) => {
  try {
    let allData = await getLocalAppSettings();
    if (allData) {
      allData.pushMessageToken = token;
      const jsonValue = JSON.stringify(allData);
      await AsyncStorage.setItem('@app_data', jsonValue);
    }
    else {
      const jsonValue = !token ? '' : JSON.stringify({pushMessageToken: token});
      await AsyncStorage.setItem('@app_data', jsonValue);
    }

    return true;
  }
  catch {
    return false;
  }
}

export const getPushMessageToken = async () => {
  try {
    const jsonValue = await AsyncStorage.getItem('@app_data');
    const data = jsonValue != null ? JSON.parse(jsonValue) : null;
    if (data) {
      return data.pushMessageToken;
    }
    else {
      return '';
    }
  }
  catch {
    return '';
  }
}

// Set current open chat id
export const setLocalAppSettingsCurrentChat = async (data: Object | null) => {
  try {
    let allData = await getLocalAppSettings();
    if (allData) {
      allData.currentChat = data;
      const jsonValue = JSON.stringify(allData);
      await AsyncStorage.setItem('@app_data', jsonValue);
    }
    else {
      const jsonValue = !data ? '' : JSON.stringify({currentChat: data});
      await AsyncStorage.setItem('@app_data', jsonValue);
    }

    return true;
  }
  catch {
    return false;
  }
}

export const getCurrentChat = async () => {
  try {
    const jsonValue = await AsyncStorage.getItem('@app_data');
    const data = jsonValue != null ? JSON.parse(jsonValue) : null;
    if (data) {
      return data.currentChat;
    }
    else {
      return '';
    }
  }
  catch {
    return '';
  }
}

// Set current push to open chat id
export const setLocalAppSettingsOpenPushChat = async (id: string) => {
  try {
    let allData = await getLocalAppSettings();
    if (allData) {
      allData.openPushChat = id;
      const jsonValue = JSON.stringify(allData);
      await AsyncStorage.setItem('@app_data', jsonValue);
    }
    else {
      const jsonValue = !id ? '' : JSON.stringify({openPushChat: id});
      await AsyncStorage.setItem('@app_data', jsonValue);
    }

    return true;
  }
  catch {
    return false;
  }
}

export const getOpenPushChat = async () => {
  try {
    const jsonValue = await AsyncStorage.getItem('@app_data');
    const data = jsonValue != null ? JSON.parse(jsonValue) : null;
    if (data) {
      return data.openPushChat;
    }
    else {
      return '';
    }
  }
  catch {
    return '';
  }
}

export const isDarkMode = async () => {
  try {
    const jsonValue = await AsyncStorage.getItem('@app_data');
    const data = jsonValue != null ? JSON.parse(jsonValue) : null;
    if (data) {
      return data.is_darkmode ? true : false;
    }
    else {
      return false;
    }
  }
  catch {
    return false;
  }
}