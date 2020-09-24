import * as React from 'react';

const RemoteNextContent = React.lazy(() => import('contentNext/content'));

export default function NextContent() {
  return <RemoteNextContent />;
}
