const Sequelize = require('sequelize');

module.exports = class User extends Sequelize.Model{
    static init(sequelize){
        return super.init({
            snsId: {
                type: Sequelize.STRING(20),
                allowNull: false,
            },
            provider: {
                type: Sequelize.STRING(20),
                allowNull: false,
            },
            email: {
                type: Sequelize.STRING(30),
                allowNull: false,
            },
            nick: {
                type: Sequelize.STRING(20),
                allowNull: false,
            }

		}, {
            sequelize,
            timestamps: false,
            modelName: 'Client',
            tableName: 'Clients',
            paranoid: false,
            charset: 'utf8mb4',
            collate: 'utf8mb4_general_ci',
        });
    }
    static associate(db){
        // db.Play.belongsTo(db.Troupe, { foriegnKey: 'troupe', targetKey: 'id'});
    }
};
