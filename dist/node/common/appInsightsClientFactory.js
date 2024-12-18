"use strict";
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.appInsightsClientFactory = void 0;
const applicationinsights_common_1 = require("@microsoft/applicationinsights-common");
const util_1 = require("./util");
const appInsightsClientFactory = async (connectionString, machineId, sessionId, xhrOverride, replacementOptions) => {
    let appInsightsClient;
    try {
        const basicAISDK = await Promise.resolve().then(() => __importStar(require("@microsoft/applicationinsights-web-basic")));
        const extensionConfig = {};
        if (xhrOverride) {
            // Configure the channel to use a XHR Request override since it's not available in node
            const channelConfig = {
                alwaysUseXhrOverride: true,
                httpXHROverride: xhrOverride
            };
            extensionConfig[applicationinsights_common_1.BreezeChannelIdentifier] = channelConfig;
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
                util_1.TelemetryUtil.applyReplacements(properties, replacementOptions);
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
exports.appInsightsClientFactory = appInsightsClientFactory;
//# sourceMappingURL=appInsightsClientFactory.js.map