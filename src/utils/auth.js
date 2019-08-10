
export const setObjArr = (name, data) =>{
  localStorage.setItem(name, JSON.stringify(data))
};

export const getObjArr = (name) =>{
  return JSON.parse(window.localStorage.getItem(name));
};

export const removeObjArr = () =>{
  return localStorage.clear();
};