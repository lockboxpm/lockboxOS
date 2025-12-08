import React, { useState, useEffect } from 'react';
import Panel from '../Panel';

interface SystemInfo {
    browser: string;
    os: string;
    platform: string;
    language: string;
    screenSize: string;
    cookiesEnabled: boolean;
    availableCookies: string;
}

const ConsolePanel: React.FC = () => {
    const [info, setInfo] = useState<SystemInfo | null>(null);

    useEffect(() => {
        // This effect runs on the client-side after the component mounts
        const getOS = (userAgent: string): string => {
            if (/Windows/i.test(userAgent)) return "Windows";
            if (/Macintosh|Mac OS/i.test(userAgent)) return "macOS";
            if (/Linux/i.test(userAgent)) return "Linux";
            if (/Android/i.test(userAgent)) return "Android";
            if (/iPhone|iPad|iPod/i.test(userAgent)) return "iOS";
            return "Unknown";
        };

        const getBrowser = (userAgent: string): string => {
            if (/Firefox/i.test(userAgent)) return "Firefox";
            if (/Chrome/i.test(userAgent) && !/Edg/i.test(userAgent)) return "Chrome";
            if (/Safari/i.test(userAgent) && !/Chrome/i.test(userAgent)) return "Safari";
            if (/Edg/i.test(userAgent)) return "Edge";
            if (/MSIE|Trident/i.test(userAgent)) return "Internet Explorer";
            return "Unknown";
        }

        const userAgent = navigator.userAgent;
        const systemInfo: SystemInfo = {
            browser: getBrowser(userAgent),
            os: getOS(userAgent),
            platform: navigator.platform,
            language: navigator.language,
            screenSize: `${window.screen.width}x${window.screen.height}`,
            cookiesEnabled: navigator.cookieEnabled,
            availableCookies: document.cookie || "(none detected)",
        };
        setInfo(info);
    }, []);

    const renderInfoLine = (label: string, value: string | boolean) => (
        <p className="font-mono text-sm">
            <span className="text-cyan-400">{label.padEnd(20, ' ')}:</span>
            <span className="text-slate-300">{String(value)}</span>
        </p>
    );

    return (
        <Panel title="~/system_console">
            <div className="space-y-4">
                <div className="bg-black/50 p-6 rounded-lg border border-slate-700">
                    <div className="border-b border-slate-600 pb-2 mb-4">
                        <p className="font-mono text-green-400">Welcome, {info ? info.browser : 'user'}. Session information follows:</p>
                    </div>
                    {info ? (
                        <div className="space-y-2">
                            {renderInfoLine("Detected Browser", info.browser)}
                            {renderInfoLine("Detected OS", info.os)}
                            {renderInfoLine("Navigator Platform", info.platform)}
                            {renderInfoLine("Language", info.language)}
                            {renderInfoLine("Screen Resolution", info.screenSize)}
                            {renderInfoLine("Cookies Enabled", info.cookiesEnabled)}
                            {renderInfoLine("Available Cookies", info.availableCookies)}
                        </div>
                    ) : (
                        <p className="text-slate-500 animate-pulse">Gathering system info...</p>
                    )}
                     <div className="border-t border-slate-600 pt-2 mt-4">
                        <p className="font-mono text-xs text-slate-500">Note: Cookie access is limited for privacy. Only non-HttpOnly cookies set by this domain are visible.</p>
                    </div>
                </div>
            </div>
        </Panel>
    );
};

export default ConsolePanel;
