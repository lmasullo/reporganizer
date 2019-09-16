module.exports = function(sequelize, DataTypes) {
  const RepoTag = sequelize.define('RepoTag', {
    repoID: DataTypes.STRING,
    tagID: DataTypes.STRING,
  });

  RepoTag.associate = function(models) {
    RepoTag.hasMany(models.Tag, {
      onDelete: 'cascade',
    });
  };

  return RepoTag;
};
