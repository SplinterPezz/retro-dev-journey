import { useEffect, useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { setConsentGiven as setConsentInStore } from '../store/consentSlice';
import { clearAllTrackingData } from '../store/trackingSlice';

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

export const useIubenda = () => {
    const dispatch = useDispatch();

    const updateConsent = useCallback((newConsent: boolean | null) => {
        if (newConsent === null) return;

        if (newConsent === false) {
            dispatch(clearAllTrackingData());
        }

        dispatch(setConsentInStore(newConsent));
    }, [dispatch]);

    const checkConsent = useCallback((): boolean | null => {
    if (
        !window._iub || 
        !window._iub.cs || 
        !window._iub.cs.api || 
        typeof window._iub.cs.api.isConsentGiven !== 'function'
    ) {
        return null;
    }

    try {
        return window._iub.cs.api.isConsentGiven() ?? window.iubendaConsent ?? null;
    } catch (error) {
        console.warn('Error calling isConsentGiven:', error);
        return null;
    }
}, []);

    useEffect(() => {
        // Set callback handlers for iubenda events
        const handler = (consent: boolean) => updateConsent(consent);

        window.iubendaConsentCallback = handler;
        window.iubendaConsentFirstGiven = handler;
        window.iubendaPreferenceExpressed = handler;
        window.iubendaConsentChanged = handler;

        const initialConsent = checkConsent();
        if (initialConsent !== null) {
            updateConsent(initialConsent);
        } else {
            // Optionally, fallback or timeout if consent not available immediately
            setTimeout(() => {
                const delayedConsent = checkConsent();
                if (delayedConsent !== null) updateConsent(delayedConsent);
            }, 2000);
        }

        return () => {
            window.iubendaConsentCallback = undefined;
            window.iubendaConsentFirstGiven = undefined;
            window.iubendaPreferenceExpressed = undefined;
            window.iubendaConsentChanged = undefined;
        };
    }, [checkConsent, updateConsent]);
};
