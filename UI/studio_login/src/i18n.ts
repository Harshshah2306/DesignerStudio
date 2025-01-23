import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import HttpApi from 'i18next-http-backend';

i18n.use(HttpApi)
    .use(initReactI18next) // to make it work with the React App
    .init({
        lng: 'en',
        debug: true,
        fallbackLng: 'en',  // If the language is not found it should use this 
        ns: ['common'], // ns for namespace
        backend: {
            loadPath: '/i18n/{{lng}}/{{ns}}.json' // Expression for language
        },
        interpolation: {
            escapeValue: false //not needed for the React App because react already handles escaping values
        }
    });

export default i18n;


