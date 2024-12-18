/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
import { BreezeChannelIdentifier } from "@microsoft/applicationinsights-common";
import { TelemetryUtil } from "./util";
export const appInsightsClientFactory = async (connectionString, machineId, sessionId, xhrOverride, replacementOptions) => {
    let appInsightsClient;
    try {
        const basicAISDK = await import /* webpackMode: "eager" */("@microsoft/applicationinsights-web-basic");
        const extensionConfig = {};
        if (xhrOverride) {
            // Configure the channel to use a XHR Request override since it's not available in node
            const channelConfig = {
                alwaysUseXhrOverride: true,
                httpXHROverride: xhrOverride
            };
            extensionConfig[BreezeChannelIdentifier] = channelConfig;
        }
        appInsightsClient = new basicAISDK.ApplicationInsights({
            connectionString: connectionString,
            disableAjaxTracking: true,
            disableExceptionTracking: true,
            disableFetchTracking: true,
            disableCorrelationHeaders: true,
            disableCookiesUsage: true,
            autoTrackPageVisitTime: false,
            emitLineDelimitedJson: false,
            disableInstrumentationKeyValidation: true,
            extensionConfig,
        });
    }
    catch (e) {
        return Promise.reject(e);
    }
    // Sets the appinsights client into a standardized form
    const telemetryClient = {
        logEvent: (eventName, data) => {
            const properties = { ...data?.properties, ...data?.measurements };
            if (replacementOptions?.length) {
                TelemetryUtil.applyReplacements(properties, replacementOptions);
            }
            appInsightsClient?.track({
                name: eventName,
                data: properties,
                baseType: "EventData",
                ext: { user: { id: machineId, authId: machineId }, app: { sesId: sessionId } },
                baseData: { name: eventName, properties: data?.properties, measurements: data?.measurements }
            });
        },
        flush: async () => {
            appInsightsClient?.flush(false);
        },
        dispose: async () => {
            const unloadPromise = new Promise((resolve) => {
                appInsightsClient?.unload(true, () => {
                    resolve();
                    appInsightsClient = undefined;
                }, 1000);
            });
            return unloadPromise;
        }
    };
    return telemetryClient;
};
//# sourceMappingURL=appInsightsClientFactory.js.map