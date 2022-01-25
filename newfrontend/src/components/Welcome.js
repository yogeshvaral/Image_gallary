import React from 'react';
import { Jumbotron, Button } from 'react-bootstrap';
const Welcome = () => {
  return (
    <Jumbotron>
      <h1>Iamges Gallary</h1>
      <p>
        This is simple application that retrieves photos from unsplash API.In
        order to start enter any search term in input field.
      </p>
      <p>
        <Button bsStyle="primary" href="https://unsplash.com" target="_blank">
          Learn more
        </Button>
      </p>
    </Jumbotron>
  );
};
export default Welcome;
