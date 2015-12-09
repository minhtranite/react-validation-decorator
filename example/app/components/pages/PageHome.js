import React from 'react';
import Document from 'components/common/Document';
import Component from 'components/Component';

class PageHome extends React.Component {
  render() {
    return (
      <Document title='Home | React component example' className='page-home'>
        <Component/>
      </Document>
    );
  }
}

export default PageHome;
