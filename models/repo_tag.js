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

<<<<<<< HEAD
  return RepoTags;
};
=======
  return RepoTag;
};
>>>>>>> f62c4bae5711345b56776d72c1560a89c8e133e4
