import { Button } from '@mkeeorg/federation-ui';
import * as React from 'react';
import { pluginService, remoteUrlService } from '../services/remote-overwrite';
import styles from './remote-form.module.css';

export const OverwriteUrlForm = () => {
  const [apps] = React.useState(() => Object.keys(window.appUrls));

  return (
    <form
      onSubmit={(ev) => {
        ev.preventDefault();

        remoteUrlService.overwriteUrl(
          ev.target.elements.appName.value,
          ev.target.elements.url.value
        );
      }}
      className={styles.form}
    >
      <h2>Overwrite URL</h2>
      <div className={styles.field}>
        <label>App</label>
        <select name="appName" id="appName" required>
          {apps.map((app) => (
            <option value={app} key={app}>
              {app}
            </option>
          ))}
        </select>
      </div>
      <div className={styles.field}>
        <label>URL</label>
        <input name="url" id="url" type="url" required />
      </div>
      <div style={{ display: 'flex', gap: '1rem' }}>
        <Button type="submit" style={{ flex: 1 }}>
          Overwrite
        </Button>
        <Button
          onClick={() => remoteUrlService.reset()}
          type="button"
          variant="white"
          style={{ flex: 1 }}
        >
          Reset
        </Button>
      </div>
    </form>
  );
};

export const AddPluginForm = () => {
  return (
    <form
      onSubmit={(ev) => {
        ev.preventDefault();

        pluginService.addPlugin({
          app_name: ev.target.elements.app_name.value,
          url: ev.target.elements.url.value,
          path: ev.target.elements.path.value,
        });
      }}
      className={styles.form}
    >
      <h2>Add Plugin</h2>
      <div className={styles.field}>
        <label>Name</label>
        <input name="app_name" id="app_name" type="text" required />
      </div>
      <div className={styles.field}>
        <label>URL</label>
        <input name="url" id="url" type="url" required />
      </div>
      <div className={styles.field}>
        <label>Path</label>
        <input name="path" id="path" type="text" required />
      </div>
      <div style={{ display: 'flex', gap: '1rem' }}>
        <Button type="submit" style={{ flex: 1 }}>
          Add
        </Button>
        <Button
          onClick={() => pluginService.resetPlugins()}
          type="button"
          variant="white"
          style={{ flex: 1 }}
        >
          Reset
        </Button>
      </div>
    </form>
  );
};
