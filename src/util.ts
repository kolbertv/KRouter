let isObject = (obj: any): boolean => obj && obj.constructor && obj.constructor === Object;

export { isObject };
