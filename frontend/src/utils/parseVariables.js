// parseVariables.js - Utility to extract variables from text
// Detects patterns like {{variableName}}

/**
 * Parse text and extract variable names in {{variable}} format
 * @param {string} text - The text to parse
 * @returns {string[]} - Array of unique variable names
 */
export const parseVariables = (text) => {
  if (!text || typeof text !== 'string') return [];
  
  // Match {{variableName}} patterns
  const regex = /\{\{([^}]+)\}\}/g;
  const variables = new Set();
  
  let match;
  while ((match = regex.exec(text)) !== null) {
    const varName = match[1].trim();
    if (varName) {
      variables.add(varName);
    }
  }
  
  return Array.from(variables);
};

/**
 * Replace variables in text with provided values
 * @param {string} text - The text with variables
 * @param {Object} values - Object mapping variable names to values
 * @returns {string} - Text with variables replaced
 */
export const replaceVariables = (text, values = {}) => {
  if (!text || typeof text !== 'string') return text;
  
  return text.replace(/\{\{([^}]+)\}\}/g, (match, varName) => {
    const trimmedName = varName.trim();
    return values[trimmedName] !== undefined ? values[trimmedName] : match;
  });
};

/**
 * Highlight variables in text for display
 * @param {string} text - The text to process
 * @returns {Array} - Array of text parts with isVariable flags
 */
export const highlightVariables = (text) => {
  if (!text || typeof text !== 'string') return [{ text: '', isVariable: false }];
  
  const parts = [];
  const regex = /(\{\{[^}]+\}\})/g;
  const splitParts = text.split(regex);
  
  splitParts.forEach(part => {
    if (part) {
      parts.push({
        text: part,
        isVariable: /^\{\{[^}]+\}\}$/.test(part)
      });
    }
  });
  
  return parts;
};

export default parseVariables;
