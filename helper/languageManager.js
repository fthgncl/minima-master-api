const langs = require('../languages.json');
const {systemLanguage} = require('../config.json');

function getLangData(langCode) {
    let lang = langs.find(lang => langCode.toUpperCase() === lang.code.toUpperCase());
    if (!lang) {
        lang = langs.find(lang => systemLanguage === lang.code.toUpperCase());
    }
    return lang;
}
function getLangDataOnRequest(req) {
    const acceptedLanguages = req.headers['accept-language'];
    const preferredLanguage = acceptedLanguages.split(',')[0].trim();
    return getLangData(preferredLanguage);
}

module.exports = { getLangData, getLangDataOnRequest };
