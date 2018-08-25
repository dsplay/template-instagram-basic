import React from 'react';
import Info from './info';
import UserProfile from './user-profile';
import MediaSlider from './media-slider';
import { tval } from '../util/template';

const hashtagColor = tval('hashtag_color', '#FFFF99');
const linkColor = tval('link_color', '#B9D0FF');
const mentionColor = tval('mention_color', '#FFFF99');
const phoneColor = tval('phone_color', '#FFFF99');
const primaryColor = tval('primary_color', 'white');
const textColor = tval('text_color', primaryColor);

const settings = {
    dots: false,
    arrows: false,
    infinite: false,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 2000
};

function highlight(text = '') {
    const hashtagRegex = /(#[^\s]+)/g;
    text = text.replace(hashtagRegex, function(url) {
        return `<span class="hashtag" style="color: ${hashtagColor}">${url}</span>`;
    });
    
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    text = text.replace(urlRegex, function(url) {
        return `<a href="${url}" style="color: ${linkColor};">${url}</a>`;
    });

    const mentionRegex = /(@[^\s]+)/g;
    text = text.replace(mentionRegex, function(url) {
        return `<span class="mention" style="color: ${mentionColor}">${url}</span>`;
    });

    const phoneRegex = /((\+\d{1,3})?\s?(\(\d{2}\))?\s?(\d\s?-?\.?){8,14}(\s|\b))/g;
    text = text.replace(phoneRegex, function(url) {
        return `<span class="mention" style="color: ${phoneColor}">${url}</span>`;
    });

    text = text.replace(/\n/gm, function() {
        return '<br/>';
    });

    return text;
}

function PostContent({
    id,
    text,
    info,
    ratio,
}) {
    return (
        <React.Fragment>
            <div className="text-wrapper" key={id}>
                <div className="text-ratio" style={{ fontSize: `${ratio}em` }}>
                    <div style={{ color: textColor }} className="post-text" dangerouslySetInnerHTML={{ __html: highlight(text) }} />
                </div>
            </div> 
            <Info {...info} />
        </React.Fragment>
    );
}

const PostMedia = ({
    type,
    urls: {
        md: url,
    },
}) => (
    <div className="media" style={{ backgroundImage: `url("${url}")`}}>
        { type === 'video' && <div className="playWrapper"/> }
    </div>
);

function Post({
    text = '',
    media = [],
    user,
    duration,
    ...info
}) {

    const withMedia = media && media.length > 0;

    const sizeMap = {
        '20': 2.5,
        '50': 2.2,
        '75': 1.9,
        '100': 1.6,
        '140': 1.3,
        '200': 1,
    };

    let ratio = 1;

    const textLength = text.length + (text.match(/\n/g) || []).length * 35;

    const sizeKeys = Object.keys(sizeMap);
    for (let i = 0; i < sizeKeys.length; i++) {
        if (textLength <= +sizeKeys[i]) {
            ratio = sizeMap[sizeKeys[i]];
            break;
        }
    }

    // console.log('length:', text.length, textLength, 'ratio:', ratio);

    const maxMediaToShow = Math.min(media.length, Math.max(1, Math.floor(duration / 1000)));

    return (
        <div className={`post ${withMedia ? 'with-media' : ''}`}>
            <UserProfile className="portrait" {...user} />

            { withMedia && media[0].type === 'image' && media.length > 1 && <MediaSlider media={media.slice(0, maxMediaToShow)} duration={Math.floor(duration / maxMediaToShow)} /> }
            { (withMedia && (media[0].type === 'video' || media.length === 1 )) && <PostMedia {...media[0]} /> }
            
            <div className="content">
            
                <UserProfile className="landscape" {...user} />
                <PostContent text={text} info={info} ratio={ratio} />
            </div>

        </div>
    )
}

export default Post;