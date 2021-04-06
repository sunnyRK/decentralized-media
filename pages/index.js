import React, { Component } from 'react';

import MainTemplate from '../src/modules/shared/main-template/MainTemplateContainer';
import LandingContainer from '../src/modules/components/landing/LandingContainer';
import Auth from '../src/hoc/auth';

class Landing extends Component { 
  render() {
    return (
      <LandingContainer />
    );
  }
}

export default Auth(Landing);
