import HeroSection from 'marketing/hero-section';
import * as React from 'react';
import { Link } from 'react-router-dom';
import Container from '../components/container';
import { careerUrl, detailsUrl } from '../constants/routes';
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
          <Link to={careerUrl} className={styles.link}>
            Career
          </Link>
        </div>
      </Container>
    </>
  );
};
