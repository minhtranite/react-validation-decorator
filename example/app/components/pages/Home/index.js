import React from 'react';
import Document from 'components/common/Document';
import Component from './Component';

class HomePage extends React.Component {
  render() {
    return (
      <Document title="Home | React validation example" className="page-home">
        <Component/>
      </Document>
    );
  }
}

export default HomePage;
