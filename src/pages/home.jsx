import { Container } from '@mkeeorg/federation-ui';
import HeroSection from 'marketing/hero-section';
import * as React from 'react';
import { Link } from 'react-router-dom';

import { detailsUrl } from '../constants/routes';
import styles from './home.module.css';

export const HomePage = () => {
  return (
    <>
      <HeroSection />
      <Container>
        <h1 className={styles.title}>
          Thanks for being 1 in <em className={styles.em}>at least fifty!</em>{' '}
          (I hope)
        </h1>
        <p>
          I hope the demo will works! I really do. Please works demo and no
          weird issue. JavaScript please be nice to me. TypeScript sorry for not
          using you this time but this is just a demo not even a POC. And I hope
          you all can understand me! Pls don't come out from monitor and scream
          at me...
        </p>
        <div className={styles.linkList}>
          <Link to={detailsUrl} className={styles.link}>
            Go to Details
          </Link>
        </div>
        <ul>
          <li>
            Use this link to overwrite marketing app URL:{' '}
            <a
              href="?_marketing=https://federation-marketing-app-git-fix-change-hero-malcolm-kee.vercel.app"
              className={styles.helpLink}
            >
              ?_marketing=https://federation-marketing-app-git-fix-change-hero-malcolm-kee.vercel.app
            </a>
          </li>
          <li>
            Use this link to add help app:{' '}
            <a
              href="?_career=https://federation-career-app-git-feat-add-help-slot-malcolm-kee.vercel.app&pluginName=help&pluginUrl=https://federation-help-app.vercel.app&pluginPath=./plugin"
              className={styles.helpLink}
            >
              ?_career=https://federation-career-app-git-feat-add-help-slot-malcolm-kee.vercel.app&pluginName=help&pluginUrl=https://federation-help-app.vercel.app&pluginPath=./plugin
            </a>
          </li>
        </ul>
      </Container>
    </>
  );
};
