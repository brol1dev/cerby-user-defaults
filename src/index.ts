import { NativeModulesProxy, EventEmitter, Subscription } from 'expo-modules-core';

// Import the native module. On web, it will be resolved to CerbyUserDefaults.web.ts
// and on native platforms to CerbyUserDefaults.ts
import CerbyUserDefaultsModule from './CerbyUserDefaultsModule';
import CerbyUserDefaultsView from './CerbyUserDefaultsView';
import { ChangeEventPayload, CerbyUserDefaultsViewProps } from './CerbyUserDefaults.types';

// Get the native constant value.
export const PI = CerbyUserDefaultsModule.PI;

export function hello(): string {
  return CerbyUserDefaultsModule.hello();
}

export async function setValueAsync(value: string) {
  return await CerbyUserDefaultsModule.setValueAsync(value);
}

const emitter = new EventEmitter(CerbyUserDefaultsModule ?? NativeModulesProxy.CerbyUserDefaults);

export function addChangeListener(listener: (event: ChangeEventPayload) => void): Subscription {
  return emitter.addListener<ChangeEventPayload>('onChange', listener);
}

export { CerbyUserDefaultsView, CerbyUserDefaultsViewProps, ChangeEventPayload };
