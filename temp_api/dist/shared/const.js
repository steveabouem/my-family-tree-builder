"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.KinshipEnum = exports.MaritalStatus = exports.Gender = void 0;
// Common utility types and enums
var Gender;
(function (Gender) {
    Gender[Gender["Male"] = 1] = "Male";
    Gender[Gender["Female"] = 2] = "Female";
})(Gender = exports.Gender || (exports.Gender = {}));
var MaritalStatus;
(function (MaritalStatus) {
    MaritalStatus["Single"] = "single";
    MaritalStatus["Married"] = "married";
    MaritalStatus["Divorced"] = "divorced";
    MaritalStatus["Widowed"] = "widowed";
    MaritalStatus["Separated"] = "separated";
})(MaritalStatus = exports.MaritalStatus || (exports.MaritalStatus = {}));
var KinshipEnum;
(function (KinshipEnum) {
    KinshipEnum["sibling"] = "sibling";
    KinshipEnum["parent"] = "parent";
    KinshipEnum["spouse"] = "spouse";
    KinshipEnum["child"] = "child";
})(KinshipEnum = exports.KinshipEnum || (exports.KinshipEnum = {}));
