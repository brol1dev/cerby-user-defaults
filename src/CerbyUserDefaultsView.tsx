import { requireNativeViewManager } from 'expo-modules-core';
import * as React from 'react';

import { CerbyUserDefaultsViewProps } from './CerbyUserDefaults.types';

const NativeView: React.ComponentType<CerbyUserDefaultsViewProps> =
  requireNativeViewManager('CerbyUserDefaults');

export default function CerbyUserDefaultsView(props: CerbyUserDefaultsViewProps) {
  return <NativeView {...props} />;
}
