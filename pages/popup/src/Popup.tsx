import '@src/Popup.css';
import { withErrorBoundary, withSuspense } from '@extension/shared';
import { useEffect, useState } from 'react';

const BASE_URL = `https://app.supergpt.chat`;

const Popup = () => {
  const [userStatus, setUserStatus] = useState('Free');
  const getAccountStatus = async (email: string) => {
    try {
      const res = await fetch(`${BASE_URL}/user/valid`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      const { valid } = data;
      if (valid) {
        return 'Pro';
      } else {
        return 'Free';
      }
    } catch (e) {
      console.log(e);
      return 'Free';
    }
  };

  const checkUserStatus = async () => {
    const { userEmail } = await chrome.storage.local.get('userEmail');
    if (userEmail) {
      const plan = await getAccountStatus(userEmail);
      setUserStatus(plan);
    }
  };

  useEffect(() => {
    checkUserStatus();
  }, []);

  return (
    <div style={{ backgroundColor: '#000628', height: '100%', padding: '1rem' }}>
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center' }}>
          <img src={chrome.runtime.getURL('popup/supergpt-logo.png')} alt="SuperGPT Logo" height={30} width={30} />
          <div style={{ color: 'white', fontWeight: 'bolder', fontSize: '20px', marginLeft: '10px' }}>SuperGPT</div>
        </div>
        <div style={{ alignItems: 'center', display: 'flex', flexDirection: 'column', marginTop: '40px' }}>
          <div style={{ color: 'white', fontSize: '15px' }}>
            You are on <span style={{ fontWeight: 'bold' }}>{userStatus === 'Free' ? 'Free' : '⚡️ Pro'} plan</span>
          </div>
          {userStatus === 'Free' && (
            <div
              onClick={() => {
                window.open('https://supergpt.chat/#pricing');
              }}
              style={{
                backgroundColor: '#fce643',
                padding: '0.5rem',
                borderRadius: '0.25rem',
                marginTop: '1rem',
                cursor: 'pointer',
                fontWeight: 'bold',
              }}>
              Upgrade to Pro
            </div>
          )}
        </div>
        <div style={{ color: 'white', marginTop: '3rem', textAlign: 'center', fontSize: '14px' }}>
          Join SuperGPT{' '}
          <a href="https://discord.gg/N48UUgWaVG" target="_blank" style={{ color: 'yellow', fontWeight: 'bold' }}>
            Discord server
          </a>{' '}
          for support and updates.
        </div>
      </div>
    </div>
  );
};

export default withErrorBoundary(withSuspense(Popup, <div> Loading ... </div>), <div> Error Occur </div>);
