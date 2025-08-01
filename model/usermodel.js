const { DataTypes } = require("sequelize");
const { sequelize } = require("../db/database");

const User = sequelize.define(
    "User",
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        username: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
        },
        email: {
            type: DataTypes.STRING,
            allowNull:false,
            unique:true,
            validate: {
                isEmail:true,
            },
        },

        image:{
        type:DataTypes.STRING,
        allowNull:true,
        },

        password: {
            type: DataTypes.STRING,
            allowNull: false,
        },

        role:{
            type:DataTypes.ENUM("user","admin"),
            defaultValue:"user",
            allowNull:false,
        },
        
    }, 
    {
        tableName:"users",
        timestamps:true,
    }
);
module.exports = User;
