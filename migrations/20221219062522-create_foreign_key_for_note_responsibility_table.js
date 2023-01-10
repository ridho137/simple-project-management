'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
    await queryInterface.addConstraint("NotesResponsibilities", {
      fields: ["userId"],
      type: "foreign key",
      name: "note_responsibility_user_fk",
      references: {
        table: "Users",
        field: "id"
      },
      onDelete: "cascade",
      onUpdate: "cascade"
    })

    await queryInterface.addConstraint("NotesResponsibilities", {
      fields: ["noteId"],
      type: "foreign key",
      name: "note_responsibility_note_fk",
      references: {
        table: "Notes",
        field: "id"
      },
      onDelete: "cascade",
      onUpdate: "cascade"
    })
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    await queryInterface.removeConstraint("NotesResponsibilities", "note_responsibility_user_fk")
    await queryInterface.removeColumn("NotesResponsibilities", "userId")
    await queryInterface.removeConstraint("NotesResponsibilities", "note_responsibility_note_fk")
    await queryInterface.removeColumn("NotesResponsibilities", "noteId")
  }
};
