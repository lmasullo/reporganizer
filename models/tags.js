module.exports = function(sequelize, DataTypes) {
  const Tag = sequelize.define('Tag', {
    tagName: DataTypes.STRING,
    tagColor: DataTypes.STRING,
  });

<<<<<<< HEAD
  Tag.bulkCreate([
    { tagName: 'HTML', tagColor: '#FFE933' },
    { tagName: 'CSS', tagColor: '#FF6E33' },
    { tagName: 'Node', tagColor: '#ABA6A5' },
    { tagName: 'JavaScript', tagColor: '#7E5B6C' },
    { tagName: 'JQUERY', tagColor: '#9116D8' },
  ]).then(Tags => {
    console.log(Tags); // ... in order to get the array of Tag objects
  });
=======
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
>>>>>>> f62c4bae5711345b56776d72c1560a89c8e133e4
  return Tag;
};