const Sequelize = require('sequelize');

module.exports = class Client extends Sequelize.Model{
    static init(sequelize){
        return super.init({
            clientId: {
                type: Sequelize.STRING(20),
                allowNull: false,
            },

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
