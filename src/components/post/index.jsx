import { Fragment } from 'react';
import { tval, tbval } from '@dsplay/template-utils';
import Info from '../info';
import UserProfile from '../user-profile';
import MediaSlider from '../media-slider';

const primaryColor = tval('primary_color', 'white');
const secondaryColor = tval('secondary_color', '#FFFF99');
const hashtagColor = tval('hashtag_color', secondaryColor);
const linkColor = tval('link_color', '#B9D0FF');
const mentionColor = tval('mention_color', secondaryColor);
const phoneColor = tval('phone_color', secondaryColor);
const textColor = tval('text_color', primaryColor);
const showInfo = tbval('show_info', true);
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
  center: {
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    margin: 'auto',
  },
};

function highlight(text = '') {
  let result = text;

  const hashtagRegex = /(#[^\s]+)/g;
  result = result.replace(hashtagRegex, (url) => `<span class="hashtag" style="color: ${hashtagColor}">${url}</span>`);

  const urlRegex = /(https?:\/\/[^\s]+)/g;
  result = result.replace(urlRegex, (url) => `<a href="${url}" style="color: ${linkColor};">${url}</a>`);

  const mentionRegex = /(@[^\s]+)/g;
  result = result.replace(mentionRegex, (url) => `<span class="mention" style="color: ${mentionColor}">${url}</span>`);

  const phoneRegex = /((\+\d{1,3})?\s?(\(\d{2}\))?\s?(\d\s?-?\.?){8,14}(\s|\b))/g;
  result = result.replace(phoneRegex, (url) => `<span class="mention" style="color: ${phoneColor}">${url}</span>`);

  result = result.replace(/\n/gm, () => '<br/>');

  return result;
}

function PostContent({
  id,
  text,
  info,
  ratio,
}) {
  return (
    <Fragment>
      <div className="text-wrapper" key={id}>
        <div className="text-ratio" style={{ fontSize: `${ratio}em` }}>
          {/* eslint-disable-next-line react/no-danger -- template text may contain highlighted hashtags/links/mentions */}
          <div style={{ color: textColor }} className="post-text" dangerouslySetInnerHTML={{ __html: highlight(text) }} />
        </div>
      </div>
      { showInfo && <Info {...info} /> }
    </Fragment>
  );
}

function PostMedia({
  type,
  urls: {
    md: url,
  },
}) {
  return (
    <div className="media" style={{ borderColor, backgroundImage: `url("${url}")` }}>
      { type === 'video' && <div className="playWrapper" /> }
      { overlay && <img alt="overlay" className="photo-overlay" src={overlay} style={{ ...overlayStyle[overlayPosition] }} /> }
    </div>
  );
}

function Post({
  text = '',
  media = [],
  user,
  duration,
  ...info
}) {
  const withMedia = media && media.length > 0;

  const sizeMap = {
    20: 2.5,
    50: 2.2,
    75: 1.9,
    100: 1.6,
    140: 1.3,
    200: 1,
  };

  let ratio = 1;

  const textLength = text.length + (text.match(/\n/g) || []).length * 35;

  const sizeKeys = Object.keys(sizeMap);
  for (let i = 0; i < sizeKeys.length; i += 1) {
    if (textLength <= +sizeKeys[i]) {
      ratio = sizeMap[sizeKeys[i]];
      break;
    }
  }

  const maxMediaToShow = Math.min(media.length, Math.max(1, Math.floor(duration / 1000)));

  return (
    <div className={`post ${withMedia ? 'with-media' : ''}`}>
      <UserProfile className="portrait" {...user} />

      { withMedia && media[0].type === 'image' && media.length > 1 && <MediaSlider media={media.slice(0, maxMediaToShow)} duration={Math.floor(duration / maxMediaToShow)} /> }
      { (withMedia && (media[0].type === 'video' || media.length === 1)) && <PostMedia {...media[0]} /> }

      <div className="content">
        <UserProfile className="landscape" {...user} />
        <PostContent text={text} info={info} ratio={ratio} />
      </div>
    </div>
  );
}

export default Post;
