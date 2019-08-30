'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.renameColumn('meetups',
  'organizer_id', 'user_id');
 },

  down: (queryInterface, Sequelize) => {
    return queryInterface.renameColumn('meetups', 'user_id', 'organizer_id');
 }
};
