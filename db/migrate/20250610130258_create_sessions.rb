class CreateSessions < ActiveRecord::Migration[8.0]
  def change
    create_table :sessions do |t|
      t.string :name
      t.integer :focus_time
      t.integer :break_time

      t.timestamps
    end
  end
end
