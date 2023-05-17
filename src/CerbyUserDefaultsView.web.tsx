import * as React from 'react';

import { CerbyUserDefaultsViewProps } from './CerbyUserDefaults.types';

export default function CerbyUserDefaultsView(props: CerbyUserDefaultsViewProps) {
  return (
    <div>
      <span>{props.name}</span>
    </div>
  );
}
