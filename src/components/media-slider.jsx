import React, { Component } from 'react';
import { tval } from '@dsplay/template-utils';

const secondaryColor = tval('secondary_color', 'rgb(240, 197, 231)');
const borderColor = tval('border_color', secondaryColor);
const overlay = tval('overlay');
const overlayPosition = tval('overlay_position', 'top-left');

const overlayStyle = {
    'top-right': {
        top: 0,
        right: 0,
    },
    'bottom-right': {
        bottom: 0,
        right: 0,
    },
    'bottom-left': {
        bottom: 0,
        left: 0,
    },
    'top-left': {
        top: 0,
        left: 0,
    },
    'center': {
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
        margin: 'auto',
    },
}

class MediaSlider extends Component {

    state = {
        sliding: false,
        img1: 0,
        img2: 1,
    }
    
    componentDidMount() {
        const { media = [], duration } = this.props;

        if (media.length > 1) {
            setTimeout(this.slide, duration);
        }
    }

    slide = () => {
        const { media = [], duration } = this.props;
        const size = media.length;
        const { img2 } = this.state;

        this.setState({
            sliding: true,
        }, () => setTimeout(() => {
            this.setState(prev => ({
                sliding: false,
                img1: (prev.img1 + 1) % size,
                img2: (prev.img2 + 1) % size,
            }));
        }, 800));

        if (img2 < media.length - 1) {
            setTimeout(this.slide, duration);
        }
    }

    render() {
        const { media = [] } = this.props;
        const { sliding, img1, img2 } = this.state;

        return (
            <div className="media" style={{ borderColor: borderColor }}>
                
                <div className={`media-slider ${sliding ? 'slide' : ''}`}>
                    <div className="media-item" style={{ backgroundImage: `url("${media[img1].urls.md}")`}} >
                        {/* s: {sliding.toString()}<br/>
                        img1: {img1}<br/>
                        img2: {img2} */}
                        { overlay && <img alt="" className="photo-overlay" style={{ ...overlayStyle[overlayPosition] }} src={overlay}/> }
                    </div>
                    {
                        media.length > 1 &&
                        <div className="media-item" style={{ backgroundImage: `url("${media[img2].urls.md}")`}} >
                            {/* s: {sliding.toString()}<br/>
                            img1: {img1}<br/>
                            img2: {img2} */}
                            { overlay && <img alt="" className="photo-overlay" style={{ ...overlayStyle[overlayPosition] }} src={overlay}/> }
                        </div>
                    }
                </div>
            </div>
        );
    }

}

export default MediaSlider;