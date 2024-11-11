import mainDom from '../html/mainDom.html'

function htmlToNode(html) {
  const template = document.createElement('template');
  template.innerHTML = html;
  const nNodes = template.content.childNodes.length;
  if (nNodes !== 1) {
      throw new Error(
          `html parameter must represent a single node; got ${nNodes}. ` +
          'Note that leading or trailing spaces around an element in your ' +
          'HTML, like " <img/> ", get parsed as text nodes neighbouring ' +
          'the element; call .trim() on your input to avoid this.'
      );
  }
  return template.content.firstChild;
}

// this function replaces a token {{substringVal}}, with the corresponding value from the data object
//
// Inputs:
//    substring - the token to be replaced, in the format {{substringVal}}
//    data - data object with attributes that match the substring to replace
// Returns:
//    Text that has the value from the data object, or empty string if it does not exist in data object
const replacerFn = (substring, data) => {
  const element = substring.replace('{{', '').replace('}}', '');
  return (element in data) ? data[element] : 'ERROR IN DATA';
};

// this function will look for all occurrences of tokens of the format {{VALUE}}
// and use the function above to replace it with the corresponding value form the data object
//
// Inputs:
//    text - text with tokens to be replaced
//    data - object with attributes that match the tokens to be replaced
// Returns:
//    Text with tokens replaced
const textReplacer = (text, data) => {
  const regExp = /({{[^{}]+}})/g;
  return text.replace(regExp, (substring) => replacerFn(substring, data));
};


const availableElems = {
  mainDom,
}

const exportObj = {};

Object.entries(availableElems).forEach(([key, html] ) => {
  exportObj[key] = (textToReplaceMap)=>  htmlToNode(textReplacer(html, textToReplaceMap).trim());
})

export default exportObj;
