import CerbyUserDefaultsModule from "./CerbyUserDefaultsModule";

export function hello(): string {
  return CerbyUserDefaultsModule.hello();
}

export const saveData = async (value: string) => {
  return await CerbyUserDefaultsModule.saveData(value);
};

export const getData = async () => {
  return await CerbyUserDefaultsModule.getData();
}
