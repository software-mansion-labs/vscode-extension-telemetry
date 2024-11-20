"use strict";
/*---------------------------------------------------------
 * Copyright (C) Microsoft Corporation. All rights reserved.
 *--------------------------------------------------------*/
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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/* eslint-disable @typescript-eslint/ban-ts-comment */
const baseTelemetrySender_1 = require("../src/common/baseTelemetrySender");
const sinon = __importStar(require("sinon"));
const assert_1 = __importDefault(require("assert"));
describe("Base telemetry sender test suite", () => {
    const telemetryClient = {
        logEvent: sinon.spy(),
        flush: sinon.spy(),
        dispose: sinon.spy(),
    };
    const telemetryClientFactory = async () => {
        return telemetryClient;
    };
    beforeEach(() => {
        // Reset history on the stubs
        telemetryClient.logEvent.resetHistory();
        telemetryClient.flush.resetHistory();
    });
    it("Log functions add to queue if not instantiated", () => {
        const sender = new baseTelemetrySender_1.BaseTelemetrySender("key", telemetryClientFactory);
        sender.sendEventData("eventName", {});
        //@ts-ignore (needed to spy on private properties)
        assert_1.default.strictEqual(sender._eventQueue.length, 1);
        //@ts-ignore (needed to spy on private properties)
        assert_1.default.strictEqual(telemetryClient.logEvent.callCount, 0);
    });
    it("Log functions call client if instantiated", async () => {
        const sender = new baseTelemetrySender_1.BaseTelemetrySender("key", telemetryClientFactory);
        sender.instantiateSender();
        // Wait 10ms to ensure that the sender has instantiated the client
        await new Promise((resolve) => setTimeout(resolve, 10));
        sender.sendEventData("eventName", {});
        //@ts-ignore (needed to spy on private properties)
        assert_1.default.strictEqual(sender._eventQueue.length, 0);
        //@ts-ignore (needed to spy on private properties)
        assert_1.default.strictEqual(sender._exceptionQueue.length, 0);
        assert_1.default.strictEqual(telemetryClient.logEvent.callCount, 1);
    });
    it("Queues are flushed upon instantiation", async () => {
        const sender = new baseTelemetrySender_1.BaseTelemetrySender("key", telemetryClientFactory);
        sender.sendEventData("eventName", {});
        // Should cause a flush
        sender.instantiateSender();
        // Wait 10ms to ensure that the sender has instantiated the client
        await new Promise((resolve) => setTimeout(resolve, 10));
        //@ts-ignore (needed to spy on private properties)
        assert_1.default.strictEqual(sender._eventQueue.length, 0);
        //@ts-ignore (needed to spy on private properties)
        assert_1.default.strictEqual(sender._exceptionQueue.length, 0);
        assert_1.default.strictEqual(telemetryClient.logEvent.callCount, 1);
    });
    describe("Send error data logic", () => {
        let sender;
        beforeEach(async () => {
            sender = new baseTelemetrySender_1.BaseTelemetrySender("key", telemetryClientFactory);
            sender.instantiateSender();
            // Wait 10ms to ensure that the sender has instantiated the client
            await new Promise((resolve) => setTimeout(resolve, 10));
        });
        it("Error properties are correctly created for an empty data argument", () => {
            const error = new Error("test");
            sender.sendErrorData(error);
            assert_1.default.strictEqual(telemetryClient.logEvent.callCount, 1);
            sinon.assert.calledWithMatch(telemetryClient.logEvent, "unhandlederror", { properties: { name: error.name, message: error.message, stack: error.stack } });
        });
        it("Error properties are correctly created for a data without properties field", () => {
            const error = new Error("test");
            sender.sendErrorData(error, { prop1: 1, prop2: "two" });
            assert_1.default.strictEqual(telemetryClient.logEvent.callCount, 1);
            sinon.assert.calledWithMatch(telemetryClient.logEvent, "unhandlederror", { properties: { prop1: 1, prop2: "two", name: error.name, message: error.message, stack: error.stack } });
        });
        it("Error properties are correctly created for a data with properties field", () => {
            const error = new Error("uh oh");
            sender.sendErrorData(error, { properties: { prop1: 1, prop2: "two" } });
            assert_1.default.strictEqual(telemetryClient.logEvent.callCount, 1);
            sinon.assert.calledWithMatch(telemetryClient.logEvent, "unhandlederror", { properties: { prop1: 1, prop2: "two", name: error.name, message: error.message, stack: error.stack } });
        });
    });
});
//# sourceMappingURL=baseTelemetrySender.test.js.map