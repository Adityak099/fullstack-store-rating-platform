export default (sequelize, DataTypes) => {
    const User = sequelize.define('User', {
        name: {
            type: DataTypes.STRING(60),
            allowNull: false,
            validate: {
                len: [2, 60]
            }
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
            validate: {
                isEmail: true
            }
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                len: [6, 100]
            }
        },
        address: {
            type: DataTypes.STRING(400),
            validate: {
                len: [0, 400]
            }
        },
        role: {
            type: DataTypes.ENUM('admin', 'user', 'store_owner'),
            allowNull: false
        }
    }, {
        tableName: 'users',
        timestamps: true
    });

    return User;
};