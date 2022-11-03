import { Dimensions } from "react-native";
import { Content } from "./style";

export const isMobile = () => {
    return Dimensions.get('window').width < Content.mobileWidth;
}

const prod = {
    URL: "https://roomfin.xyz"
};

const dev = {
   URL: "http://localhost:8080"
};
export const config = process.env.NODE_ENV === "development" ? dev : prod;

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