// Components/PrivacyRedirect.jsx
import { useEffect } from 'react';

const PrivacyRedirect = ({ urlPath = 'legal?an=no&s_ck=false&newmarkup=yes' }) => {
  useEffect(() => {
    const iubendaId = process.env.REACT_APP_IUBENDA_ID;
    const redirectUrl = `https://www.iubenda.com/privacy-policy/${iubendaId}/${urlPath}`;
    window.location.href = redirectUrl;
  }, [urlPath]);

  return (
    <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '50vh' }}>
      <div className="text-center">
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="mt-3">Reindirizzamento alla Privacy Policy...</p>
      </div>
    </div>
  );
};

export default PrivacyRedirect;