module.exports = function(sequelize, DataTypes) {
  const Tag = sequelize.define('Tag', {
    tagName: DataTypes.STRING,
    tagColor: DataTypes.STRING,
  });

  // Tag.findOrCreate({
  //   where: { id: 1 }, // we search for this is
  //   defaults: [
  //     { tagName: 'HTML', tagColor: '#FFE933' },
  //     { tagName: 'CSS', tagColor: '#FF6E33' },
  //     { tagName: 'Node', tagColor: '#ABA6A5' },
  //     { tagName: 'JavaScript', tagColor: '#7E5B6C' },
  //     { tagName: 'JQUERY', tagColor: '#9116D8' },
  //   ],
  // });

  // Tag.bulkCreate([
  //   { tagName: 'HTML', tagColor: '#FFE933' },
  //   { tagName: 'CSS', tagColor: '#FF6E33' },
  //   { tagName: 'Node', tagColor: '#ABA6A5' },
  //   { tagName: 'JavaScript', tagColor: '#7E5B6C' },
  //   { tagName: 'JQUERY', tagColor: '#9116D8' },
  // ]).then(Tags => {
  //   console.log(Tags);
  // });
  return Tag;
};
