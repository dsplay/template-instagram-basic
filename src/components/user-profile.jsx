import React from 'react';
import { tval, tbval } from '@dsplay/template-utils';
import logo from '../images/ig-logo.png';

const showLogo = tbval('show_instagram_icon', true);
const showInfo = tbval('show_info', true);

const primaryColor = tval('primary_color', 'white');
const fullNameColor = tval('user_full_name_color', primaryColor);

const secondaryColor = tval('secondary_color', '#FFFF99');
const screenNameColor = tval('user_screen_name_color', secondaryColor);

function UserProfile({
    name,
    username,
    pic,
    className,
}) {
    return (
        <div className={`user-profile ${className}`}>
            <div className="user-picture" style={{ backgroundImage: `url("${pic}")` }}>
                {
                    showLogo && !showInfo &&
                    <img className="logo" alt="logo" src={logo}/>
                }
            </div>
            <div className="user-info">
                <span className="user-name" style={{ color: fullNameColor }}>{name}</span>
                <span className="user-screen-name" style={{ color: screenNameColor }}>@{username}</span>
            </div>
        </div>
    )
}

export default UserProfile;