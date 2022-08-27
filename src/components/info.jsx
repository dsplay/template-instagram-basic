import React from 'react';
import QRCode from 'qrcode.react';
import moment from 'moment';
import 'moment/locale/pt-br';
import 'moment/locale/pt';
import 'moment/locale/fr';
import 'moment/locale/es';
import 'moment/locale/de';
import { config } from '@dsplay/template-utils';

function Info({
    link = 'https://dsplay.tv',
    created = new Date().toDateString(),
    className = '',
}) {
    moment.locale('en');
    const { locale, osVersion } = config;

    const w = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
    const h = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
    const smallDim = Math.min(w, h);
    const qrCodeBottomPadding = osVersion < 17 ? '1rem' : '0';

    if (locale) {
        moment.locale(locale);
    }

    return (
        <div className={`info-container ${className}`}>
            <div className="info-box">
                { 
                    link && 
                    <div className="qrcode-container" style={{ paddingBottom: qrCodeBottomPadding }}><QRCode size={17 * (smallDim / 100)} value={link} /></div>
                }
                <div className="info">
                    <span className="created-at">{moment(created).format('L')}</span><br/>
                    <span className="created-at">{moment(created).format('HH:mm:ss')}</span>
                </div>
            </div>
        </div>
    )
}

export default Info;