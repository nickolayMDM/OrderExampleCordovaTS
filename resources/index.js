import React from 'react';
import ReactDOM from 'react-dom';
import App from './components/App.tsx';

const renderReactDom = () => {
    ReactDOM.render(<App />, document.getElementById('root'));
};

if (window.cordova) {
    document.addEventListener('deviceready', () => {
        window.screen.orientation.lock('portrait');
        renderReactDom();
    }, false);
} else {
    renderReactDom();
}