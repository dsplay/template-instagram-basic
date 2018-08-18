const template = window.dsplay_template || window.template || {};

export const tval = (key, defaultValue) => template[key] !== undefined && template[key] !== null ? template[key] : defaultValue;

export const tbval = (key, defaultValue) => tval(key, defaultValue ? 'true' : 'false').toLowerCase() === 'true';