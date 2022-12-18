import Sequelize from 'sequelize';

export default class User extends Sequelize.Model{
    static init(sequelize){
        return super.init({
            snsId: {
                type: Sequelize.TEXT,
                // allowNull: false,
                defaultValue:"daisy@daisy.com"
            },
            provider: {
                type: Sequelize.TEXT,
                allowNull: false,
            },
            email: {
                type: Sequelize.TEXT,
                // allowNull: false,
                defaultValue:"daisy@daisy.com"
            },
            nick: {
                type: Sequelize.TEXT,
                allowNull: false,
            },
            accessToken: {
                type: Sequelize.TEXT,
            },
            refreshToken: {
                type: Sequelize.TEXT,
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
