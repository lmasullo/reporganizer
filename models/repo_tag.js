// repoID: DataTypes.STRING,
module.exports = function(sequelize, DataTypes) {
  const RepoTag = sequelize.define('RepoTag', {
    tagID: DataTypes.STRING,
    repoID: DataTypes.INTEGER,
  });

  // RepoTag.associate = function(models) {
  //   RepoTag.hasMany(models.Tag, {
  //     onDelete: 'cascade',
  //   });
  // };

  return RepoTag;
};
