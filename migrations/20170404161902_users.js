exports.up = function(knex, Promise) {
  return Promise.all([
    knex.schema.createTable('users', table => {
      table.increments();
      table.string('first_name')
        .notNullable()
        .defaultTo('');
      table.string('last_name')
        .notNullable()
        .defaultTo('');
      table.string('username')
        .notNullable()
      table.string('email')
        .notNullable()
        .unique();
      table.timestamps(true, true)
      table.specificType('hashed_password', 'char(60)')
        .notNullable()
    })

  ])

};

exports.down = function(knex, Promise) {
  return Promise.all([
    knex.schema.dropTable('users')
  ])
};
