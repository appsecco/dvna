"use strict";

module.exports = function (sequelize, DataTypes) {
    var Passreset = sequelize.define("Passreset", {
        userId: {
            type: DataTypes.INTEGER
        },
        requestedAt: {
            type: DataTypes.DATE
        },
        tokenHash: {
            type: DataTypes.STRING
        },
        used: {
            type: DataTypes.BOOLEAN
        }
    });
    return Passreset;
};