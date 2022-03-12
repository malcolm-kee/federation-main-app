import HeroSection from 'marketing/hero-section';
import * as React from 'react';
import { Link } from 'react-router-dom';
import Container from '../components/container';
import { careerUrl, detailsUrl } from '../constants/routes';

export const HomePage = () => {
  return (
    <>
      <HeroSection />
      <Container>
        <h1 className="mn-text-3xl">Home</h1>
        <p>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Porro cum ab
          quisquam iusto, fugit eum dignissimos inventore sequi consequuntur
          nesciunt tempore reprehenderit quam officiis qui fugiat voluptatibus
          consequatur! Soluta, quod accusamus. Quia accusamus perspiciatis fuga,
          expedita nisi inventore quasi cupiditate recusandae eligendi magni
          esse perferendis veritatis dicta modi vitae neque!
        </p>
        <div className="mn-flex mn-space-x-2 mn-items-center">
          <Link to={detailsUrl} className="mn-text-pink-600 hover:mn-underline">
            Go to Details
          </Link>
          <Link to={careerUrl} className="mn-text-pink-600 mn-hover:underline">
            Career
          </Link>
        </div>
      </Container>
    </>
  );
};
