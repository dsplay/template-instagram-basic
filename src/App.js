import React, { Component } from 'react';
import './App.css';
import Posts from './components/posts';
import logo from './images/ig-logo.png';
import { tval, tbval } from './util/template';

const { orientation } = window.dsplay_config || window.config;

// one time template config
const horizontalBackground = tval('bg_horizontal');
const verticalBackground = tval('bg_vertical');

if (horizontalBackground) {
    document.body.style.backgroundImage = `url("${horizontalBackground}")`;
    if (verticalBackground && orientation === 'portrait') {
        document.body.style.backgroundImage = `url("${verticalBackground}")`;    
    }
} else if (verticalBackground) {
    document.body.style.backgroundImage = `url("${verticalBackground}")`;
}

class App extends Component {
    componentDidMount() {
        document.querySelector('.App').classList.add('fadeIn');
        document.querySelector('.App').style.opacity = 1;

        const primaryColor = tval('primary_color', 'white');
        document.body.style.color = primaryColor;

        if (!tbval('show_instagram_icon', true)) {
            document.querySelector('#logo').style.display = 'none';
        }
    }

    render() {

        const {
            result: {
                data: {
                    user,
                    posts,
                }
            },
            duration,
            postCount = Math.max(1, Math.floor(duration / 10000)),
        } = window.media;

        const {
            orientation,
            width,
            height,
        } = window.config;

        // console.log(postCount);

        const selectedPosts = posts.slice(0, postCount);
        // const selectedPosts = posts.slice(4, 5);

        // console.log(selectedPosts);
        const pageDuration = Math.floor((duration - 500) / Math.max(1, selectedPosts.length));
        // console.log(pageDuration);

        return (
            <div className="App">
                <img id="logo" src={logo}/>
                <div className="debug">{orientation}({width}x{height})</div>
                <Posts user={user} posts={selectedPosts} pageDuration={pageDuration}/>
            </div>
        );
    }
}

export default App;
