import { useLayoutEffect } from 'react';
import { useConfig, useMedia, useTemplateVal, useTemplateBoolVal } from '@dsplay/react-template-utils';
import Posts from '../posts';
import logo from '../../images/ig-logo.png';

function App() {
  const horizontalBackground = useTemplateVal('bg_horizontal');
  const verticalBackground = useTemplateVal('bg_vertical');
  const showLogo = useTemplateBoolVal('show_instagram_icon', true);
  const showInfo = useTemplateBoolVal('show_info', true);
  const primaryColor = useTemplateVal('primary_color', 'white');

  const { orientation, width, height } = useConfig();
  const isVertical = orientation === 'portrait';

  const {
    result: {
      data: {
        user,
        posts,
      },
    },
    duration,
    postCount = Math.max(1, Math.floor(duration / 10000)),
  } = useMedia();

  useLayoutEffect(() => {
    if (horizontalBackground) {
      document.body.style.backgroundImage = `url("${horizontalBackground}")`;
      if (verticalBackground && isVertical) {
        document.body.style.backgroundImage = `url("${verticalBackground}")`;
      }
    } else if (verticalBackground) {
      document.body.style.backgroundImage = `url("${verticalBackground}")`;
    }
  }, [horizontalBackground, verticalBackground, isVertical]);

  useLayoutEffect(() => {
    document.querySelector('.App').classList.add('fadeIn');
    document.querySelector('.App').style.opacity = 1;
    document.body.style.color = primaryColor;
  }, [primaryColor]);

  const selectedPosts = posts.slice(0, postCount);
  const pageDuration = Math.floor((duration - 500) / Math.max(1, selectedPosts.length));

  return (
    <div className={`App ${showInfo ? '' : 'no-info'}`}>
      {
        showLogo && showInfo
        && <img className="logo" alt="logo" src={logo} />
      }
      <div className="debug">{orientation}({width}x{height})</div>
      <Posts user={user} posts={selectedPosts} pageDuration={pageDuration} />
    </div>
  );
}

export default App;
