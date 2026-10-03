import React, { useEffect } from 'react';
import { iubendaPolicyId } from '../../config/env';

const PRIVACY_POLICY = 'legal?an=no&s_ck=false&newmarkup=yes';
const COOKIE_POLICY = 'cookie-policy?an=no&s_ck=false&newmarkup=yes';

// Short URLs on our domain that forward to the policies hosted by iubenda.
export const privacyRedirects: { path: string; urlPath: string }[] = [
  ...['/privacy-policy', '/policy', '/privacy'].map((path) => ({ path, urlPath: PRIVACY_POLICY })),
  ...['/cookie', '/cookies', '/cookie-policy'].map((path) => ({ path, urlPath: COOKIE_POLICY })),
];

const PrivacyRedirect: React.FC<{ urlPath: string }> = ({ urlPath }) => {
  useEffect(() => {
    window.location.href = `https://www.iubenda.com/privacy-policy/${iubendaPolicyId}/${urlPath}`;
  }, [urlPath]);

  return (
    <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '50vh' }}>
      <div className="text-center">
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="mt-3">Redirecting to the policy page...</p>
      </div>
    </div>
  );
};

export default PrivacyRedirect;
