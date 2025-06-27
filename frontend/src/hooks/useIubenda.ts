import { useState, useEffect, useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { clearAllTrackingData } from '../store/trackingSlice';

interface IubendaHookReturn {
    consentGiven: boolean | null;
    isLoading: boolean;
    checkConsent: () => boolean | null;
}

declare global {
    interface Window {
        _iub?: { cs?: { api?: { isConsentGiven: () => boolean | null } } };
        iubendaConsent?: boolean;
        iubendaConsentCallback?: (consent: boolean) => void;
    }
}

export const useIubenda = (): IubendaHookReturn => {
    const [consentGiven, setConsentGiven] = useState<boolean | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const dispatch = useDispatch();

    const checkConsent = useCallback((): boolean | null => {
        return window._iub?.cs?.api?.isConsentGiven?.() ?? window.iubendaConsent ?? null;
    }, []);

    const clearTrackingIfNeeded = useCallback(() => {
        if (process.env.REACT_APP_ENV === 'development') {
            console.log('Consent revoked - clearing all tracking data');
        }
        dispatch(clearAllTrackingData());
    }, [dispatch]);

    const handleConsentChange = useCallback((newConsent: boolean) => {
        if (process.env.REACT_APP_ENV === 'development') {
            console.log('Iubenda consent changed:', newConsent);
        }

        if (consentGiven === true && newConsent === false) {
            clearTrackingIfNeeded();
        }

        setConsentGiven(newConsent);
        setIsLoading(false);
    }, [consentGiven, clearTrackingIfNeeded]);

    useEffect(() => {
        window.iubendaConsentCallback = handleConsentChange;

        const initialConsent = checkConsent();
        if (initialConsent !== null) {
            handleConsentChange(initialConsent);
        } else {
            const timeout = setTimeout(() => {
                const delayedConsent = checkConsent();
                if (delayedConsent !== null) {
                    handleConsentChange(delayedConsent);
                } else {
                    setIsLoading(false);
                }
            }, 2000);

            return () => clearTimeout(timeout);
        }

        return () => {
            if (window.iubendaConsentCallback === handleConsentChange) {
                window.iubendaConsentCallback = undefined;
            }
        };
    }, [checkConsent, handleConsentChange]);

    useEffect(() => {
        if (!isLoading) return;

        const interval = setInterval(() => {
            const currentConsent = checkConsent();
            if (currentConsent !== null && currentConsent !== consentGiven) {
                handleConsentChange(currentConsent);
            }
        }, 1000);

        const timeout = setTimeout(() => {
            setIsLoading(false);
            clearInterval(interval);
        }, 10000);

        return () => {
            clearInterval(interval);
            clearTimeout(timeout);
        };
    }, [consentGiven, isLoading, checkConsent, handleConsentChange]);

    return {
        consentGiven,
        isLoading,
        checkConsent
    };
};
