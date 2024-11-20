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
Object.defineProperty(exports, "__esModule", { value: true });
const assert = __importStar(require("assert"));
const util_1 = require("../src/common/util");
describe("Util test suite", () => {
    // Test that the apply repacements util function works as expected
    it("Apply replacements", () => {
        let replacement = {};
        util_1.TelemetryUtil.applyReplacements(replacement, []);
        assert.deepStrictEqual(replacement, {});
        replacement = { valueA: "a", valueB: "b", "123": "123" };
        util_1.TelemetryUtil.applyReplacements(replacement, [{
                lookup: /[a]/gi,
                replacementString: "c"
            }]);
        assert.deepStrictEqual(replacement, { valueA: "c", valueB: "b", "123": "123" });
        replacement = { valueA: "a", valueB: "b", "123": "123" };
        util_1.TelemetryUtil.applyReplacements(replacement, [{
                lookup: /[a]/gi,
                replacementString: undefined
            }]);
        // Undefined replacement string should remove the key
        assert.deepStrictEqual(replacement, { valueB: "b", "123": "123" });
    });
    it("Telemetry util implements singleton", () => {
        const telemetryUtil1 = util_1.TelemetryUtil.getInstance();
        const telemetryUtil2 = util_1.TelemetryUtil.getInstance();
        assert.strictEqual(telemetryUtil1, telemetryUtil2);
    });
    // TODO - Add tests for when you just have telemetry configuration settings and no API
    // This is the hardest to shim and only in very old versions of VS Code
});
//# sourceMappingURL=util.test.js.map