module.exports = function(sequelize, DataTypes) {
  const RepoTags = sequelize.define('RepoTags', {
    repoID: DataTypes.STRING,
    tagID: DataTypes.STRING,
  });

  RepoTags.associate = function(models) {
    RepoTags.hasMany(models.Tag, {
      onDelete: 'cascade',
    });
  };

  return RepoTags;
};