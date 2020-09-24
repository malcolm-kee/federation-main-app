import * as React from 'react';

const RemoteContent = React.lazy(() => import('content/content'));

export default function Content() {
  return <RemoteContent />;
}
