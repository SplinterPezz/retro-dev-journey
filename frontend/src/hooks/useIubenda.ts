import { useEffect, useCallback } from 'react';
import { setConsentGiven as setConsentInStore } from '../store/consentSlice';
import { clearAllTrackingData } from '../store/trackingSlice';
import { useAppDispatch } from '../store/hooks';

declare global {
    interface Window {
        _iub?: {
            cs?: {
                api?: {
                    isConsentGiven: () => boolean;
                };
            };
        };
        iubendaConsent?: boolean;
        iubendaConsentCallback?: (consent: boolean) => void;
        iubendaConsentFirstGiven?: (consent: boolean) => void;
        iubendaPreferenceExpressed?: (consent: boolean) => void;
        iubendaConsentChanged?: (consent: boolean) => void;
    }
}

const checkConsent = (): boolean | null => {
    if (typeof window._iub?.cs?.api?.isConsentGiven !== 'function') {
        return null;
    }

    try {
        return window._iub.cs.api.isConsentGiven() ?? window.iubendaConsent ?? null;
    } catch (error) {
        console.warn('Error calling isConsentGiven:', error);
        return null;
    }
};

export const useIubenda = () => {
    const dispatch = useAppDispatch();

    const updateConsent = useCallback((newConsent: boolean | null) => {
        if (newConsent === null) return;

        if (newConsent === false) {
            dispatch(clearAllTrackingData());
        }

        dispatch(setConsentInStore(newConsent));
    }, [dispatch]);

    useEffect(() => {
        const handler = (consent: boolean) => updateConsent(consent);

        window.iubendaConsentCallback = handler;
        window.iubendaConsentFirstGiven = handler;
        window.iubendaPreferenceExpressed = handler;
        window.iubendaConsentChanged = handler;

        // The iubenda script loads async: if its API is not there yet, ask again shortly.
        let retry: ReturnType<typeof setTimeout> | undefined;
        const initialConsent = checkConsent();
        if (initialConsent !== null) {
            updateConsent(initialConsent);
        } else {
            retry = setTimeout(() => {
                const delayedConsent = checkConsent();
                if (delayedConsent !== null) updateConsent(delayedConsent);
            }, 2000);
        }

        return () => {
            clearTimeout(retry);
            window.iubendaConsentCallback = undefined;
            window.iubendaConsentFirstGiven = undefined;
            window.iubendaPreferenceExpressed = undefined;
            window.iubendaConsentChanged = undefined;
        };
    }, [updateConsent]);
};
