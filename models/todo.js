module.exports = function(sequelize, DataTypes) {
  let Todo = sequelize.define('Todo', {
    text: DataTypes.STRING,
    complete: DataTypes.BOOLEAN,
  });
  return Todo;
};
