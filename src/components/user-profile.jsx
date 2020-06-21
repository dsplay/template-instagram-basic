import React from 'react';
import { tval, tbval } from '@dsplay/template-utils';
import logo from '../images/ig-logo.png';

const showLogo = tbval('show_instagram_icon', true);
const showInfo = tbval('show_info', true);

const primaryColor = tval('primary_color', 'white');
const fullNameColor = tval('user_full_name_color', primaryColor);

const secondaryColor = tval('secondary_color', '#FFFF99');
const screenNameColor = tval('user_screen_name_color', secondaryColor);

const defaultPic = tval('profile_picture');
const defaultUserScreenName = tval('user_screen_name');

function UserProfile({
    name,
    username,
    pic,
    className,
}) {

    const finalName = name || defaultUserScreenName;
    const finalPic = pic || defaultPic;

    return (
        <div className={`user-profile ${className}`}>
            <div className="user-picture" style={{ backgroundImage: `url("${finalPic}")` }}>
                {
                    showLogo && !showInfo &&
                    <img className="logo" alt="logo" src={logo}/>
                }
            </div>
            <div className="user-info">
                <span className="user-name" style={{ color: fullNameColor }}>{finalName}</span>
                <span className="user-screen-name" style={{ color: screenNameColor }}>@{username}</span>
            </div>
        </div>
    )
}

export default UserProfile;