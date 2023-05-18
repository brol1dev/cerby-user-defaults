import CerbyUserDefaultsModule from "./CerbyUserDefaultsModule";

export const saveData = async (value: string, secure: boolean) => {
  return await CerbyUserDefaultsModule.saveData(value, secure);
};

export const getData = async (secure: boolean) => {
  return await CerbyUserDefaultsModule.getData(secure);
};

export const clear = async (secure: boolean) => {
  return await CerbyUserDefaultsModule.clear(secure);
};
