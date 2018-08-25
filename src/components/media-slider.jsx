import React, { Component } from 'react';

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
        const { media = [], type } = this.props;
        const { sliding, img1, img2 } = this.state;

        return (
            <div className="media">
                <div className={`media-slider ${sliding ? 'slide' : ''}`}>
                    <div className="media-item" style={{ backgroundImage: `url("${media[img1].urls.md}")`}} >
                        {/* s: {sliding.toString()}<br/>
                        img1: {img1}<br/>
                        img2: {img2} */}
                    </div>
                    {
                        media.length > 1 &&
                        <div className="media-item" style={{ backgroundImage: `url("${media[img2].urls.md}")`}} >
                            {/* s: {sliding.toString()}<br/>
                            img1: {img1}<br/>
                            img2: {img2} */}
                        </div>
                    }
                </div>
            </div>
        );
    }

}

export default MediaSlider;