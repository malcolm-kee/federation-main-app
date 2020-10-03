import * as React from 'react';
import { Link } from 'react-router-dom';
import Container from '../components/container';
import { careerUrl, detailsUrl } from '../constants/routes';

export const HomePage = () => {
  return (
    <Container>
      <h1 className="text-3xl">Home</h1>
      <p>
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Porro cum ab
        quisquam iusto, fugit eum dignissimos inventore sequi consequuntur
        nesciunt tempore reprehenderit quam officiis qui fugiat voluptatibus
        consequatur! Soluta, quod accusamus. Quia accusamus perspiciatis fuga,
        expedita nisi inventore quasi cupiditate recusandae eligendi magni esse
        perferendis veritatis dicta modi vitae neque!
      </p>
      <div className="flex space-x-2 items-center">
        <Link to={detailsUrl} className="text-pink-600 hover:underline">
          Go to Details
        </Link>
        <Link to={careerUrl} className="text-pink-600 hover:underline">
          Career
        </Link>
      </div>
    </Container>
  );
};
