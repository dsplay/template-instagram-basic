import { useTemplateVal, useTemplateBoolVal } from '@dsplay/react-template-utils';
import logo from '../../images/ig-logo.png';

function UserProfile({
  name,
  username,
  pic,
  className,
  noPic,
}) {
  const showLogo = useTemplateBoolVal('show_instagram_icon', true);
  const showInfo = useTemplateBoolVal('show_info', true);

  const primaryColor = useTemplateVal('primary_color', 'white');
  const fullNameColor = useTemplateVal('user_full_name_color', primaryColor);

  const secondaryColor = useTemplateVal('secondary_color', '#FFFF99');
  const screenNameColor = useTemplateVal('user_screen_name_color', secondaryColor);

  const defaultPic = useTemplateVal('profile_picture');
  const defaultUserScreenName = useTemplateVal('user_screen_name');

  const finalName = name || defaultUserScreenName;
  const finalPic = noPic ? defaultPic : pic;

  return (
    <div className={`user-profile ${className}`}>
      <div className="user-picture" style={{ backgroundImage: `url("${finalPic}")` }}>
        {
          showLogo && !showInfo
          && <img className="logo" alt="logo" src={logo} />
        }
      </div>
      <div className="user-info">
        <span className="user-name" style={{ color: fullNameColor }}>{finalName}</span>
        <span className="user-screen-name" style={{ color: screenNameColor }}>
          @
          {username}
        </span>
      </div>
    </div>
  );
}

export default UserProfile;
